import { Schema, model } from 'mongoose';
import { IBlog, BlogModel } from './blog.interface';
import { BlogStatus } from './blog.constants';

const blogSchema = new Schema<IBlog, BlogModel>({
  authorName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  seo: {
    metaTitle: {
      type: String,
      default: ""
    },
    metaDescription: {
      type: String,
      default: ""
    },
  },
  status: {
    type: String,
    enum: Object.values(BlogStatus),
    default: BlogStatus.Draft,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Blog = model<IBlog, BlogModel>('Blog', blogSchema);