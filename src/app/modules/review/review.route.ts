import express from 'express';
import { ReviewController } from './review.controller';
import { ReviewValidations } from './review.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.constant';

const router = express.Router();

// create review
router.post(
    '/create',
    auth(UserRole.Customer),
    validateRequest(ReviewValidations.createReviewValidationSchema),
    ReviewController.createReview,
);

// update review
router.patch(
    '/:id',
    auth(UserRole.Customer),
    validateRequest(ReviewValidations.updateReviewValidationSchema),
    ReviewController.updateReview,
);

// delete review
router.delete(
    '/:id',
    auth(UserRole.Customer, UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ReviewValidations.deleteReviewValidationSchema),
    ReviewController.deleteReview,
);

// get review
router.get(
    '/:id',
    validateRequest(ReviewValidations.getReviewValidationSchema),
    ReviewController.getSingleReview,
);

// get all reviews by property
router.get(
    '/property/:id',
    validateRequest(ReviewValidations.getReviewValidationSchema),
    ReviewController.getAllReviewsByProperty,
);

// get all reviews
router.get(
    '/',
    ReviewController.getAllReviews,
);

export const reviewRoutes = router;