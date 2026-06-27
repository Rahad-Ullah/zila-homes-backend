import { Chapa } from 'chapa-nodejs';
import config from '.';

if (!config.chapa.secret_key) {
  throw new Error('Chapa secret key is not defined');
}

if (!config.chapa.webhook_secret) {
  throw new Error('Chapa webhook secret is not defined');
}

export const chapa = new Chapa({
  secretKey: config.chapa.secret_key as string,
  webhookSecret: config.chapa.webhook_secret as string,
  logging: true, // <-- Activates request/response logging
  debug: true, // <-- Activates detailed debug information
});
