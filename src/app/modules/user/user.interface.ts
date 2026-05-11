import { Model, ObjectId } from 'mongoose';
import { UserRole, UserStatus } from './user.constant';

export interface IUser {
  _id: ObjectId;
  uid: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  password: string;
  phone: string;
  image?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  location: {
    type: string;
    coordinates: [number, number];
  };
  status: UserStatus;
  isVerified: boolean;
  isOnline: boolean;
  isDeleted: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
