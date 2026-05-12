import { z } from 'zod';
import {
  PropertyStatus,
  PropertyStructureType,
} from './property.constants';
import { objectId } from '../../../shared/objectIdValidator';

// create accommodation
const createAccommodationSchema = z.object({
  body: z.object({
    structureType: z.nativeEnum(PropertyStructureType),
    title: z.string().nonempty('Title can not be empty'),
    description: z.string().nonempty('Description can not be empty'),
    price: z.number().positive('Price must be greater than 0'),
    currency: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    location: z
      .object({
        type: z.literal('Point').optional(),
        coordinates: z.array(z.number()).optional(),
      })
      .optional(),
    amenities: z.array(z.string()).min(1, 'Minimum 1 amenity required'),
    images: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
  })
});

// update property
const updatePropertySchema = z.object({
  params: z.object({
    id: objectId('Property ID'),
  }),
  body: z.object({
    structureType: z.nativeEnum(PropertyStructureType).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    currency: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    location: z
      .object({
        type: z.literal('Point').optional(),
        coordinates: z.array(z.number()).optional(),
      })
      .optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
  })
});

export const PropertyValidations = {
  createAccommodationSchema,
  updatePropertySchema,
};
