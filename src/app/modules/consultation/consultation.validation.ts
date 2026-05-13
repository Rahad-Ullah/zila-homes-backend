import { z } from 'zod';
import { ConsultationStatus, ConsultationType } from './consultation.constants';
import { objectId } from '../../../shared/objectIdValidator';

// create consultation validation
const createConsultationValidation = z.object({
  body: z.object({
    type: z.nativeEnum(ConsultationType).optional(),
    customer: z.object({
      name: z.string().nonempty('Name is required'),
      email: z.string().email('Email is required'),
      phone: z.string().nonempty('Phone is required'),
    }),
    message: z.string().nonempty('Message is required'),
  })
});

// update consultation validation
const updateConsultationValidation = z.object({
  params: z.object({
    id: objectId('Consultation'),
  }),
  body: z.object({
    status: z.nativeEnum(ConsultationStatus).optional(),
    assignedConsultant: z.string().optional(),
    scheduledAt: z.string().datetime().optional(),
  })
});

// delete consultation validation
const deleteConsultationValidation = z.object({
  params: z.object({
    id: objectId('Consultation'),
  })
});

// get single consultation validation
const getSingleConsultationValidation = z.object({
  params: z.object({
    id: objectId('Consultation'),
  })
});

export const ConsultationValidations = {
  createConsultationValidation,
  updateConsultationValidation,
  getSingleConsultationValidation,
  deleteConsultationValidation,
};