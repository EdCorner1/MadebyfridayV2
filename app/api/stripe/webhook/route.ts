import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '../../../lib/supabase';
import { getStripe } from '../../../lib/stripe';
import { Plan } from '../../../lib/types';

function isPlan(value: unknown): value is Plan {
  return value === 'free' || value === 'pro' || value === 'max' || value === 'lifetime';
}

async function updateUserPlan(userId: string, plan: Plan, stripeCustomerId?: string | null, stripeSubscriptionId?: string | null) {
  const supabase = createServerClient();
  await supabase
    .from('profiles')
    .update({
      plan,
      stripe_customer_id: stripeCustomerId ?? undefined,
      stripe_subscription_id: stripeSubscriptionId ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan;

  if (!userId || !isPlan(plan)) return;

  await updateUserPlan(
    userId,
    plan,
    typeof session.customer === 'string' ? session.customer : null,
    typeof session.subscription === 'string' ? session.subscription : null,
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  await updateUserPlan(userId, 'free', typeof subscription.customer === 'string' ? subscription.customer : null, null);
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('[stripe-webhook] Invalid signature', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[stripe-webhook]', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
