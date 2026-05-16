import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';
import { Property } from '../property/property.model';

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

// calculate average rating
reviewSchema.statics.calculateAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: { property: propertyId },
    },
    {
      $group: {
        _id: '$property',
        numberOfReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      ratingCount: stats[0].numberOfReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      ratingCount: 0,
      averageRating: 0,
    });
  }
};

// Trigger the calculation after saved
reviewSchema.post('save', function () {
  const model = this as any;
  model.constructor.calculateAverageRating(model.property);
});

// trigger after update queries execute
reviewSchema.post('findOneAndUpdate', { document: true, query: false }, function () {
  const model = this as any;
  model.constructor.calculateAverageRating(model.property);
});

export const Review = model<IReview, ReviewModel>(
  'Review',
  reviewSchema
);