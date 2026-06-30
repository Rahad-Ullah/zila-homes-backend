import { Transaction } from '../../modules/transaction/transaction.model';
import {
  TransactionGateway,
  TransactionReferenceType,
  TransactionStatus,
  TransactionType,
} from '../../modules/transaction/transaction.constants';
import { Reservation } from '../../modules/reservation/reservation.model';
import { Setting } from '../../modules/setting/setting.model';

// ----------------- on checkout session completed -----------------
const onChargeSuccess = async (payload: any) => {
  const {
    amount,
    charge,
    currency,
    reference,
    tx_ref,
    payment_method,
    status,
    meta,
    created_at,
  } = payload;

  // 1. Extract custom metadata safely
  // Chapa returns meta as an object or sometimes stringified based on setup, let's guard it
  let parsedMeta = meta;
  if (typeof meta === 'string') {
    try {
      parsedMeta = JSON.parse(meta);
    } catch {
      parsedMeta = null;
    }
  }

  const { userId, referenceType, referenceId } = parsedMeta || {};

  if (!userId || !referenceType || !referenceId) {
    console.error(
      `[Chapa Webhook Error] Missing crucial metadata for transaction reference: ${tx_ref}`,
    );
    return;
  }

  // 2. Fetch platform pricing parameters
  const setting = await Setting.findOne().select('platformFeePercentage');

  // 3. Format financial data
  // Chapa amounts are already parsed as clean decimal floats (e.g., "140.80"), NOT cents!
  const totalAmount = parseFloat(amount);
  const gatewayFee = parseFloat(charge) || 0; // Chapa's processor fee is returned explicitly inside 'charge'
  const platformFeePercentage = setting?.platformFeePercentage || 0;
  const platformFee = (totalAmount * platformFeePercentage) / 100;
  const netAmount = totalAmount - platformFee;

  const isPaid = status === 'success';

  try {
    // 4. Update the formal Transaction document inside your MongoDB ledger
    const transaction = await Transaction.findOneAndUpdate(
      {
        gateway: TransactionGateway.Chapa,
        gatewayReferenceId: tx_ref, // Track via your generated transaction string
      },
      {
        user: userId,
        reference: {
          type: referenceType as TransactionReferenceType,
          id: referenceId,
        },
        type: TransactionType.Payment,
        paymentMethod: payment_method || 'chapa_digital',
        amount: totalAmount,
        gatewayFee: gatewayFee,
        platformFeePercentage: platformFeePercentage,
        platformFee: platformFee,
        netAmount: netAmount,
        currency: currency?.toUpperCase() || 'USD',
        status: isPaid ? TransactionStatus.Completed : TransactionStatus.Failed,
        isPaid: isPaid,
        paidAt: isPaid ? new Date(created_at) : undefined,
      },
      { upsert: true, new: true },
    );

    console.log(
      `[Chapa Webhook Success] Transaction logged successfully into Ledger: ${transaction._id}`,
    );

    // 5. Trigger Fulfillment Logic matching your Stripe pattern
    switch (referenceType) {
      case TransactionReferenceType.Reservation:
        await Reservation.findByIdAndUpdate(referenceId, {
          $set: {
            transaction: transaction._id,
            'pricing.isPaid': isPaid,
          },
        });
        break;

      // Add other ZilaHomes business reference paths here...
      default:
        break;
    }
  } catch (error: any) {
    console.error(
      `[Database Error] Failed to log Chapa ledger transaction for reference ${tx_ref}:`,
      error.message,
    );
    throw error;
  }
};

// ----------------- on async payment failed -----------------
const onChargeFailed = async (payload: any) => {
  const {
    amount,
    charge,
    currency,
    reference,
    tx_ref,
    payment_method,
    status,
    meta,
  } = payload;

  // 1. Extract custom metadata safely
  let parsedMeta = meta;
  if (typeof meta === 'string') {
    try {
      parsedMeta = JSON.parse(meta);
    } catch {
      parsedMeta = null;
    }
  }

  const { userId, referenceType, referenceId } = parsedMeta || {};

  if (!userId || !referenceType || !referenceId) {
    console.error(
      `[Chapa Webhook Error] Missing crucial metadata for failed transaction reference: ${tx_ref}`,
    );
    return;
  }

  // 2. Fetch platform pricing parameters
  const setting = await Setting.findOne().select('platformFeePercentage');

  // 3. Format financial data
  const totalAmount = parseFloat(amount) || 0;
  const gatewayFee = parseFloat(charge) || 0;
  const platformFeePercentage = setting?.platformFeePercentage || 0;
  const platformFee = (totalAmount * platformFeePercentage) / 100;
  const netAmount = totalAmount - platformFee;

  // Determine clean transaction status mapping based on Chapa's response status string
  const finalStatus =
    status === 'cancelled'
      ? TransactionStatus.Cancelled
      : TransactionStatus.Failed;

  try {
    // 4. Update or create the transaction document inside your MongoDB ledger to mark it as Failed/Cancelled
    const transaction = await Transaction.findOneAndUpdate(
      {
        gateway: TransactionGateway.Chapa,
        gatewayReferenceId: tx_ref,
      },
      {
        $set: {
          user: userId,
          reference: {
            type: referenceType as TransactionReferenceType,
            id: referenceId,
          },
          type: TransactionType.Payment,
          paymentMethod: payment_method || 'chapa_digital',
          amount: totalAmount,
          gatewayFee: gatewayFee,
          platformFeePercentage: platformFeePercentage,
          platformFee: platformFee,
          netAmount: netAmount,
          currency: currency?.toUpperCase() || 'USD',
          status: finalStatus,
          isPaid: false,
        },
      },
      { upsert: true, new: true },
    );

    console.log(
      `[Chapa Webhook Failure] Transaction ${transaction._id} logged into Ledger as ${finalStatus}.`,
    );

    // 5. Reverse Fulfillment Logic (Release the held hotel room/resource)
    switch (referenceType) {
      case TransactionReferenceType.Reservation:
        await Reservation.findByIdAndUpdate(referenceId, {
          $set: {
            transaction: transaction._id,
            'pricing.isPaid': false, // Ensure reservation remains unfulfilled / unpaid
          },
        });
        break;

      default:
        break;
    }
  } catch (error: any) {
    console.error(
      `[Database Error] Failed to process Chapa payment failure/cancellation for reference ${tx_ref}:`,
      error.message,
    );
    throw error;
  }
};

export const ChapaWebhookServices = {
  onChargeSuccess,
  onChargeFailed,
};
