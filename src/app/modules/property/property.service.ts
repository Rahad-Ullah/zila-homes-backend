import { IProperty } from './property.interface';
import { Property } from './property.model';

// ------------- create accommodation -------------
const createAccommodation = async (payload: IProperty): Promise<IProperty> => {
  const result = await Property.create(payload);
  return result;
};


export const PropertyServices = {
  createAccommodation,
};