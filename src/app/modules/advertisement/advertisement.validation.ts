import { z } from 'zod';
import { AdvertisementStatus } from './advertisement.constants';

// create advertisement validation
const createAdvertisementValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.any().optional(),
    link: z.string().url('Invalid URL').optional(),
  }),
});

// update advertisement validation
const updateAdvertisementValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    image: z.any().optional(),
    link: z.string().url('Invalid URL').optional(),
    status: z.nativeEnum(AdvertisementStatus).optional(),
  }),
});

export const AdvertisementValidations = {
  createAdvertisementValidation,
  updateAdvertisementValidation,
};