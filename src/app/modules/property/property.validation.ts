import { z } from 'zod';
import { PropertyStatus, PropertyStructureType } from './property.constants';
import { objectId } from '../../../shared/objectIdValidator';
import { ListingPurpose } from '../listing/listing.constants';

// create accommodation
const createAccommodationSchema = z.object({
  body: z
    .object({
      structureType: z.nativeEnum(PropertyStructureType),
      title: z.string().nonempty('Title can not be empty'),
      description: z.string().nonempty('Description can not be empty'),
      price: z.number().positive('Price must be greater than 0'),
      currency: z.string().optional(),
      address: z.object({
        street: z.string(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string(),
      }),
      location: z.object({
        type: z.literal('Point').default('Point'),
        coordinates: z.array(z.number()),
      }),
      amenities: z.array(z.string()).min(1, 'Minimum 1 amenity required'),
      image: z.array(z.string()).optional(),
      media: z.string().optional(),
    })
    .strict(),
});

// update property
const updatePropertySchema = z.object({
  params: z
    .object({
      id: objectId('Property ID'),
    })
    .strict(),
  body: z
    .object({
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
      image: z.array(z.string()).optional(),
      media: z.string().optional(),
      status: z.nativeEnum(PropertyStatus).optional(),
    })
    .strict(),
});

// create listing
const createListingSchema = z.object({
  body: z
    .object({
      structureType: z.nativeEnum(PropertyStructureType),
      title: z.string().nonempty('Title can not be empty'),
      description: z.string().nonempty('Description can not be empty'),
      price: z.number().positive('Price must be greater than 0'),
      currency: z.string().optional(),
      address: z.object({
        street: z.string(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string(),
      }),
      location: z.object({
        type: z.literal('Point').default('Point'),
        coordinates: z.array(z.number()),
      }),
      amenities: z.array(z.string()).min(1, 'Minimum 1 amenity required'),
      image: z.array(z.string()).optional(),
      media: z.string().optional(),
      // listing specific fields
      purpose: z.nativeEnum(ListingPurpose),
      bedrooms: z.number().positive('Bedrooms must be greater than 0'),
      bathrooms: z.number().positive('Bathrooms must be greater than 0'),
      garage: z
        .number()
        .nonnegative('Garage must be greater than or equal to 0'),
      totalArea: z.number().positive('Total area must be greater than 0'),
      landArea: z.number().positive('Land area must be greater than 0'),
      yearBuilt: z
        .number()
        .refine(
          val => val <= new Date().getFullYear(),
          'Year built must be less than or equal to current year',
        ),
      availableFrom: z.coerce.date(),
      landmarks: z.array(
        z.object({
          name: z.string(),
          distanceInKm: z
            .number()
            .nonnegative('Distance must be greater than or equal to 0'),
        }),
      ),
    })
    .strict(),
});

// update listing
const updateListingSchema = z.object({
  params: z
    .object({
      id: objectId('Listing ID'),
    })
    .strict(),
  body: z
    .object({
      structureType: z.nativeEnum(PropertyStructureType).optional(),
      title: z.string().nonempty('Title can not be empty').optional(),
      description: z
        .string()
        .nonempty('Description can not be empty')
        .optional(),
      price: z.number().positive('Price must be greater than 0').optional(),
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
          type: z.literal('Point').default('Point').optional(),
          coordinates: z.array(z.number()).optional(),
        })
        .optional(),
      amenities: z.array(z.string()).optional(),
      image: z.array(z.string()).optional(),
      media: z.string().optional(),
      status: z.nativeEnum(PropertyStatus).optional(),
      // listing specific fields
      purpose: z.nativeEnum(ListingPurpose).optional(),
      bedrooms: z
        .number()
        .positive('Bedrooms must be greater than 0')
        .optional(),
      bathrooms: z
        .number()
        .positive('Bathrooms must be greater than 0')
        .optional(),
      garage: z
        .number()
        .nonnegative('Garage must be greater than or equal to 0')
        .optional(),
      totalArea: z
        .number()
        .positive('Total area must be greater than 0')
        .optional(),
      landArea: z
        .number()
        .positive('Land area must be greater than 0')
        .optional(),
      yearBuilt: z
        .number()
        .refine(
          val => val <= new Date().getFullYear(),
          'Year built must be less than or equal to current year',
        )
        .optional(),
      availableFrom: z.coerce.date().optional(),
      landmarks: z
        .array(
          z.object({
            name: z.string(),
            distanceInKm: z
              .number()
              .nonnegative('Distance must be greater than or equal to 0'),
          }),
      )
        .optional(),
    })
    .strict(),
});

export const PropertyValidations = {
  createAccommodationSchema,
  updatePropertySchema,
  createListingSchema,
  updateListingSchema,
};
