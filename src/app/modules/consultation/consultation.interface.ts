import { Model, ObjectId } from 'mongoose';
import { ConsultationStatus, ConsultationType } from './consultation.constants';

export interface IConsultation {
  _id: ObjectId;
  type: ConsultationType;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  message: string;
  status: ConsultationStatus;
  assignedConsultant?: string;
  scheduledAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ConsultationModel = Model<IConsultation>;