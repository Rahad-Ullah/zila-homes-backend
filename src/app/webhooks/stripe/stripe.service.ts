import { Stripe } from 'stripe/cjs/stripe.core';
import { Transaction } from '../../modules/transaction/transaction.model';
import { TransactionGateway, TransactionReferenceType, TransactionStatus, TransactionType } from '../../modules/transaction/transaction.constants';
import { Reservation } from '../../modules/reservation/reservation.model';
import { stripe } from '../../../config/stripe';
import { Setting } from '../../modules/setting/setting.model';


// ----------------- on checkout session completed -----------------
export const onCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session

  // 1. Extract custom metadata
  const { userId, referenceType, referenceId } = session.metadata || {};
  if (!userId || !referenceType || !referenceId) {
    console.error(`[Stripe Webhook Error] Missing crucial metadata for session: ${session.id}`);
    return;
  }

  // 2. Capture the Stripe Payment Intent ID (Crucial for processing future refunds)
  const paymentIntentId = session.payment_intent as string;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId,
    { expand: ['latest_charge.balance_transaction'] }
  );
  const balanceTransaction = (paymentIntent.latest_charge as Stripe.Charge)?.balance_transaction as Stripe.BalanceTransaction;
  const setting = await Setting.findOne().select('platformFeePercentage');

  // 3. Format financial data
  const totalAmount = balanceTransaction.amount / 100;
  const gatewayFee = (balanceTransaction?.fee / 100) || 0;
  const platformFeePercentage = setting?.platformFeePercentage || 0;
  const platformFee = (totalAmount * platformFeePercentage) / 100;
  const netAmount = totalAmount - platformFee;

  const isPaid = session.payment_status === 'paid';

  try {
    // 4. Create the formal Transaction document inside your MongoDB ledger
    const newTransaction = await Transaction.findOneAndUpdate(
      {
        gateway: TransactionGateway.Stripe,
        gatewayReferenceId: paymentIntentId,
      },
      {
        user: userId,
        reference: {
          type: referenceType as TransactionReferenceType,
          id: referenceId,
        },
        type: TransactionType.Payment,
        gateway: TransactionGateway.Stripe,
        gatewayReferenceId: paymentIntentId,
        paymentMethod: session.payment_method_types?.[0] || 'card',
        amount: totalAmount,
        gatewayFee: gatewayFee,
        platformFeePercentage: platformFeePercentage,
        platformFee: platformFee,
        netAmount: netAmount,
        currency: session.currency?.toUpperCase() || 'USD',
        status: isPaid ? TransactionStatus.Completed : TransactionStatus.Failed,
        isPaid: isPaid,
        paidAt: isPaid ? new Date() : undefined,
      },
      { upsert: true, new: true }
    );

    console.log(`[Stripe Webhook Success] Transaction logged successfully: ${newTransaction._id}`);

    // 5. Trigger Fulfiment Logic Below
    switch (referenceType) {
      case TransactionReferenceType.Reservation:
        await Reservation.findByIdAndUpdate(referenceId, {
          $set: {
            transaction: newTransaction._id,
            'pricing.isPaid': isPaid,
          }
        });
        break;
      // add other reference types here..
      default:
        break;
    }
  } catch (error: any) {
    console.error(`[Database Error] Failed to log transaction for session ${session.id}:`, error.message);
    throw error;
  }
};

