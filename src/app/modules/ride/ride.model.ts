import { Schema, model } from 'mongoose';
import { IRide, RideModel } from './ride.interface';
import { RideServiceType, RideStatus } from './ride.constants';

const rideSchema = new Schema<IRide, RideModel>(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    passengerName: { type: String, required: true },
    passengers: { type: Number, required: true },
    luggage: { type: Number, required: true },
    serviceType: {
      type: String,
      enum: Object.values(RideServiceType),
      required: true,
    },
    vehicleType: { type: String, required: true },
    flightNumber: { type: String },
    pickup: {
      address: { type: String, required: true },
      location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number, Number], required: true },
      },
    },
    dropoff: {
      address: { type: String, required: true },
      location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number, Number], required: true },
      },
    },
    pickupAt: { type: Date, required: true },
    pricing: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'ETB' },
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.Pending,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Ride = model<IRide, RideModel>('Ride', rideSchema);
