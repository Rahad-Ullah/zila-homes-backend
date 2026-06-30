import { Request, Response } from 'express';
import { chapaEventHandler } from './chapa.handler';
import { chapa } from '../../../config/chapa';

export const chapaWebhookController = async (req: Request, res: Response) => {
  const signature = req.headers['x-chapa-signature'] as string;
  const rawBody = req.body;

  // Validate Chapa's Webhook Signature
  const isValid = chapa.verifyWebhook(rawBody, signature);

  if (!isValid) {
    return res.status(400).send('Webhook Error: Invalid signature');
  }

  try {
    // Pass the payload directly to the event handler
    await chapaEventHandler(JSON.parse(rawBody));
  } catch (err) {
    console.error('Chapa webhook processing failed:', err);
  }

  return res.status(200).json({ received: true });
};
