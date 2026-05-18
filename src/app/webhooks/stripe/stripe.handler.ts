import { StripeWebhookServices } from './stripe.service';
import { StripeEvent as StripeEventModel } from '../../modules/stripeEvent/stripeEvent.model';
import { Stripe } from 'stripe/cjs/stripe.core';

export async function stripeEventHandler(event: Stripe.Event) {
  // Idempotency guard
  const alreadyProcessed = await StripeEventModel.exists({ id: event.id });
  if (alreadyProcessed) {
    return;
  }

  // event routing
  switch (event.type) {
    case 'checkout.session.completed':
      // await StripeWebhookServices.onCheckoutSessionCompleted(event);
      break;

    case 'checkout.session.async_payment_succeeded':
      // await StripeWebhookServices.onCheckoutSessionAsyncPaymentSucceeded(event);
      break;

    case 'checkout.session.async_payment_failed':
      // await StripeWebhookServices.onCheckoutSessionAsyncPaymentFailed(event);
      break;

    default:
  }

  // log processed event
  try {
    await StripeEventModel.create({
      id: event.id,
      type: event.type,
    });
  } catch (err: any) {
    if (err.code === 11000) return; // already processed
    throw err;
  }
}
