import express from 'express';
import { BlogController } from './blog.controller';
import { BlogValidations } from './blog.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// create blog
router.post(
    '/create',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(BlogValidations.createBlogSchema),
    BlogController.createBlog
);

// update blog
router.patch(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(BlogValidations.updateBlogSchema),
    BlogController.updateBlog
);

// delete blog
router.delete(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(BlogValidations.deleteBlogSchema),
    BlogController.deleteBlog
);

// get single blog
router.get(
    '/:id',
    validateRequest(BlogValidations.getSingleBlogSchema),
    BlogController.getSingleBlog
);

// get all blogs
router.get(
    '/',
    BlogController.getAllBlogs
);

export const blogRoutes = router;