import { z } from 'zod';
import { objectId } from '../../../shared/objectIdValidator';
import { InquiryStatus } from './inquiry.constants';

// create inquiry validation
const createInquiryValidation = z.object({
  body: z.object({
    property: objectId('Property'),
    customer: z.object({
      name: z.string().nonempty('Customer name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().nonempty('Customer phone is required'),
    }),
    message: z.string().nonempty('Message is required'),
  }).strict(),
});

// update inquiry validation
const updateInquiryValidation = z.object({
  params: z.object({
    id: objectId('Inquiry'),
  }).strict(),
  body: z.object({
    status: z.enum([InquiryStatus.Replied, InquiryStatus.Closed]),
  }).strict(),
});

// get inquiry by id validation
const getInquiryByIdValidation = z.object({
  params: z.object({
    id: objectId('Inquiry'),
  }).strict(),
});

export const InquiryValidations = {
  createInquiryValidation,
  updateInquiryValidation,
  getInquiryByIdValidation,
};