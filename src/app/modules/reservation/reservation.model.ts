import { Schema, model } from 'mongoose';
import { IReservation, ReservationModel } from './reservation.interface';
import { ReservationStatus, RoomClass } from './reservation.constants';
import { autoIncrementPlugin } from '../../../DB/autoIncrementPlugin';

const reservationSchema = new Schema<IReservation, ReservationModel>(
  {
    uid: {
      type: String,
      unique: true,
      index: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
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

// auto increment uid
reservationSchema.plugin(autoIncrementPlugin, {
  incField: 'uid',
  prefix: 'RES',
  counterId: 'reservation_sequence',
  padLength: 6
});

export const Reservation = model<IReservation, ReservationModel>(
  'Reservation',
  reservationSchema,
);
