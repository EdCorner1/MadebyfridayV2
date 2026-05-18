import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../lib/supabase';
import { getPaidPlan, getStripePriceId } from '../../lib/plans';
import { getSiteUrl, getStripe } from '../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json() as { planId?: string };
    const plan = getPaidPlan(planId ?? '');

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const priceId = getStripePriceId(plan);
    if (!priceId) {
      return NextResponse.json({ error: 'Stripe price is not configured yet' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (plan.id === 'lifetime') {
      const { data: founding, error: foundingError } = await supabase
        .from('founding_members')
        .select('count,max')
        .eq('id', '1')
        .single();

      if (foundingError) {
        return NextResponse.json({ error: 'Could not verify founding seats' }, { status: 500 });
      }

      if (founding && founding.count >= founding.max) {
        return NextResponse.json({ error: 'The lifetime Pro seats are sold out' }, { status: 409 });
      }
    }

    const mode = plan.id === 'lifetime' ? 'payment' : 'subscription';
    const siteUrl = getSiteUrl();

    const session = await getStripe().checkout.sessions.create({
      mode,
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/billing/cancel`,
      metadata: {
        user_id: user.id,
        plan: plan.id,
      },
      subscription_data: mode === 'subscription'
        ? {
            metadata: {
              user_id: user.id,
              plan: plan.id,
            },
          }
        : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[checkout]', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
