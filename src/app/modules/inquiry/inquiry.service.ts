import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Property } from '../property/property.model';
import { IInquiry } from './inquiry.interface';
import { Inquiry } from './inquiry.model';
import { InquiryStatus } from './inquiry.constants';
import QueryBuilder from '../../builder/QueryBuilder';

// -------------- create inquiry --------------
const createInquiry = async (payload: IInquiry): Promise<IInquiry> => {
  // check property is valid
  const property = await Property.exists({ _id: payload.property });
  if (!property) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
  }

  // check if too many pending inquiries for this property in last 24 hours
  const inquiries = await Inquiry.countDocuments({
    'customer.email': payload.customer.email,
    property: payload.property,
    status: InquiryStatus.Pending,
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });
  if (inquiries >= 3) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'We are processing your inquiries. Please try again later.',
    );
  }

  // create inquiry
  const result = await Inquiry.create(payload);
  return result;
};

// -------------- update inquiry --------------
const updateInquiry = async (
  id: string,
  payload: IInquiry,
): Promise<IInquiry | null> => {
  const result = await Inquiry.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Inquiry not found');
  }
  return result;
};

// -------------- delete inquiry --------------
const deleteInquiry = async (id: string): Promise<IInquiry | null> => {
  const result = await Inquiry.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Inquiry not found');
  }
  return result;
};

// -------------- get inquiry by id --------------
const getInquiryById = async (id: string): Promise<IInquiry | null> => {
  const result = await Inquiry.findById(id).populate('property');
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Inquiry not found');
  }
  return result;
};

// -------------- get all inquiries --------------
const getAllInquiries = async (query: Record<string, unknown>) => {
  const inquiryQuery = new QueryBuilder(Inquiry.find(), query)
    .search(['customer.name', 'customer.email', 'customer.phone'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    inquiryQuery.modelQuery.populate('property').lean(),
    inquiryQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const InquiryServices = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
};
