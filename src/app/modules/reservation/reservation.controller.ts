import { Request, Response, NextFunction } from 'express';
import { ReservationServices } from './reservation.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create reservation
const createReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.createReservation({
    ...req.body,
    customer: req.user.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Reservation created successfully',
    data: result,
  });
});

// update reservation
const updateReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.updateReservation(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reservation updated successfully',
    data: result,
  });
});

// delete reservation
const deleteReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.deleteReservation(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reservation deleted successfully',
    data: result,
  });
});

// get reservation by id
const getReservationById = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.getReservationById(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reservation fetched successfully',
    data: result,
  });
});

// get all reservations
const getAllReservations = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.getAllReservations(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reservations fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const ReservationController = {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationById,
  getAllReservations,
};
