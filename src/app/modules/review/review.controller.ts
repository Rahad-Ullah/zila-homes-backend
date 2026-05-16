import { Request, Response, NextFunction } from 'express';
import { ReviewServices } from './review.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.createReview({
    ...req.body,
    customer: req.user?.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

// update review
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.updateReview(req.params.id, {
    ...req.body,
    customer: req.user?.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

// delete review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.deleteReview(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

// get review
const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getSingleReview(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review fetched successfully',
    data: result,
  });
});


// get all reviews by property
const getAllReviewsByProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviewsByProperty(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
  });
});

// get all reviews
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviews(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
  getSingleReview,
  getAllReviewsByProperty,
  getAllReviews,
};
