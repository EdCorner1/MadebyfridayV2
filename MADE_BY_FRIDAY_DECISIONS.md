# Made by Friday — Locked Decisions

This file is the source of truth for product decisions. If something changes, update this file first.

## Product Positioning

Made by Friday helps creators find proven viral reference videos/hooks and rewrite them for their own niche, audience, and platform.

The core product promise:

> Tell Friday what you make. Friday finds viral patterns and helps turn them into usable scripts.

## Homepage

### Goal

The homepage exists to create action, not explain the entire business.

A visitor should understand enough to type into the input and continue.

### Badge

Use:

> Trained on patterns from 10,000+ viral videos

Even though the current searchable dataset has around 1,000 hooks, the plan is to add the remaining 9K videos shortly. This badge represents the intended launch database.

### Headline / subheadline

Current headline/subheadline are acceptable for now and easy to change later.

Do not waste build cycles over-polishing copy until the product flow is stronger.

### Homepage input

The input itself is the CTA.

- Keep animated typewriter placeholder.
- Keep animated coral/red tracing border around the input.
- Remove large visible “Find hooks” button.
- Keep a small send icon/button as fallback for users who do not press Enter.
- Enter submits.
- Shift+Enter creates a new line.

### Micro explainer

Do not add a micro explainer below the input for now. It creates another thing to read.

### Pricing on homepage

No pricing section on the homepage for now.

Pricing should be introduced as an upsell after the user experiences value.

### Floating social icons

Floating social platform icons are wanted.

Rules:

- Use real platform logos, not generic placeholder symbols.
- Keep icons in safe side lanes only.
- Do not let icons overlap or visually interfere with the central hero/input section.
- Icons are proof/familiarity indicators, not decoration soup.
- Hide or heavily reduce on mobile.
- Keep animation subtle.

### Visual style

- Light mode.
- Warm cream/off-white background.
- Coral/red accent matching the rest of the theme.
- Charcoal text.
- Clean, modern, enough personality, no purple/blue dark SaaS sludge.

## App Icon / Site Icon

A plain “F” is not explicit enough for the product.

Preferred fast direction:

- Microphone or camera-style creator icon.
- Same coral/red brand colour.
- Simple enough to work as app icon / favicon / home screen icon.
- Can be replaced or refined later.

Do not use a complex mascot icon for launch unless it remains readable at small sizes.

## Dashboard Flow

### After prompt

User lands on dashboard after typing a prompt on the homepage.

Immediate view must make sense without thinking.

### Sidebar

Build a simple, obvious sidebar.

Potential items:

- Creator profile / avatar.
- New search.
- Saved videos/hooks.
- Planner.
- Account/settings.
- Plan/quota.

Rule: the user should never wonder where something is.

### Cards

Desktop:

- Max 3 cards wide.
- Video/reference area should be normal 9:16 format.
- Rounded corners: understated, roughly 11–18px.
- Styling tight and simple.

Mobile:

- Users should scroll naturally through their first 6 videos/cards.
- One-card vertical flow is acceptable.

### Instagram/reference videos

Do not show distractions like:

- View Profile.
- Comments.
- Profile links.
- Anything that could push the creator off-site and into doomscrolling.

If Instagram embeds force those distractions, use clean thumbnails/preview cards and controlled modals/pages instead.

## Rewrite Flow

Friday should feel like a content coach, not a generic text generator.

Rewrite flow can be improved modal or dedicated page/workspace. Use product judgment.

Dedicated page/workspace is likely better if not too slow to build.

Target rewrite output should include:

- Rewritten hook/script.
- Why it works.
- First-frame visual idea.
- Caption/CTA suggestion.
- Alternate versions where useful.

## Storage / Supabase

localStorage is browser storage on the user’s device.

It is not OpenClaw storage, Vercel storage, GitHub storage, or server storage.

Decision:

- Keep localStorage for anonymous instant use.
- Use Supabase for logged-in account persistence.
- Sync local workspace into Supabase when user signs up/logs in.

Analogy: localStorage is the anonymous basket before checkout. Supabase is the user account.

## Hook Enrichment

Hook enrichment is a core moat.

Each hook/video should move toward having:

- Niche/category.
- Hook mechanism.
- Emotional driver.
- Best-for use cases.
- Difficulty.
- Rewrite strategy.
- Eventually: why it worked, example rewrite, quality score.

Current enrichment is heuristic and should improve over time with AI/human review.

## Pricing / Paywall

### Free

Launch recommendation:

- 10 rewrites/month.
- Saving allowed.
- Hook search allowed.
- No forced signup before value.

If 10 hurts conversion to paid, adjust later.

### Founding Pro

Initial cash injection offer:

- $19 lifetime.
- First 100 members.
- Unlimited everything.
- Content planner.
- Friday built in as content coach.
- Legacy/future access benefit.

### Later Pro

After founding members:

- $19/month.
- Unlimited everything.
- Users keep legacy pricing even if higher tiers are introduced later.

### Future Pro Max

Not urgent.

Possible later higher tier:

- Better models.
- Deeper strategy/coaching.
- Higher-quality rewrite engine.
- More advanced planning/analytics.

## Launch Content

Ed is leading launch content.

Product should be highly visual and screenshot/video friendly:

- Clean homepage moment.
- Clean dashboard results moment.
- Strong rewrite before/after moment.
- Clear “Friday helped me make this” moment.
