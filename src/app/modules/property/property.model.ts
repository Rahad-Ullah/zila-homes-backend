import { Schema, model } from 'mongoose';
import { IProperty, PropertyModel } from './property.interface';
import {
  PropertyCategory,
  PropertyStatus,
  PropertyStructureType,
} from './property.constants';

const propertySchema = new Schema<IProperty, PropertyModel>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(PropertyCategory),
      required: true,
    },
    structureType: {
      type: String,
      enum: Object.values(PropertyStructureType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'ETB',
    },
    address: {
      street: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
      postalCode: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
    },
    images: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.Active,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Property = model<IProperty, PropertyModel>(
  'Property',
  propertySchema,
);
