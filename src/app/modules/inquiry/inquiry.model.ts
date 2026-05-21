import { Schema, model } from 'mongoose';
import { IInquiry, InquiryModel } from './inquiry.interface';
import { InquiryStatus } from './inquiry.constants';
import { autoIncrementPlugin } from '../../../DB/autoIncrementPlugin';

const inquirySchema = new Schema<IInquiry, InquiryModel>({
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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(InquiryStatus),
    default: InquiryStatus.Pending,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// auto increment uid
inquirySchema.plugin(autoIncrementPlugin, {
  incField: 'uid',
  prefix: 'INQ',
  counterId: 'inquiry_sequence',
  padLength: 6
});

export const Inquiry = model<IInquiry, InquiryModel>(
  'Inquiry',
  inquirySchema
);