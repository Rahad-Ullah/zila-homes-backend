import { z } from 'zod';
import { ReservationStatus, RoomClass } from './reservation.constants';
import { objectId } from '../../../shared/objectIdValidator';

// create reservation validation
const createReservationValidation = z.object({
  body: z.object({
    property: objectId('property'),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.object({
      adults: z.number().positive('Number of adults must be positive'),
      children: z
        .number()
        .nonnegative('Number of children must be non-negative'),
      pets: z.number().nonnegative('Number of pets must be non-negative'),
    }),
    roomClass: z.nativeEnum(RoomClass),
    pricing: z.object({
      pricePerUnit: z.number().positive('Price per unit must be positive'),
      units: z.number().positive('Number of units must be positive'),
      subtotal: z.number().positive('Subtotal must be positive'),
      serviceFee: z.number().nonnegative('Service fee must be non-negative'),
      discount: z.number().nonnegative('Discount must be non-negative'),
      total: z.number().positive('Total must be positive'),
      currency: z.string().default('ETB').optional(),
    }),
  }),
});

// update reservation validation
const updateReservationValidation = z.object({
  params: z.object({
    id: objectId('reservation'),
  }),
  body: z.object({
    status: z.nativeEnum(ReservationStatus),
  }),
});

// delete reservation validation
const deleteReservationValidation = z.object({
  params: z.object({
    id: objectId('reservation'),
  }),
});

// get reservation by id validation
const getReservationByIdValidation = z.object({
  params: z.object({
    id: objectId('reservation'),
  }),
});

export const ReservationValidations = {
  createReservationValidation,
  updateReservationValidation,
  deleteReservationValidation,
  getReservationByIdValidation,
};
