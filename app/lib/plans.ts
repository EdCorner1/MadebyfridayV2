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
  public?: boolean;
  stripePriceEnv?: string;
};

export const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    interval: 'forever',
    scripts: '10 rewrites/month',
    description: 'Search hooks, save ideas, and try Friday before upgrading.',
    cta: 'Start free',
    public: true,
  },
  {
    id: 'lifetime',
    name: 'Founding Pro',
    price: '$19',
    interval: 'one-time',
    scripts: 'Unlimited everything',
    description: 'First 100 creators only. Lifetime access, planner, and Friday as your content coach.',
    cta: 'Claim founding deal',
    featured: true,
    public: true,
    stripePriceEnv: 'STRIPE_PRICE_LIFETIME',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    interval: 'per month',
    scripts: 'Unlimited everything',
    description: 'The post-founding monthly plan. Early monthly users keep legacy pricing as Friday improves.',
    cta: 'Upgrade to Pro',
    public: false,
    stripePriceEnv: 'STRIPE_PRICE_PRO_MONTHLY',
  },
  {
    id: 'max',
    name: 'Pro Max',
    price: 'TBD',
    interval: 'later',
    scripts: 'Advanced models and deeper strategy',
    description: 'Future higher-tier plan. Not part of the launch offer.',
    cta: 'Coming later',
    public: false,
    stripePriceEnv: 'STRIPE_PRICE_MAX_MONTHLY',
  },
];

export const PUBLIC_PLANS = PLANS.filter((plan) => plan.public);

export function getPaidPlan(id: string): PlanConfig | null {
  const plan = PLANS.find((item) => item.id === id && item.id !== 'free');
  return plan ?? null;
}

export function getStripePriceId(plan: PlanConfig): string | null {
  if (!plan.stripePriceEnv) return null;
  return process.env[plan.stripePriceEnv] ?? null;
}
