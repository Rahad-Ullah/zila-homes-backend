import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';

// ------------ create blog service ------------
const createBlog = async (payload: IBlog): Promise<IBlog> => {
  // check if images are uploaded
  if (!payload.images || payload.images.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Minimum 1 image is required');
  }

  // check if the title already taken
  const existingBlog = await Blog.exists({ slug: payload.slug });
  if (existingBlog) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog title already taken');
  }

  const result = await Blog.create(payload);
  return result;
};

// ------------ update blog service ------------
const updateBlog = async (id: string, payload: IBlog): Promise<IBlog> => {
  // check if the blog exists
  const existingBlog = await Blog.findById(id);
  if (!existingBlog) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  // check if the blog title already taken
  const existingBlogTitle = await Blog.exists({
    slug: payload.slug,
    _id: { $ne: id },
  });
  if (existingBlogTitle) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog title already taken');
  }

  const result = await Blog.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  // unlink old images
  if (
    payload.images &&
    payload.images.length > 0 &&
    existingBlog.images.length > 0
  ) {
    existingBlog.images.forEach((image: string) => {
      unlinkFile(image);
    });
  }

  return result;
};

// ------------ delete blog service ------------
const deleteBlog = async (id: string): Promise<IBlog> => {
  const result = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  return result;
};

// ------------ get single blog service ------------
const getSingleBlog = async (id: string): Promise<IBlog> => {
  const result = await Blog.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  return result;
};

// ------------ get all blogs service ------------
const getAllBlogs = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find({ isDeleted: false }), query)
    .search(['title', 'slug', 'content', 'category', 'tags'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    blogQuery.modelQuery.lean(),
    blogQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const BlogServices = {
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
  getAllBlogs,
};
