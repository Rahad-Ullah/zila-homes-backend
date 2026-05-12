import { Model, ObjectId } from 'mongoose';
import { PropertyCategory, PropertyStatus, PropertyStructureType } from './property.constants';

export interface IProperty {
  _id: ObjectId;
  provider: ObjectId;
  category: PropertyCategory;
  structureType: PropertyStructureType;
  title: string;
  description: string;
  price: number;
  currency: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  location: {
    type: string;
    coordinates: [number, number];
  }
  amenities: string[];
  images: string[];
  videoUrl: string;
  isFeatured: boolean;
  isVerified: boolean;
  verifiedAt: Date;
  status: PropertyStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

};

export type PropertyModel = Model<IProperty>;