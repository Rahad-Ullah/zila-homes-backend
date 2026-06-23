import { Schema, model } from 'mongoose';
import { IAdvertisement, AdvertisementModel } from './advertisement.interface';
import { AdvertisementStatus } from './advertisement.constants';

const advertisementSchema = new Schema<IAdvertisement, AdvertisementModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(AdvertisementStatus),
      default: AdvertisementStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

export const Advertisement = model<IAdvertisement, AdvertisementModel>(
  'Advertisement',
  advertisementSchema
);