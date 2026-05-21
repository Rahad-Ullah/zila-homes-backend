import { AdvertisementServices } from './advertisement.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getSingleFilePath } from '../../../shared/getFilePath';
import ApiError from '../../../errors/ApiError';

// -------------- Create Advertisement --------------
const createAdvertisement = catchAsync(async (req, res) => {
  const image = getSingleFilePath(req.files, 'image');
  if (!image) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Image is required');
  }

  const result = await AdvertisementServices.createAdvertisement({ ...req.body, image });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Advertisement created successfully',
    data: result,
  });
});

// -------------- Update Advertisement --------------
const updateAdvertisement = catchAsync(async (req, res) => {
  const image = getSingleFilePath(req.files, 'image');
  const result = await AdvertisementServices.updateAdvertisement(
    req.params.id as string,
    { ...req.body, image },
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisement updated successfully',
    data: result,
  });
});

// -------------- Delete Advertisement --------------
const deleteAdvertisement = catchAsync(async (req, res) => {
  const result = await AdvertisementServices.deleteAdvertisement(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisement deleted successfully',
    data: result,
  });
});

// -------------- Get All Advertisements --------------
const getAllAdvertisements = catchAsync(async (req, res) => {
  const result = await AdvertisementServices.getAllAdvertisements(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisements fetched successfully',
    data: result,
  });
});

// -------------- Get Active Advertisements --------------
const getActiveAdvertisements = catchAsync(async (req, res) => {
  const result = await AdvertisementServices.getActiveAdvertisements();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Active advertisements fetched successfully',
    data: result,
  });
});

export const AdvertisementController = {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
};
