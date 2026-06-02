import { Request, Response, NextFunction } from 'express';
import { AnalyticsServices } from './analytics.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// -------------- get admin overview --------------
const getAdminOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getAdminOverview(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin overview fetched successfully',
    data: result,
  });
});

export const AnalyticsController = {
  getAdminOverview,
};