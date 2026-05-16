import { z } from 'zod';
import { BlogStatus } from './blog.constants';

// Create blog validation schema
const createBlogSchema = z.object({
  body: z
    .object({
      authorName: z.string().min(1, 'Author name is required'),
      title: z.string().min(1, 'Title is required'),
      content: z.string().min(1, 'Content is required'),
      image: z.any().optional(),
      category: z.string().min(1, 'Category is required'),
      publishDate: z.string().date(),
      tags: z.array(z.string()).default([]),
      seo: z
        .object({
          metaTitle: z.string().default(''),
          metaDescription: z.string().default(''),
        })
        .default({}),
      status: z.nativeEnum(BlogStatus).default(BlogStatus.Draft),
    })
    .strict(),
});

// Update blog validation schema
const updateBlogSchema = z.object({
  body: z
    .object({
      authorName: z.string().min(1, 'Author name is required').optional(),
      title: z.string().min(1, 'Title is required').optional(),
      content: z.string().min(1, 'Content is required').optional(),
      image: z.any().optional(),
      category: z.string().min(1, 'Category is required').optional(),
      publishDate: z.string().date().optional(),
      tags: z.array(z.string()).default([]).optional(),
      seo: z
        .object({
          metaTitle: z.string().default(''),
          metaDescription: z.string().default(''),
        })
        .default({})
        .optional(),
      status: z.nativeEnum(BlogStatus).optional(),
    })
    .strict(),
});

// delete blog validation schema
const deleteBlogSchema = z.object({
  params: z
    .object({
      id: z.string().min(1, 'Blog ID is required'),
    })
    .strict(),
});

// get single blog validation schema
const getSingleBlogSchema = z.object({
  params: z
    .object({
      id: z.string().min(1, 'Blog ID is required'),
    })
    .strict(),
});

export const BlogValidations = {
  createBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
  getSingleBlogSchema,
};
