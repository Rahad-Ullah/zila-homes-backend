import { Schema, model } from 'mongoose';
import { IChapaEvent, ChapaEventModel } from './chapaEvent.interface';

const chapaEventSchema = new Schema<IChapaEvent, ChapaEventModel>({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  processedAt: { type: Date, default: new Date() },
});

export const ChapaEvent = model<IChapaEvent, ChapaEventModel>(
  'ChapaEvent',
  chapaEventSchema,
);
