import { Model, ObjectId } from 'mongoose';
import { ReservationStatus, RoomClass } from './reservation.constants';

export interface IReservation {
  _id: ObjectId;
  property: ObjectId;
  customer: ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    pets: number;
  }
  roomClass: RoomClass;
  pricing: {
    pricePerUnit: number;
    units: number;
    subtotal: number;
    serviceFee: number;
    discount: number;
    total: number;
    currency: string;
    isPaid: boolean;
  }
  status: ReservationStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ReservationModel = Model<IReservation>;