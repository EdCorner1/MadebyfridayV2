# Made by Friday — Roadmap

This roadmap is ordered by launch usefulness, not theoretical architecture neatness.

## Current State

- Next.js app deployed to Vercel.
- Production preview URL: `https://madebyfriday.vercel.app`.
- Custom domain pending purchase/setup.
- Supabase connected for auth/profile/quota foundations.
- Stripe checkout foundation exists but needs real Stripe keys/prices/webhook config.
- Homepage has base hero/input, animated input, tracing border, and side-lane floating icons.
- Dashboard has hook results, saved hooks, planner, rewrite flow, and local workspace sync foundation.
- Hook enrichment v1 exists via `data/hooks_enriched.json` and `scripts/enrich_hooks.py`.

## Phase 1 — Project Brain / Operating System

Status: in progress.

Create and maintain:

- `MADE_BY_FRIDAY_DECISIONS.md`
- `MADE_BY_FRIDAY_ROADMAP.md`
- `MADE_BY_FRIDAY_WORKSTREAMS.md`

Purpose:

- Prevent repeated confusion.
- Make sub-agent delegation consistent.
- Preserve locked decisions.
- Give future sessions clear context.

Definition of done:

- Docs exist.
- Workstreams are clearly defined.
- Each workstream has ownership, files, triggers, and definition of done.

## Phase 2 — Homepage Polish

Goal: make the homepage a clean action trigger.

Tasks:

- Badge: `Trained on patterns from 10,000+ viral videos`.
- Keep headline/subheadline for now.
- Remove visible large input button.
- Keep small send icon fallback.
- Enter submits, Shift+Enter line break.
- Remove pricing section from homepage.
- Use real platform logos in floating icon lanes.
- Ensure icons never overlap hero/input.
- Replace/update app/site icon with creator-relevant microphone/camera direction in coral/red.
- Mobile sanity check.

Definition of done:

- Homepage visually clean.
- Hero central zone is protected from icons.
- Input feels like the product CTA.
- No pricing visible on homepage.
- Live production preview is acceptable to Ed.

## Phase 3 — Dashboard UX

Goal: dashboard should make immediate sense after prompt.

Tasks:

- Build simple obvious sidebar.
- Add creator profile/avatar area.
- Add saved hooks/videos area.
- Add planner/account/settings navigation.
- Improve first-results layout.
- Desktop max 3 cards wide.
- Cards use 9:16 video/reference area.
- Mobile supports natural vertical scroll through 6 results.
- Avoid Instagram distractions/clickaway UI.
- Tight card styling with understated rounded corners.
- Decide modal vs rewrite page after rewrite UX investigation.

Definition of done:

- User can land from homepage and understand where to look/click.
- Saved items and account/settings are obvious.
- Cards look modern and not doomscroll-bait.

## Phase 4 — Rewrite Experience

Goal: Friday becomes a content coach, not a text blob generator.

Tasks:

- Investigate best UX: improved modal vs dedicated rewrite workspace/page.
- Implement chosen rewrite flow.
- Show selected reference hook/video.
- Add structured rewrite output:
  - rewritten hook/script
  - why it works
  - first-frame visual idea
  - caption/CTA
  - alternate versions where useful
- Use enriched hook metadata and rewrite strategy in prompts.
- Save rewritten outputs to workspace/Supabase.

Definition of done:

- Rewrite result is immediately usable by a creator.
- Flow feels modern and guided.
- User does not get pulled off-site.

## Phase 5 — Supabase Sync / Auth

Goal: anonymous use first, account sync after signup/login.

Tasks:

- Run updated Supabase schema.
- Confirm `workspace_data`, Stripe columns, profile fields exist.
- Test anonymous local workspace.
- Test signup/login.
- Sync local workspace into Supabase.
- Confirm saved hooks/profile persist across sessions when logged in.
- Improve auth copy so signup is framed as saving/syncing work, not blocking initial value.

Definition of done:

- Anonymous users can use the product without friction.
- Logged-in users get persistent workspace.
- No saved work disappears during signup/login.

## Phase 6 — Payments / Paywall

Goal: introduce payment only after value is felt.

Tasks:

- Buy/connect domain.
- Update `NEXT_PUBLIC_SITE_URL`.
- Create Stripe products/prices:
  - Founding Pro lifetime $19 first 100.
  - Later Pro $19/month.
  - Future Max TBD.
- Add Stripe env vars to Vercel.
- Configure Stripe webhook.
- Test checkout and plan upgrade.
- Align quota with pricing:
  - Free: 10 rewrites/month.
  - Founding/Pro: unlimited.

Definition of done:

- User can pay successfully.
- Stripe webhook updates Supabase plan.
- Quota matches plan.
- Payment is introduced as an upsell, not homepage friction.

## Phase 7 — Hook Database / Enrichment

Goal: make the hook DB intelligent enough to be the product moat.

Tasks:

- Improve enrichment beyond heuristics.
- Add/prepare remaining 9K videos.
- Add better fields:
  - why it worked
  - quality score
  - example rewrite
  - ideal niches
  - format
  - transcript/thumbnail where available
- Improve search ranking.
- Improve rewrite prompts using metadata.

Definition of done:

- Search results feel relevant.
- Rewrite quality improves because metadata explains hook mechanics.

## Phase 8 — Launch Readiness

Goal: make it ready for users and launch content.

Tasks:

- Mobile QA.
- Loading states.
- Error handling.
- Empty states.
- Basic privacy/terms pages.
- Analytics.
- Production smoke test.
- Content-friendly visual polish.

Definition of done:

- Ed can confidently record/share the product.
- First users can complete the flow without obvious breakage.
