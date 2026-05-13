import { Schema, model } from 'mongoose';
import { IInquiry, InquiryModel } from './inquiry.interface';
import { InquiryStatus } from './inquiry.constants';

const inquirySchema = new Schema<IInquiry, InquiryModel>({
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

export const Inquiry = model<IInquiry, InquiryModel>(
  'Inquiry',
  inquirySchema
);