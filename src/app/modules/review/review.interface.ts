import { Model, ObjectId } from 'mongoose';

export interface IReview {
  _id: ObjectId;
  customer: ObjectId;
  property: ObjectId;
  rating: number;
  comment: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewModel = Model<IReview>;