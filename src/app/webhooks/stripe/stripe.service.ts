import { Event } from 'stripe/cjs/resources/Events';
import { logger } from '../../../shared/logger';
import { Checkout } from 'stripe/cjs/resources/Checkout';


// on checkout session completed
const onCheckoutSessionCompleted = async (event: Event) => {
  const session = event.data.object as Checkout.Session;

};

export const StripeWebhookServices = {

};
