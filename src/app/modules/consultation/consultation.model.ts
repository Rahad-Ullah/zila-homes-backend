import { Schema, model } from 'mongoose';
import { IConsultation, ConsultationModel } from './consultation.interface';
import { ConsultationStatus, ConsultationType } from './consultation.constants';
import { autoIncrementPlugin } from '../../../DB/autoIncrementPlugin';

const consultationSchema = new Schema<IConsultation, ConsultationModel>({
  uid: {
    type: String,
    unique: true,
    index: true,
  },
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

// Apply auto-increment plugin
consultationSchema.plugin(autoIncrementPlugin, {
  incField: 'uid',
  prefix: 'CNS',
  counterId: 'consultation_sequence',
  padLength: 6
});

export const Consultation = model<IConsultation, ConsultationModel>(
  'Consultation',
  consultationSchema
);