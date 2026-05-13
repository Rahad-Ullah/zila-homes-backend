import { Request, Response } from 'express';
import { RideServices } from './ride.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';

// create ride
const createRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RideServices.createRide(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Ride created successfully',
    data: result,
  });
});

// update ride
const updateRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RideServices.updateRide(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Ride updated successfully',
    data: result,
  });
});

// delete ride
const deleteRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RideServices.deleteRide(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Ride deleted successfully',
    data: result,
  });
});

// get ride by id
const getRideById = catchAsync(async (req: Request, res: Response) => {
  const result = await RideServices.getRideById(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Ride fetched successfully',
    data: result,
  });
});

// get all rides
const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const result = await RideServices.getAllRides(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Rides fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const RideController = {
  createRide,
  updateRide,
  deleteRide,
  getRideById,
  getAllRides,
};