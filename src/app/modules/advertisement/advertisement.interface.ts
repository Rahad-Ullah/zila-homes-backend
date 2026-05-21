import { Model, ObjectId } from 'mongoose';
import { AdvertisementStatus } from './advertisement.constants';

export interface IAdvertisement {
  _id: ObjectId;
  title: string;
  image: string;
  link?: string;
  status: AdvertisementStatus
  createdAt: Date;
  updatedAt: Date;
}

export type AdvertisementModel = Model<IAdvertisement>;