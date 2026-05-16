import { Request, Response, NextFunction } from 'express';
import { BlogServices } from './blog.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { generateSlug } from '../../../utils/generateSlug';
import { getMultipleFilesPath } from '../../../shared/getFilePath';

// create blog controller
const createBlog = catchAsync(async (req: Request, res: Response) => {
  const slug = generateSlug(req.body.title);
  const images = getMultipleFilesPath(req.files, 'image');
  const result = await BlogServices.createBlog({ ...req.body, images, slug });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

// update blog controller
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const images = getMultipleFilesPath(req.files, 'image');
  if (payload.title) {
    payload.slug = generateSlug(payload.title);
  }
  const result = await BlogServices.updateBlog(req.params.id as string, {
    ...payload,
    images,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

// delete blog controller
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.deleteBlog(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

// get single blog controller
const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getSingleBlog(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog fetched successfully',
    data: result,
  });
});

// get all blogs controller
const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getAllBlogs(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blogs fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const BlogController = {
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
  getAllBlogs,
};
