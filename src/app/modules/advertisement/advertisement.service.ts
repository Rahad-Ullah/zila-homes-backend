import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAdvertisement } from './advertisement.interface';
import { Advertisement } from './advertisement.model';
import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
import { AdvertisementStatus } from './advertisement.constants';

// -------------- Create Advertisement --------------
const createAdvertisement = async (
  payload: IAdvertisement,
): Promise<IAdvertisement> => {
  const result = await Advertisement.create(payload);
  return result;
};

// -------------- Update Advertisement --------------
const updateAdvertisement = async (
  id: string,
  payload: Partial<IAdvertisement>,
): Promise<IAdvertisement | null> => {
  // check if advertisement exists
  const isExist = await Advertisement.findById(id);

  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  const result = await Advertisement.findByIdAndUpdate(id, payload, {
    new: true,
  });

  // unlink old image if new image is uploaded
  if (payload.image && isExist.image) {
    unlinkFile(isExist.image);
  }

  return result;
};

// -------------- Delete Advertisement --------------
const deleteAdvertisement = async (
  id: string,
): Promise<IAdvertisement | null> => {
  const isExist = await Advertisement.findById(id);

  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  // unlink image
  if (isExist.image) {
    unlinkFile(isExist.image);
  }

  const result = await Advertisement.findByIdAndDelete(id);

  return result;
};

// -------------- Get All Advertisements --------------
const getAllAdvertisements = async (query: Record<string, unknown>) => {
  const adQuery = new QueryBuilder(Advertisement.find(), query)
    .search(['title'])
    .filter()
    .sort()
    .fields();

  const data = await adQuery.modelQuery.lean();

  return data;
};

// -------------- get active advertisements --------------
const getActiveAdvertisements = async () => {
  const result = await Advertisement.find({ status: AdvertisementStatus.ACTIVE });
  return result;
};

export const AdvertisementServices = {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
};
