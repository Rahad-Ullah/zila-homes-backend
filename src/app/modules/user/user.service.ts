import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../utils/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { UserRole, UserStatus, VerificationStatus } from './user.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { NotificationType } from '../notification/notification.constant';

const createUserToDB = async (payload: Partial<IUser>) => {
  // check if user is exist
  const isExistUser = await User.exists({ email: payload.email });
  if (isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists!');
  }

  // create user
  const createdUser = await User.create(payload);
  if (!createdUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP(6);
  const values = {
    name: createdUser.firstName,
    otp: otp,
    email: createdUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save otp to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  };
  await User.findOneAndUpdate(
    { _id: createdUser._id },
    { $set: { authentication } },
  );

  return { message: 'Account created successfully. Please verify your email.' };
};

const getSingleUserFromDB = async (id: string): Promise<Partial<IUser>> => {
  const user = await User.isExistUserById(id);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return user;
};

const getProfileFromDB = async (id: string): Promise<Partial<IUser>> => {
  const user = await User.findById(id).select('+verification');
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // check if user is deleted
  if (user.isDeleted) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'It looks like your account has been deleted or deactivated.',
    );
  }

  //check user status
  if (user.status !== UserStatus.Active) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'It looks like your account has been suspended or deactivated.',
    );
  }

  return user;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// ------------ update kyc ------------
const updateKycToDB = async (
  userId: string,
  payload: { documents: string[] },
): Promise<Partial<IUser | null>> => {
  const existingUser = await User.findById(userId).select('+verification');
  if (!existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // check if user already verified
  if (existingUser?.verification?.status === VerificationStatus.Verified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You are already verified!');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        verification: {
          documents: payload.documents,
          status: VerificationStatus.Pending,
          submittedAt: new Date(),
        },
      },
    },
    { new: true },
  );

  //unlink file here
  if (
    payload.documents &&
    payload.documents.length > 0 &&
    existingUser?.verification?.documents &&
    existingUser.verification.documents.length > 0
  ) {
    existingUser.verification.documents.forEach((doc: string) => {
      unlinkFile(doc);
    });
  }

  // send notification to admin
  const admins = await User.find({
    role: { $in: [UserRole.Admin, UserRole.SuperAdmin] },
    status: UserStatus.Active,
    isDeleted: false,
  });
  if (result && admins.length > 0) {
    const notificationPromises = admins.map(admin =>
      sendNotifications({
        type: NotificationType.KycRequest,
        title: 'Verification Request',
        message: `Verification request from ${existingUser.firstName} ${existingUser.lastName}.`,
        receiver: admin._id,
        referenceId: result._id.toString(),
      }).catch(error => {
        console.error(
          `KYC Review Notification Failed for admin ${admin._id}:`,
          error,
        );
      }),
    );

    // Execute all notifications in parallel without blocking the main thread
    Promise.all(notificationPromises);
  }

  return result;
};

// ------------ review kyc ------------
const reviewKycToDB = async (
  userId: string,
  payload: { status: VerificationStatus; reviewNotes?: string; reviewedBy: string },
): Promise<Partial<IUser | null>> => {
  const existingUser = await User.findById(userId).select('+verification');
  if (!existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        verification: {
          status: payload.status,
          reviewNotes: payload.reviewNotes,
          reviewedAt: new Date(),
          reviewedBy: new Types.ObjectId(payload.reviewedBy),
          documents: existingUser?.verification?.documents,
          submittedAt: existingUser?.verification?.submittedAt,
        },
      },
    },
    { new: true },
  );

  // send notification to user
  if (result) {
    sendNotifications({
      type: NotificationType.KycReview,
      title: 'Verification Review',
      message: `Your verification request has been ${payload.status}`,
      receiver: result._id,
      referenceId: result._id.toString(),
    }).catch(error => {
      console.error('KYC Review Notification Failed:', error);
    });
  }

  return result;
};

// ------------ update user status ------------
const updateStatusToDB = async (
  id: string,
  payload: { status: UserStatus },
): Promise<Partial<IUser | null>> => {
  const isExistUser = await User.exists({ _id: id });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// ------------ get all users ------------
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isDeleted: false, role: { $ne: UserRole.SuperAdmin } }).select('+verification'),
    query,
  )
    .search(['firstName', 'lastName', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [users, pagination] = await Promise.all([
    userQuery.modelQuery.lean(),
    userQuery.getPaginationInfo(),
  ]);

  return { users, pagination };
};

export const UserService = {
  createUserToDB,
  getSingleUserFromDB,
  getProfileFromDB,
  updateProfileToDB,
  updateKycToDB,
  reviewKycToDB,
  updateStatusToDB,
  getAllUsersFromDB,
};
