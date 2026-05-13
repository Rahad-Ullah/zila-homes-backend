import { Model, ObjectId } from 'mongoose';
import { InquiryStatus } from './inquiry.constants';

export type IInquiry = {
  _id: ObjectId;
  property: ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  message: string;
  status: InquiryStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InquiryModel = Model<IInquiry>;