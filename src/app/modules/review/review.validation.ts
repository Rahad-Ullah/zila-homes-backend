import { z } from 'zod';
import { objectId } from '../../../shared/objectIdValidator';

// create review
const createReviewValidationSchema = z.object({
  body: z.object({
    property: objectId('Property'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().nonempty('Comment is required'),
  })
});

// update review
const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
    comment: z.string().nonempty('Comment is required').optional(),
  })
});

// delete review
const deleteReviewValidationSchema = z.object({
  params: z.object({
    id: objectId('Review'),
  })
});

// get review
const getReviewValidationSchema = z.object({
  params: z.object({
    id: objectId('Review'),
  })
});

export const ReviewValidations = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
  deleteReviewValidationSchema,
  getReviewValidationSchema,
};