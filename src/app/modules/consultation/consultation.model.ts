import { Schema, model } from 'mongoose';
import { IConsultation, ConsultationModel } from './consultation.interface';
import { ConsultationStatus, ConsultationType } from './consultation.constants';

const consultationSchema = new Schema<IConsultation, ConsultationModel>({
  type: {
    type: String,
    enum: ConsultationType,
    default: ConsultationType.POA,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ConsultationStatus,
    default: ConsultationStatus.Pending,
  },
  assignedConsultant: {
    type: String,
    default: null
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Consultation = model<IConsultation, ConsultationModel>(
  'Consultation',
  consultationSchema
);