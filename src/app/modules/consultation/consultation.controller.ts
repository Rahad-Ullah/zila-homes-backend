import { Request, Response } from 'express';
import { ConsultationServices } from './consultation.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';

// create consultation controller
const createConsultation = catchAsync(async (req: Request, res: Response) => {
  const result = await ConsultationServices.createConsultation(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Consultation created successfully',
    data: result,
  });
});

// update consultation controller
const updateConsultation = catchAsync(async (req: Request, res: Response) => {
  const result = await ConsultationServices.updateConsultation(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Consultation updated successfully',
    data: result,
  });
});

// delete consultation controller
const deleteConsultation = catchAsync(async (req: Request, res: Response) => {
  const result = await ConsultationServices.deleteConsultation(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Consultation deleted successfully',
    data: result,
  });
});

// get consultation by id controller
const getConsultationById = catchAsync(async (req: Request, res: Response) => {
  const result = await ConsultationServices.getConsultationById(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Consultation fetched successfully',
    data: result,
  });
});

// get all consultations controller
const getAllConsultations = catchAsync(async (req: Request, res: Response) => {
  const result = await ConsultationServices.getAllConsultations(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Consultations fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const ConsultationController = {
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getConsultationById,
  getAllConsultations,
};