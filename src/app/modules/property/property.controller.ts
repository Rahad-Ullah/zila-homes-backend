import { Request, Response } from 'express';
import { PropertyServices } from './property.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { PropertyCategory } from './property.constants';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import ApiError from '../../../errors/ApiError';

// create accommodation
const createAccommodation = catchAsync(async (req: Request, res: Response) => {
  const images = getMultipleFilesPath(req, 'image');
  const videoUrl = getSingleFilePath(req, 'media');
  // check if images and videoUrl is empty
  if (!Array.isArray(images) || images.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Minimum 1 image is required');
  }
  if (!videoUrl) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Video is required');
  }

  const payload = {
    provider: req.user.id,
    category: PropertyCategory.Accommodation,
    images,
    videoUrl,
    ...req.body,
  };

  const result = await PropertyServices.createAccommodation(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Accommodation created successfully',
    data: result,
  });
});

// update accommodation
const updateAccommodation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const images = getMultipleFilesPath(req, 'image');
  const videoUrl = getSingleFilePath(req, 'media');
  const payload = {
    images,
    videoUrl,
    ...req.body,
  };

  const result = await PropertyServices.updateAccommodation(id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Accommodation updated successfully',
    data: result,
  });
});

// create listing
const createListing = catchAsync(async (req: Request, res: Response) => {
  const images = getMultipleFilesPath(req, 'image');
  const videoUrl = getSingleFilePath(req, 'media');
  // check if images and videoUrl is empty
  if (!Array.isArray(images) || images.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Minimum 1 image is required');
  }
  if (!videoUrl) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Video is required');
  }

  const payload = {
    provider: req.user.id,
    category: PropertyCategory.Listing,
    images,
    videoUrl,
    ...req.body,
  };

  const result = await PropertyServices.createListing(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Listing created successfully',
    data: result,
  });
});

export const PropertyController = {
  createAccommodation,
  updateAccommodation,
  createListing,
};