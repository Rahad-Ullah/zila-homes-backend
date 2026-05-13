import { Model, ObjectId } from 'mongoose';
import { RideServiceType, RideStatus } from './ride.constants';

// Standard GeoJSON Point structure
export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IRide {
  _id: ObjectId;
  // Passenger Details
  customer: {
    name: string;
    email: string;
    phone: string;
  }
  passengerName: string;
  passengers: number;
  luggage: number;

  // Trip Details
  serviceType: RideServiceType;
  vehicleType: string;
  flightNumber?: string;

  // Route details
  pickup: {
    address: string;
    location: IGeoLocation;
  };
  dropoff: {
    address: string;
    location: IGeoLocation;
  };
  pickupAt: Date;

  // Pricing
  pricing: {
    amount: number;
    currency: string;
  };

  // Metadata
  status: RideStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RideModel = Model<IRide>;