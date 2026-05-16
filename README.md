# Made by Friday

Made by Friday is a viral-hook and script-rewrite tool for creators.

Flow:

1. User describes what they make.
2. Friday finds relevant viral hook patterns.
3. User previews/saves/rejects patterns.
4. User signs up when ready to rewrite.
5. Friday returns a structured script with explanation, first-frame idea, caption/CTA, and alternate hooks.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Required environment variables

See `.env.example`.

Core:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENROUTER_API_KEY=
```

Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Stripe:

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_LIFETIME=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_MAX_MONTHLY=
```

Current public offer uses `STRIPE_PRICE_LIFETIME` for the $19 Founding Pro lifetime plan.

## Supabase setup

Run `supabase_schema.sql` in Supabase SQL Editor.

It creates:

- `profiles`
- `saved_hooks`
- `founding_members`
- `stripe_events`
- `purchases`
- signup trigger for profile creation
- `claim_founding_seat()` RPC
- RLS policies

## Stripe setup

Required Stripe items:

1. Create one-time price for Founding Pro lifetime.
2. Set `STRIPE_PRICE_LIFETIME` to that price ID.
3. Configure webhook endpoint:
   - `/api/stripe/webhook`
4. Subscribe webhook to:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Set `STRIPE_WEBHOOK_SECRET`.

Checkout route:

- `POST /api/checkout`
- Requires authenticated Supabase bearer token.
- Body: `{ "planId": "lifetime" }`

Webhook updates:

- `profiles.plan`
- founding member seat count
- `purchases` ledger
- `stripe_events` idempotency table

## Pre-launch smoke test

Run before promoting the paid offer:

- [ ] Homepage prompt routes to `/dashboard?q=...`
- [ ] Dashboard returns 6 relevant reference patterns
- [ ] Pattern preview modal opens and does not expose Instagram links
- [ ] Save hook works locally
- [ ] Signup creates profile
- [ ] Signin restores workspace
- [ ] Rewrite button opens rewrite panel
- [ ] Rewrite returns structured result:
  - script
  - why it works
  - first-frame visual
  - caption/CTA
  - alternates
- [ ] Rewrite saves to workspace
- [ ] Free quota decrements
- [ ] Upgrade page loads
- [ ] Founding Pro checkout session opens
- [ ] Stripe webhook upgrades user to lifetime
- [ ] Founding seat count increments once
- [ ] Billing cancel/success pages render
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

## Launch positioning

Primary message:

> Find viral hook patterns and rewrite them for your niche.

Build-in-public angle:

> I’m building an AI that helps creators use viral structure without copying content.

Initial offer:

- Free: 10 rewrites/month
- Founding Pro: $19 one-time for first 100 creators

## Useful commands

```bash
npm run lint
npm run build
npm run dev
```
