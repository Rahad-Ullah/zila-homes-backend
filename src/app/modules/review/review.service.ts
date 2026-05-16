import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { Property } from '../property/property.model';
import { Inquiry } from '../inquiry/inquiry.model';
import { Reservation } from '../reservation/reservation.model';
import { PropertyCategory } from '../property/property.constants';
import { InquiryStatus } from '../inquiry/inquiry.constants';
import { ReservationStatus } from '../reservation/reservation.constants';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';

// ------------- Create Review -------------
const createReview = async (payload: IReview) => {
  // get the user
  const user = await User.findById(payload.customer);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  // check if the property is verified
  const property = await Property.findById(payload.property);
  if (!property) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Property not found');
  }

  // check if user tried too many times to review in 24 hours
  const existingReviews = await Review.find({
    customer: payload.customer,
    property: payload.property,
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  if (existingReviews.length >= 1) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You have already reviewed this property',
    );
  }

  // check if the user has inquiry or reservation on this property
  if (property.category === PropertyCategory.Listing) {
    const inquiry = await Inquiry.exists({
      customer: { email: user.email },
      property: payload.property,
      status: { $ne: InquiryStatus.Pending },
    });
    if (inquiry) {
      payload.isVerified = true;
    }
  } else if (property.category === PropertyCategory.Accommodation) {
    const reservation = await Reservation.exists({
      customer: payload.customer,
      property: payload.property,
      status: ReservationStatus.Completed,
    });
    if (reservation) {
      payload.isVerified = true;
    }
  }

  const result = await Review.create(payload);
  return result;
};

// ------------- update review -------------
const updateReview = async (id: string, payload: IReview) => {
  // check if review exists
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review not found');
  }

  // check if user is authorized to update review
  if (review.customer.toString() !== payload.customer.toString()) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You are not authorized to update this review',
    );
  }

  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// ------------- delete review -------------
const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review not found');
  }
  return result;
};

// ------------- get review -------------
const getSingleReview = async (id: string) => {
  const result = await Review.findById(id)
    .populate('customer')
    .populate('property');
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review not found');
  }
  return result;
};

// ------------- get all reviews by property -------------
const getAllReviewsByProperty = async (propertyId: string) => {
  const result = await Review.find({ property: propertyId })
    .populate('customer', 'firstName lastName email image')
    .populate('property');
  return result;
};

// ------------- get all reviews -------------
const getAllReviews = async (query: Record<string, unknown>) => {
  const filter = { isDeleted: false } as any;
  // pre-filter user
  if (query.searchTerm) {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query.searchTerm, $options: 'i' } },
        { lastName: { $regex: query.searchTerm, $options: 'i' } },
        { email: { $regex: query.searchTerm, $options: 'i' } },
      ],
    });
    filter.customer = { $in: users.map(user => user._id) };
  }

  const reviewQuery = new QueryBuilder(Review.find(filter), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    reviewQuery.modelQuery.populate('customer').populate('property'),
    reviewQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const ReviewServices = {
  createReview,
  updateReview,
  deleteReview,
  getSingleReview,
  getAllReviewsByProperty,
  getAllReviews,
};
