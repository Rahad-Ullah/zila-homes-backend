import { Schema, model } from 'mongoose';
import { IReservation, ReservationModel } from './reservation.interface';
import { ReservationStatus, RoomClass } from './reservation.constants';

const reservationSchema = new Schema<IReservation, ReservationModel>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      adults: {
        type: Number,
        required: true,
      },
      children: {
        type: Number,
        required: true,
      },
      pets: {
        type: Number,
        required: true,
      },
    },
    roomClass: {
      type: String,
      enum: Object.values(RoomClass),
      required: true,
    },
    pricing: {
      pricePerUnit: {
        type: Number,
        required: true,
      },
      units: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
      serviceFee: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'ETB',
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.Pending,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Reservation = model<IReservation, ReservationModel>(
  'Reservation',
  reservationSchema,
);
