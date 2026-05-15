import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IProperty } from './property.interface';
import { Property } from './property.model';
import unlinkFile from '../../../shared/unlinkFile';
import { IListing } from '../listing/listing.interface';
import mongoose from 'mongoose';
import { Listing } from '../listing/listing.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { Wishlist } from '../wishlist/wishlist.model';

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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // create property
    const property = await Property.create([payload], { session });
    if (!property) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Property creation failed');
    }

    // attach property id to listing
    payload.property = property[0]._id;

    // create listing
    const listing = await Listing.create([payload], { session });
    if (!listing) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Listing creation failed');
    }

    // attach listing id to property
    property[0].listing = listing[0]._id;
    await property[0].save({ session });

    await session.commitTransaction();
    return { ...property[0].toObject(), listing: listing[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ------------- update listing --------------
const updateListing = async (propertyId: string, payload: IProperty & IListing) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // update property
    const property = await Property.findByIdAndUpdate(propertyId, payload, { session });
    if (!property) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Property not found');
    }

    // update listing
    const listing = await Listing.findByIdAndUpdate(property.listing, payload, { session });
    if (!listing) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Listing not found');
    }

    // unlink old images and video if new images and video are uploaded
    if (payload.images && payload.images.length > 0 && property.images?.length > 0) {
      property.images.forEach((image: string) => {
        unlinkFile(image);
      });
    }
    if (payload.videoUrl && property.videoUrl) {
      unlinkFile(property.videoUrl);
    }

    await session.commitTransaction();
    return { ...property.toObject(), listing };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ------------- delete property by id --------------
const deleteProperty = async (propertyId: string) => {
  const property = await Property.findByIdAndUpdate(propertyId, { isDeleted: true }, { new: true });
  if (!property) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Property not found');
  }
  return property;
};

// ------------- delete my property by id --------------
const deleteMyProperty = async (propertyId: string, userId: string) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Property not found');
  }
  if (property.provider.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this property');
  }
  const result = await Property.findByIdAndUpdate(propertyId, { isDeleted: true }, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Property not found');
  }
  return result;
};

// ------------- get property by id --------------
const getPropertyById = async (propertyId: string) => {
  const property = await Property.findById(propertyId).populate('listing');
  if (!property) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Property not found');
  }
  return property;
};

// ------------- get all properties --------------
const getAllProperties = async (query: Record<string, unknown>) => {
  const propertyQuery = new QueryBuilder(Property.find({ isDeleted: false }).populate('listing'), query)
    .search(['title', 'description'])
    .filter(['userId'])
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    propertyQuery.modelQuery.lean(),
    propertyQuery.getPaginationInfo(),
  ]);

  // if query has userId then attach wishlist
  if (query.userId) {
    const wishlist = await Wishlist.find({ user: query.userId }).lean();
    const wishlistMap = new Map(wishlist.map((wishlist: any) => [wishlist.property.toString(), wishlist]));
    data.forEach((property: any) => {
      property.wishlist = wishlistMap.has(property._id.toString());
    });
  }

  return { data, pagination };
};


export const PropertyServices = {
  createAccommodation,
  updateAccommodation,
  createListing,
  updateListing,
  deleteProperty,
  deleteMyProperty,
  getPropertyById,
  getAllProperties,
};