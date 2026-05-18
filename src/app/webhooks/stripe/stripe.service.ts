import { Stripe } from 'stripe/cjs/stripe.core';
import { Transaction } from '../../modules/transaction/transaction.model';
import { TransactionProvider, TransactionReferenceType, TransactionStatus, TransactionType } from '../../modules/transaction/transaction.constants';
import { Reservation } from '../../modules/reservation/reservation.model';


// ----------------- on checkout session completed -----------------
export const onCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session

  // 1. Extract custom metadata
  const { userId, referenceType, referenceId } = session.metadata || {};
  if (!userId || !referenceType || !referenceId) {
    console.error(`[Stripe Webhook Error] Missing crucial metadata for session: ${session.id}`);
    return;
  }

  // 2. Format financial data
  const totalAmountCents = session.amount_total || 0;
  const totalAmount = totalAmountCents / 100;

  // 3. Capture the Stripe Payment Intent ID (Crucial for processing future refunds)
  const paymentIntentId = session.payment_intent as string;

  try {
    // 4. Create the formal Transaction document inside your MongoDB ledger
    const newTransaction = await Transaction.create({
      user: userId,
      reference: {
        type: referenceType as TransactionReferenceType,
        id: referenceId,
      },
      type: TransactionType.Payment,
      provider: TransactionProvider.Stripe,
      providerPaymentIntentId: paymentIntentId,
      paymentMethod: session.payment_method_types?.[0] || 'card',
      amount: totalAmount,
      currency: session.currency?.toUpperCase() || 'USD',
      status: TransactionStatus.Completed,
      isPaid: true,
      paidAt: new Date(),
    });

    console.log(`[Stripe Webhook Success] Transaction logged successfully: ${newTransaction._id}`);

    // 5. Trigger Fulfiment Logic Below
    switch (referenceType) {
      case TransactionReferenceType.Reservation:
        await Reservation.findByIdAndUpdate(referenceId, { transaction: newTransaction._id });
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
export const StripeWebhookServices = {
  onCheckoutSessionCompleted
};
