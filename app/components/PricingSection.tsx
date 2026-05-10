'use client';

import { useState } from 'react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '5',
    period: '/month',
    description: 'Enough to get the hang of it.',
    features: [
      '15 script requests / month',
      'Friday rewrite on saved hooks',
      'Access to viral hook database',
      'Content planner',
    ],
    cta: 'Start free →',
    popular: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '9',
    period: '/month',
    description: 'For creators who post consistently.',
    features: [
      '50 script requests / month',
      'Friday rewrite + priority',
      'Unlimited saved hooks',
      'Access to all niches + platforms',
      'New hooks weekly',
    ],
    cta: 'Get started →',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19',
    period: '/month',
    description: 'Unlimited access. No guardrails.',
    features: [
      'Unlimited script requests',
      'Priority Friday rewrite queue',
      'Early access to new features',
      'Custom hook collections',
      'Direct Friday access',
    ],
    cta: 'Go Pro →',
    popular: false,
  },
];

interface PricingProps {
  onSubscribe?: (plan: string) => void;
}

export default function PricingSection({ onSubscribe }: PricingProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (onSubscribe) {
      onSubscribe(planId);
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Something went wrong. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="w-full py-20 px-5 bg-[#FDFCF7]">
      <div className="mx-auto max-w-[900px]">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#FF6B35] mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#111] mb-3">
            Stop guessing. Start creating.
          </h2>
          <p className="text-base text-[#5e5a54] max-w-[500px] mx-auto">
            Free to try. No lock-in. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[24px] p-6 flex flex-col ${
                plan.popular
                  ? 'bg-[#111] text-white border-2 border-[#FF6B35]'
                  : 'bg-white border border-[#ece7df]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FF6B35] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className={`text-[11px] font-semibold uppercase tracking-widest mb-2 ${plan.popular ? 'text-white/60' : 'text-[#787167]'}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">£{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-[#aaa]'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-1.5 text-sm ${plan.popular ? 'text-white/60' : 'text-[#888]'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-[#FF6B35] text-xs">✓</span>
                    <span className={plan.popular ? 'text-white/80' : 'text-[#555]'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={`w-full rounded-full py-3 text-sm font-medium transition ${
                  plan.popular
                    ? 'bg-[#FF6B35] text-white hover:opacity-90'
                    : 'bg-[#111] text-white hover:bg-[#333]'
                } disabled:opacity-40`}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#aaa] mt-6">
          All plans include a free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}