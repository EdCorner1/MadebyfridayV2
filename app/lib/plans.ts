import { Plan } from './types';

export type PaidPlan = Exclude<Plan, 'free'>;

export type PlanConfig = {
  id: Plan;
  name: string;
  price: string;
  interval: string;
  scripts: string;
  description: string;
  cta: string;
  featured?: boolean;
  stripePriceEnv?: string;
};

export const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    interval: 'forever',
    scripts: '5 scripts/month',
    description: 'Try Friday with enough room to see if the hooks actually slap.',
    cta: 'Start free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$15',
    interval: 'per month',
    scripts: '15 scripts/month',
    description: 'For creators actively making weekly content and testing ideas.',
    cta: 'Upgrade to Pro',
    featured: true,
    stripePriceEnv: 'STRIPE_PRICE_PRO_MONTHLY',
  },
  {
    id: 'max',
    name: 'Max',
    price: '$29',
    interval: 'per month',
    scripts: 'Unlimited scripts',
    description: 'For creators who want Friday as a daily scripting gremlin.',
    cta: 'Go unlimited',
    stripePriceEnv: 'STRIPE_PRICE_MAX_MONTHLY',
  },
  {
    id: 'lifetime',
    name: 'Founding',
    price: '$19',
    interval: 'one-time',
    scripts: 'Lifetime access',
    description: 'First 100 founding members. Ridiculously early, deliberately generous.',
    cta: 'Claim founding deal',
    stripePriceEnv: 'STRIPE_PRICE_LIFETIME',
  },
];

export function getPaidPlan(id: string): PlanConfig | null {
  const plan = PLANS.find((item) => item.id === id && item.id !== 'free');
  return plan ?? null;
}

export function getStripePriceId(plan: PlanConfig): string | null {
  if (!plan.stripePriceEnv) return null;
  return process.env[plan.stripePriceEnv] ?? null;
}
