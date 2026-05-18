import Stripe from 'stripe';
import { getPublicSiteUrl } from './site';

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

  return new Stripe(secretKey, {
    apiVersion: '2026-04-22.dahlia',
  });
}

export function getSiteUrl() {
  return getPublicSiteUrl();
}
