import { Transaction } from './transaction.model';
import { ITransaction } from './transaction.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { TransactionStatus } from './transaction.constants';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';

// ------------- update transaction status ----------------
const updateTransactionStatus = async (
  id: string,
  payload: Partial<ITransaction>,
) => {
  if (payload.status === TransactionStatus.Completed) {
    payload.isPaid = true;
    payload.paidAt = new Date();
  } else {
    payload.isPaid = false;
    payload.paidAt = undefined;
  }

  const result = await Transaction.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');
  }

  return result;
};

// ------------- get single transaction ----------------
const getSingleTransaction = async (id: string) => {
  const result = await Transaction.findById(id)
    .populate('user')
    .populate('reference.id');

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');
  }

  return result;
};

// ------------- get transactions by user id ----------------
const getTransactionsByUserId = async (userId: string, query: Record<string, unknown>) => {
  const transactionQuery = new QueryBuilder(Transaction.find({ user: userId }), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    transactionQuery.modelQuery.populate('user').populate('reference.id'),
    transactionQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

// ------------- get all transactions ----------------
const getAllTransactions = async (query: Record<string, unknown>) => {
  const filter = {} as any;
  // pre-filter user
  if (query.searchTerm) {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query.searchTerm, $options: 'i' } },
        { lastName: { $regex: query.searchTerm, $options: 'i' } },
        { email: { $regex: query.searchTerm, $options: 'i' } },
      ],
    });
    filter.user = users.map(user => user._id);
  }

  const transactionQuery = new QueryBuilder(Transaction.find(filter), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    transactionQuery.modelQuery.populate('user').populate('reference.id'),
    transactionQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const TransactionServices = {
  updateTransactionStatus,
  getSingleTransaction,
  getTransactionsByUserId,
  getAllTransactions,
};
