import { Schema, model } from 'mongoose';
import { IListing, ListingModel } from './listing.interface';
import { ListingPurpose } from './listing.constants';

const listingSchema = new Schema<IListing, ListingModel>({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  purpose: {
    type: String,
    enum: Object.values(ListingPurpose),
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  garage: {
    type: Number,
    required: true,
  },
  totalArea: {
    type: Number,
    required: true,
  },
  landArea: {
    type: Number,
    required: true,
  },
  yearBuilt: {
    type: Number,
    required: true,
  },
  availableFrom: {
    type: Date,
    required: true,
  },
  landmarks: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        distanceInKm: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
});

export const Listing = model<IListing, ListingModel>(
  'Listing',
  listingSchema
);