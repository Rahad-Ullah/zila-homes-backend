import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview, ReviewModel>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Review = model<IReview, ReviewModel>(
  'Review',
  reviewSchema
);