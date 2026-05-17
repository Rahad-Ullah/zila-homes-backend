import { Schema, model } from 'mongoose';
import { ITransaction, TransactionModel } from './transaction.interface';
import { TransactionProvider, TransactionReferenceType, TransactionStatus, TransactionType } from './transaction.constants';

const transactionSchema = new Schema<ITransaction, TransactionModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reference: {
    type: {
      type: String,
      enum: TransactionReferenceType,
      required: true,
    },
    id: {
      type: String,
      refPath: 'reference.type'
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: TransactionProvider,
    required: true,
  },
  type: {
    type: String,
    enum: TransactionType,
    required: true,
  },
  status: {
    type: String,
    enum: TransactionStatus,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
}, { timestamps: true });

export const Transaction = model<ITransaction, TransactionModel>(
  'Transaction',
  transactionSchema
);