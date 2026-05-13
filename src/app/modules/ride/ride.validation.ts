import { z } from 'zod';
import { RideServiceType, RideStatus } from './ride.constants';
import { objectId } from '../../../shared/objectIdValidator';

// GeoJSON Point validation
const geoPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

// Ride creation validation
const createRideSchema = z.object({
  body: z.object({
    // Customer details
    customer: z.object({
      name: z.string().nonempty('Customer name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().nonempty('Phone number is required'),
    }),
    // Passenger details
    passengerName: z.string().nonempty('Passenger name is required'),
    passengers: z
      .number()
      .int('Passengers must be an integer')
      .positive('Must have at least one passenger')
      .default(1),
    luggage: z
      .number()
      .int('Luggage must be an integer')
      .nonnegative('Luggage cannot be negative')
      .default(0),
    // Trip details
    serviceType: z.nativeEnum(RideServiceType),
    vehicleType: z.string().nonempty('Vehicle type is required'),
    flightNumber: z.string().optional(),
    // Route details
    pickup: z.object({
      address: z.string().nonempty('Address is required'),
      location: geoPointSchema,
    }),
    dropoff: z.object({
      address: z.string().nonempty('Address is required'),
      location: geoPointSchema,
    }),
    pickupAt: z
      .string()
      .datetime()
      .refine(date => new Date(date) > new Date(), {
        message: 'Pickup time must be in the future',
      }),
    // Pricing
    pricing: z.object({
      amount: z.number().positive('Amount must be positive'),
      currency: z
        .string()
        .length(3, 'Currency must be 3 characters')
        .default('USD')
        .optional(),
    }),
  }),
});

// Ride update validation
const updateRideSchema = z.object({
  params: z.object({
    id: objectId('Ride')
  }),
  body: z.object({
    status: z.nativeEnum(RideStatus).optional(),
  })
});

// get ride by id validation
const rideIdSchema = z.object({
  params: z.object({
    id: objectId('Ride')
  }),
});

export const RideValidations = {
  createRideSchema,
  updateRideSchema,
  rideIdSchema,
};
