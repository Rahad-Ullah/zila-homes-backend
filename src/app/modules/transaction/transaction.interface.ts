import { Model, ObjectId } from 'mongoose';
import {
  TransactionProvider,
  TransactionReferenceType,
  TransactionStatus,
  TransactionType,
} from './transaction.constants';

export interface ITransaction {
  _id: ObjectId;
  user: ObjectId;
  reference: {
    type: TransactionReferenceType;
    id: ObjectId;
  };
  type: TransactionType;
  provider: TransactionProvider;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  isPaid: boolean;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionModel = Model<ITransaction>;
