import { Model, Types } from 'mongoose';

export type IChapaEvent = {
  _id: Types.ObjectId;
  id: string;
  type: string;
  processedAt: Date;
};

export type ChapaEventModel = Model<IChapaEvent>;
