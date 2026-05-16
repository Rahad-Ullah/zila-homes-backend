import { Model, ObjectId } from 'mongoose';
import { BlogStatus } from './blog.constants';

export interface IBlog {
  _id: ObjectId;
  authorName: string;
  title: string;
  slug: string; // e.g., "how-to-buy-property-in-dhaka"
  content: string;
  images: string[];
  category: string;
  publishDate?: Date;
  tags: string[];

  // SEO Metadata Object
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };

  // Settings & Tracking
  status: BlogStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogModel = Model<IBlog>;