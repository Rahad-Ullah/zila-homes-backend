import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IProperty } from './property.interface';
import { Property } from './property.model';
import unlinkFile from '../../../shared/unlinkFile';

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


export const PropertyServices = {
  createAccommodation,
  updateAccommodation,
};