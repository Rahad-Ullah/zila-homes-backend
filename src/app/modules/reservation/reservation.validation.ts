import { z } from 'zod';
import { ReservationStatus, RoomClass } from './reservation.constants';
import { objectId } from '../../../shared/objectIdValidator';

// create reservation validation
const createReservationValidation = z.object({
  body: z.object({
    property: objectId('property'),
    checkIn: z.string().date().refine((date) => new Date(date) > new Date(), {
      message: 'Check-in date must be in the future',
    }),
    checkOut: z.string().date().refine((date) => new Date(date) > new Date(), {
      message: 'Check-out date must be in the future',
    }),
    guests: z.object({
      adults: z.number().positive('Number of adults must be positive'),
      children: z
        .number()
        .nonnegative('Number of children must be non-negative'),
      pets: z.number().nonnegative('Number of pets must be non-negative'),
    }),
    roomClass: z.nativeEnum(RoomClass),
  })
    .strict()
    .refine(data => new Date(data.checkOut) > new Date(data.checkIn), {
      message: 'Check-out date must be after check-in date',
    }),
});

// update reservation validation
const updateReservationValidation = z.object({
  params: z.object({
    id: objectId('reservation'),
  }).strict(),
  body: z.object({
    status: z.nativeEnum(ReservationStatus),
  }).strict(),
});

// delete reservation validation
const deleteReservationValidation = z.object({
  params: z.object({
    id: objectId('reservation'),
  }).strict(),
});

// get reservation by id validation
const getReservationByIdValidation = z.object({
  params: z.object({
    id: objectId('reservation'),
  }).strict(),
});

export const ReservationValidations = {
  createReservationValidation,
  updateReservationValidation,
  deleteReservationValidation,
  getReservationByIdValidation,
};
