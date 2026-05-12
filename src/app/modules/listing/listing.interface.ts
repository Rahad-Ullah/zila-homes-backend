import { Model, ObjectId } from 'mongoose';
import { ListingPurpose } from './listing.constants';

export interface IListing {
  _id: ObjectId;
  property: ObjectId;
  purpose: ListingPurpose;

  // Basic Specifications
  bedrooms: number;
  bathrooms: number;
  garage: number;

  // Measurements
  totalArea: number;
  landArea?: number;

  // Availability
  yearBuilt?: number;
  availableFrom?: Date;

  // Nearby Landmarks
  landmarks: {
    name: string;
    distanceInKm: number;
  }[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type ListingModel = Model<IListing>;
