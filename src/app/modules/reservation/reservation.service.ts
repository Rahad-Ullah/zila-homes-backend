import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Property } from '../property/property.model';
import { IReservation } from './reservation.interface';
import { Reservation } from './reservation.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { PropertyCategory } from '../property/property.constants';
import { User } from '../user/user.model';

// -------------- create reservation --------------
const createReservation = async (
  payload: IReservation,
): Promise<IReservation> => {
  // check if accommodation is available
  const property = await Property.findOne({ _id: payload.property, isDeleted: false });
  if (!property) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
  }
  if (property.category !== PropertyCategory.Accommodation) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Property is not an accommodation');
  }

  // calculate units and price from dates
  const units = Math.ceil(
    (new Date(payload.checkOut).getTime() - new Date(payload.checkIn).getTime()) /
    (1000 * 60 * 60 * 24),
  );
  const pricePerUnit = property.price;
  const subtotal = units * pricePerUnit;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  // create reservation
  const result = await Reservation.create({
    ...payload,
    pricing: {
      pricePerUnit,
      units,
      subtotal,
      serviceFee,
      total,
    },
  });
  // !TODO: initiate payment here
  return result;
};

// -------------- update reservation --------------
const updateReservation = async (
  id: string,
  payload: IReservation,
): Promise<IReservation> => {
  const result = await Reservation.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Reservation not found');
  }
  return result;
};

// -------------- delete reservation --------------
const deleteReservation = async (id: string): Promise<IReservation> => {
  const result = await Reservation.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Reservation not found');
  }
  return result;
};

// -------------- get reservation by id --------------
const getReservationById = async (id: string): Promise<IReservation> => {
  const result = await Reservation.findById(id)
    .populate('property')
    .populate('customer');
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Reservation not found');
  }
  return result;
};

// -------------- get all reservations --------------
const getAllReservations = async (query: Record<string, unknown>) => {
  // prefilter
  const filter: any = { isDeleted: false }
  if (query.searchTerm) {
    const customers = await User.find({
      $or: [
        { firstName: { $regex: query.searchTerm, $options: 'i' } },
        { lastName: { $regex: query.searchTerm, $options: 'i' } },
        { email: { $regex: query.searchTerm, $options: 'i' } },
        { phone: { $regex: query.searchTerm, $options: 'i' } },
      ],
    });
    filter.customer = { $in: customers.map(customer => customer._id) };
  }

  const reservationQuery = new QueryBuilder(
    Reservation.find(filter),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    reservationQuery.modelQuery.populate('property').populate('customer'),
    reservationQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const ReservationServices = {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationById,
  getAllReservations,
};
