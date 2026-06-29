import { Transaction } from './transaction.model';
import { ITransaction } from './transaction.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import {
  TransactionStatus,
  TransactionReferenceType,
  TransactionGateway,
} from './transaction.constants';
import config from '../../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { stripe } from '../../../config/stripe';
import { IUser } from '../user/user.interface';
import { Property } from '../property/property.model';
import { Reservation } from '../reservation/reservation.model';
import { chapa } from '../../../config/chapa';

// ------------- create Stripe checkout session ----------------
const createStripeCheckoutSession = async (
  user: IUser,
  payload: { amount: number; currency: string; reference: { type: TransactionReferenceType; id: string } }
) => {
  const { amount, currency, reference } = payload;

  if (!amount || !currency || !reference) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Amount, currency, and reference are required');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    payment_intent_data: {
      capture_method: 'automatic',
    },
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Payment for ${reference.type}`,
          },
          unit_amount: Math.round(amount * 100), // amount is in cents
        },
        quantity: 1,
      },
    ],
    success_url: `${config.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontend_url}/payment/cancel`,
    client_reference_id: reference.id,
    customer_email: user.email,
    metadata: {
      userId: user._id.toString(),
      referenceType: reference.type,
      referenceId: reference.id,
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    gateway: TransactionGateway.Stripe,
  };
};

// ------------- create Chapa checkout session ----------------
const createChapaCheckoutSession = async (
  user: IUser, 
  payload: { amount: number; currency: string; reference: { type: TransactionReferenceType; id: string } }
) => {
  const { amount, currency, reference } = payload;

  if (!amount || !currency || !reference) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Amount, currency, and reference are required');
  }

  // Use the SDK's utility method to generate a clean, secure tx_ref string
  const txRef = chapa.genTxRef({ prefix: `ZILA_${reference.type.toUpperCase()}` });

  try {
    // The SDK takes care of the internal endpoint URL structuring
    const response = await chapa.initialize({
      first_name: user.firstName || 'Zila',
      last_name: user.lastName || 'Customer',
      email: user.email,
      phone_number: user.phone || '0912345678',
      amount: amount.toString(),
      currency: currency.toUpperCase(),
      tx_ref: txRef,
      callback_url: `${config.backend_url}/webhooks/chapa`,
      return_url: `${config.frontend_url}/payment/success?tx_ref=${txRef}`,
      customization: {
        title: 'ZilaHomes',
        description: `Payment for ${reference.type}`,
      },
      meta: {
        userId: user._id.toString(),
        referenceType: reference.type,
        referenceId: reference.id,
      },
    } as any);

    return {
      checkoutUrl: response.data?.checkout_url,
      sessionId: txRef,
      gateway: TransactionGateway.Chapa,
    };
  } catch (error: any) {
    console.error("Chapa API Error:", error);
    throw error;
  }
};

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

  // pre-filter host
  if (query.host) {
    const properties = await Property.find({
      provider: query.host,
      isDeleted: false,
    }).select('_id');
    const reservations = await Reservation.find({
      property: { $in: properties.map(property => property._id) },
    }).select('_id');
    filter['reference.id'] = { $in: reservations.map(reservation => reservation._id) }
  }
  
  const transactionQuery = new QueryBuilder(Transaction.find(filter), query)
    .filter(['host'])
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
  createStripeCheckoutSession,
  createChapaCheckoutSession,
  updateTransactionStatus,
  getSingleTransaction,
  getTransactionsByUserId,
  getAllTransactions,
};
