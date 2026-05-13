import { Request, Response, NextFunction } from 'express';
import { InquiryServices } from './inquiry.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create inquiry controller
const createInquiry = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.createInquiry(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Inquiry created successfully',
    data: result,
  });
});

// update inquiry controller
const updateInquiry = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.updateInquiry(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inquiry updated successfully',
    data: result,
  });
});

// delete inquiry controller
const deleteInquiry = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.deleteInquiry(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inquiry deleted successfully',
    data: result,
  });
});

// get inquiry by id controller
const getInquiryById = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.getInquiryById(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inquiry fetched successfully',
    data: result,
  });
});

// get all inquiries controller
const getAllInquiries = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.getAllInquiries(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inquiries fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const InquiryController = {
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiryById,
  getAllInquiries,
};
