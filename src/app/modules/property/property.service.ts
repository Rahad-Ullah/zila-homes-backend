import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IProperty } from './property.interface';
import { Property } from './property.model';
import unlinkFile from '../../../shared/unlinkFile';
import { IListing } from '../listing/listing.interface';
import mongoose from 'mongoose';
import { Listing } from '../listing/listing.model';

// ------------- create accommodation -------------
const createAccommodation = async (payload: IProperty): Promise<IProperty> => {
  const result = await Property.create(payload);
  return result;
};

// ------------ update accommodation -------------
const updateAccommodation = async (id: string, payload: IProperty): Promise<IProperty | null> => {
  const existingProperty = await Property.findById(id);
  if (!existingProperty) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
  }

  // unlink old images and video if new images and video are uploaded
  if (payload.images && payload.images.length > 0 && existingProperty.images?.length > 0) {
    existingProperty.images.forEach((image: string) => {
      unlinkFile(image);
    });
  }
  if (payload.videoUrl && existingProperty.videoUrl) {
    unlinkFile(existingProperty.videoUrl);
  }
  const result = await Property.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

// ------------- create listing --------------
const createListing = async (payload: IProperty & IListing) => {
  // create both listing and property with transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const property = await Property.create([payload], { session });
    if (!property) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Property creation failed');
    }

    // attach property id to listing
    payload.property = property[0]._id;

    const listing = await Listing.create([payload], { session });
    if (!listing) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Listing creation failed');
    }
    await session.commitTransaction();
    return { ...property[0], listing: listing[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


export const PropertyServices = {
  createAccommodation,
  updateAccommodation,
  createListing,
};