import Stripe from 'stripe';

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

  return new Stripe(secretKey, {
    apiVersion: '2026-04-22.dahlia',
  });
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
