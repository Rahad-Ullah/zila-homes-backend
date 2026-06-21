import { Ride } from './ride.model';
import { IRide } from './ride.interface';
import { RideStatus } from './ride.constants';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { UserRole, UserStatus } from '../user/user.constant';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { NotificationType } from '../notification/notification.constant';

// -------------- create ride --------------
const createRide = async (payload: IRide): Promise<IRide> => {
  // check if too many pending inquiries for this property in last 24 hours
  const rides = await Ride.countDocuments({
    'customer.email': payload.customer.email,
    status: RideStatus.Pending,
    pickupAt: payload.pickupAt,
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  if (rides > 5) {
    throw new Error('Too many ride requests detected. Please try again later.');
  }

  const result = await Ride.create(payload);

  // send notification to the admin
  const admins = await User.find({
    role: UserRole.Admin,
    status: UserStatus.Active,
    isDeleted: false,
  });
  // Fire all admin notifications concurrently in the background
  Promise.all(
    admins.map(admin =>
      sendNotifications({
        type: NotificationType.Ride,
        receiver: admin._id,
        title: 'New Transportation Request',
        message: `You have a new transportation request!`,
        referenceId: result._id.toString(),
      }),
    ),
  ).catch(error => {
    console.error(
      'Failed to send notification on create ride to admins:',
      error,
    );
  });

  return result;
};

// -------------- update ride --------------
const updateRide = async (
  id: string,
  payload: Partial<IRide>,
): Promise<IRide> => {
  const result = await Ride.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Ride not found');
  }
  return result;
};

// -------------- delete ride --------------
const deleteRide = async (id: string): Promise<IRide> => {
  const result = await Ride.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new Error('Ride not found');
  }
  return result;
};

// -------------- get ride by id --------------
const getRideById = async (id: string): Promise<IRide> => {
  const result = await Ride.findById(id);
  if (!result) {
    throw new Error('Ride not found');
  }
  return result;
};

// -------------- get all rides --------------
const getAllRides = async (query: Record<string, unknown>) => {
  const rideQuery = new QueryBuilder(Ride.find({ isDeleted: false }), query)
    .search([
      'customer.name',
      'customer.email',
      'customer.phone',
      'passengerName',
    ])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    rideQuery.modelQuery.lean(),
    rideQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const RideServices = {
  createRide,
  updateRide,
  deleteRide,
  getRideById,
  getAllRides,
};
