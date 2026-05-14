'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { PUBLIC_PLANS } from '../lib/plans';

export default function PricingSection() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (planId: string) => {
    if (planId === 'free') {
      router.push('/dashboard');
      return;
    }

    setLoadingPlan(planId);
    setError(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setError('Create a free account first, then upgrade. Annoying, yes. Useful for saving your plan, also yes.');
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Checkout failed');
      }

      window.open(payload.url, '_self');
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="mx-auto w-full max-w-5xl px-6 pb-20">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral/70">Pricing</p>
        <h2 className="mt-3 font-display text-4xl font-medium tracking-[-0.035em] text-charcoal sm:text-5xl">
          Start free. Upgrade when Friday earns her keep.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-charcoal/55 sm:text-base">
          Keep the front door frictionless. Pay when you want more rewrites, more hooks, and less content-idea swamp goblin behaviour.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {PUBLIC_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-[24px] border bg-white p-5 shadow-sm ${
              plan.featured ? 'border-coral/35 shadow-[0_18px_60px_rgba(220,38,38,0.12)]' : 'border-charcoal/10'
            }`}
          >
            {plan.featured && (
              <span className="mb-4 inline-flex rounded-full bg-coral/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-coral">
                Best start
              </span>
            )}
            <h3 className="font-display text-2xl font-medium text-charcoal">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-charcoal">{plan.price}</span>
              <span className="text-xs text-charcoal/40">{plan.interval}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-charcoal/70">{plan.scripts}</p>
            <p className="mt-3 min-h-16 text-sm leading-6 text-charcoal/50">{plan.description}</p>
            <button
              type="button"
              onClick={() => startCheckout(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`mt-5 w-full rounded-full px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                plan.featured ? 'bg-coral text-white hover:bg-red-700' : 'bg-charcoal text-white hover:bg-charcoal/85'
              }`}
            >
              {loadingPlan === plan.id ? 'Opening checkout...' : plan.cta}
            </button>
          </article>
        ))}
      </div>

      {error && (
        <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
