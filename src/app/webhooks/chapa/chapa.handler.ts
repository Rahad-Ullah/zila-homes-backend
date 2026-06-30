import { ChapaWebhookServices } from './chapa.service';
import { ChapaEvent as ChapaEventModel } from '../../modules/chapaEvent/chapaEvent.model';

export async function chapaEventHandler(eventPayload: any) {
  const { event, tx_ref, reference, status } = eventPayload;
  console.log('CHAPA EVENT: ', eventPayload);

  // Idempotency guard: Using Chapa's transaction reference string as the unique key
  const uniqueEventId = reference || tx_ref;

  if (!uniqueEventId) {
    console.error(
      'Chapa Webhook Error: Missing transaction reference identifier',
    );
    return;
  }

  const alreadyProcessed = await ChapaEventModel.exists({ id: uniqueEventId });
  if (alreadyProcessed) {
    return; // Stop processing, already done!
  }

  // Routing actions based on Chapa's 'event' field
  switch (event) {
    case 'charge.success':
      // await ChapaWebhookServices.onChargeSuccess(eventPayload);
      break;

    // Handle other statuses if sent via standard webhooks
    case 'charge.failed':
      // await ChapaWebhookServices.onChargeFailed(eventPayload);
      break;

    default:
      console.log(`Unhandled Chapa webhook event type: ${event}`);
  }

  // Log processed event into your existing Mongoose Schema setup
  try {
    await ChapaEventModel.create({
      id: uniqueEventId, // Maps to reference/tx_ref string
      type: event, // Maps to "charge.success"
      processedAt: new Date(),
    });
  } catch (err: any) {
    if (err.code === 11000) return; // Concurrency catch
    throw err;
  }
}