// ----------------- on async payment failed -----------------
export const onAsyncPaymentFailed = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const paymentIntentId = session.payment_intent as string;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId,
    { expand: ['latest_charge.balance_transaction'] }
  );
  const balanceTransaction = (paymentIntent.latest_charge as Stripe.Charge)?.balance_transaction as Stripe.BalanceTransaction;
  const setting = await Setting.findOne().select('platformFeePercentage');
  const totalAmount = balanceTransaction.amount / 100;
  const gatewayFee = (balanceTransaction?.fee / 100) || 0;
  const platformFeePercentage = setting?.platformFeePercentage || 0;
  const platformFee = (totalAmount * platformFeePercentage) / 100;
  const netAmount = totalAmount - platformFee;

  // 1. Extract custom metadata
  const { userId, referenceType, referenceId } = session.metadata || {};
  if (!userId || !referenceType || !referenceId) {
    console.error(`[Stripe Webhook Error] Missing crucial metadata for session: ${session.id}`);
    return;
  }

  try {
    // 2. Update or create the transaction document to mark it as Failed
    const transaction = await Transaction.findOneAndUpdate(
      {
        gateway: TransactionGateway.Stripe,
        gatewayReferenceId: paymentIntentId
      },
      {
        $set: {
          user: userId,
          reference: {
            type: referenceType as TransactionReferenceType,
            id: referenceId,
          },
          type: TransactionType.Payment,
          gateway: TransactionGateway.Stripe,
          gatewayReferenceId: paymentIntentId,
          paymentMethod: session.payment_method_types?.[0] || 'card',
          amount: totalAmount,
          gatewayFee: gatewayFee,
          platformFeePercentage: platformFeePercentage,
          platformFee: platformFee,
          netAmount: netAmount,
          currency: session.currency?.toUpperCase() || 'USD',
          status: TransactionStatus.Failed,
          isPaid: false,
        }
      },
      { upsert: true, new: true }
    );

    console.log(`[Stripe Webhook Failure][${event.type}] Transaction ${transaction._id} marked as FAILED.`);

    // 3. Reverse Fulfillment Logic (Release the held resource)
    switch (referenceType) {
      case TransactionReferenceType.Reservation:
        await Reservation.findByIdAndUpdate(referenceId, {
          $set: {
            transaction: transaction._id,
            'pricing.isPaid': false,
          }
        });
        break;
      default:
        break;
    }
  } catch (error: any) {
    console.error(`[Database Error] Failed to process payment failure for intent ${paymentIntentId}:`, error.message);
    throw error;
  }
};

// ----------------- on checkout session expired -----------------
export const onCheckoutSessionExpired = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const paymentIntentId = session.payment_intent as string;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId,
    { expand: ['latest_charge.balance_transaction'] }
  );
  const balanceTransaction = (paymentIntent.latest_charge as Stripe.Charge)?.balance_transaction as Stripe.BalanceTransaction;
  const setting = await Setting.findOne().select('platformFeePercentage');
  const totalAmount = balanceTransaction.amount / 100;
  const gatewayFee = (balanceTransaction?.fee / 100) || 0;
  const platformFeePercentage = setting?.platformFeePercentage || 0;
  const platformFee = (totalAmount * platformFeePercentage) / 100;
  const netAmount = totalAmount - platformFee;

  // 1. Extract custom metadata
  const { userId, referenceType, referenceId } = session.metadata || {};
  if (!userId || !referenceType || !referenceId) {
    console.error(`[Stripe Webhook Error] Missing crucial metadata for session: ${session.id}`);
    return;
  }

  try {
    // 2. Update or create the transaction document to mark it as Failed
    const transaction = await Transaction.findOneAndUpdate(
      {
        gateway: TransactionGateway.Stripe,
        gatewayReferenceId: paymentIntentId
      },
      {
        $set: {
          user: userId,
          reference: {
            type: referenceType as TransactionReferenceType,
            id: referenceId,
          },
          type: TransactionType.Payment,
          gateway: TransactionGateway.Stripe,
          gatewayReferenceId: paymentIntentId,
          paymentMethod: session.payment_method_types?.[0] || 'card',
          amount: totalAmount,
          gatewayFee: gatewayFee,
          platformFeePercentage: platformFeePercentage,
          platformFee: platformFee,
          netAmount: netAmount,
          currency: session.currency?.toUpperCase() || 'USD',
          status: TransactionStatus.Cancelled,
          isPaid: false,
        }
      },
      { upsert: true, new: true }
    );

    console.log(`[Stripe Webhook Failure][${event.type}] Transaction ${transaction._id} marked as FAILED.`);

    // 3. Reverse Fulfillment Logic (Release the held resource)
    switch (referenceType) {
      case TransactionReferenceType.Reservation:
        await Reservation.findByIdAndUpdate(referenceId, {
          $set: {
            transaction: transaction._id,
            'pricing.isPaid': false,
          }
        });
        break;
      default:
        break;
    }
  } catch (error: any) {
    console.error(`[Database Error] Failed to process payment failure for intent ${paymentIntentId}:`, error.message);
    throw error;
  }
};

export const StripeWebhookServices = {
  onCheckoutSessionCompleted,
  onAsyncPaymentFailed,
  onCheckoutSessionExpired
};
