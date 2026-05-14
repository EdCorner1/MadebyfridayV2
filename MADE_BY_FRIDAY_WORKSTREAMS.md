# Made by Friday — Workstreams & Sub-Agent Routing

This file defines how to split work across focused sub-agents. Use it before spawning agents or starting major work.

## Operating Rule

The main assistant acts as coordinator/editor.

Sub-agents own focused research/build tasks. The main assistant integrates, reviews, and keeps product direction consistent.

Do not spawn agents randomly. Spawn them when the task clearly maps to a workstream below.

## Memory Rule

Before major Made by Friday work:

1. Read `MADE_BY_FRIDAY_DECISIONS.md`.
2. Read `MADE_BY_FRIDAY_ROADMAP.md`.
3. Read this file.
4. Spawn relevant workstream agents if the task is non-trivial.
5. Update roadmap/decisions if the direction changes.

## Workstream 1 — Homepage / Brand / Visual UX

### Owns

- Homepage layout.
- Hero copy implementation.
- Floating social icons.
- Animated input placeholder.
- Animated input border.
- App/site icon.
- Visual consistency.
- Mobile first impression.

### Key decisions

- Badge: `Trained on patterns from 10,000+ viral videos`.
- No pricing on homepage for now.
- Input is the CTA.
- Real platform logos only.
- Icons stay in side lanes and never interfere with hero/input.
- Icon should be creator-relevant, likely microphone/camera, coral/red.

### Files likely touched

- `app/page.tsx`
- `app/components/HeroForm.tsx`
- `app/components/FloatingSocialIcons.tsx`
- `app/globals.css`
- `public/favicon.svg`
- `public/logo_app_icon.svg`
- `public/logo_app_icon.png`

### Spawn when

- User asks about homepage/design/brand/icon.
- Homepage visual changes are more than small copy edits.
- App icon/logo direction needs exploration.

### Definition of done

- Homepage is clean, action-first, and visually safe.
- No visual overlap/chaos.
- Mobile and desktop checked.
- Build/lint passes.

## Workstream 2 — Dashboard UX

### Owns

- Dashboard layout.
- Sidebar.
- Hook cards.
- Saved hooks/videos.
- Planner.
- Account/settings navigation.
- Mobile dashboard flow.
- Reference video presentation.

### Key decisions

- Sidebar should be obvious and require no thinking.
- Desktop max 3 cards wide.
- Cards should use 9:16 video/reference area.
- Rounded corners understated: roughly 11–18px.
- Avoid any Instagram UI that encourages clicking away/doomscrolling.

### Files likely touched

- `app/dashboard/DashboardClient.tsx`
- `app/dashboard/HookGrid.tsx`
- `app/dashboard/HookCard.tsx`
- `app/dashboard/PlannerSidebar.tsx`
- `app/dashboard/localWorkspace.ts`
- `app/dashboard/types.ts`

### Spawn when

- User asks about dashboard/card/sidebar/planner UX.
- Making layout changes to dashboard.
- Deciding how saved videos/hooks should be presented.

### Definition of done

- Dashboard after prompt makes immediate sense.
- Cards are clean and modern.
- Saved items and account/settings are easy to find.
- Mobile flow is usable.

## Workstream 3 — Rewrite Experience / Friday Coach

### Owns

- Rewrite UX.
- Modal vs dedicated rewrite page/workspace.
- Friday’s coaching behaviour.
- Rewrite prompt quality.
- Structured output.
- Transcript/reference usage.
- Saving rewritten scripts.

### Key decisions

- Friday should feel like a content coach.
- Output should be more than a blob:
  - rewritten hook/script
  - why it works
  - first-frame visual idea
  - caption/CTA
  - alternate versions where useful
- Use enriched metadata and rewrite strategy.

### Files likely touched

- `app/dashboard/RewritePanel.tsx`
- `app/dashboard/RewritePanelParts.tsx`
- future `app/dashboard/rewrite/...`
- `app/api/rewrite/route.ts`
- `app/lib/hookSearch.ts`
- `app/dashboard/types.ts`

### Spawn when

- User asks about rewrite quality or rewrite UI.
- Evaluating modal vs dedicated page.
- Changing prompt/output structure.

### Definition of done

- Rewrite result is immediately usable.
- Friday feels useful and opinionated.
- Flow keeps user inside the product.

## Workstream 4 — Hook Data / Enrichment

### Owns

- Hook database.
- Enrichment scripts.
- Search relevance.
- Tagging strategy.
- Importing 9K video/hook records.
- Metadata quality.

### Key decisions

- Hook enrichment is a product moat.
- Current enrichment is heuristic and should improve.
- Search should match by niche, mechanism, emotional driver, and intent.

### Files likely touched

- `data/hooks.json`
- `data/hooks_enriched.json`
- `scripts/enrich_hooks.py`
- `app/lib/hookSearch.ts`
- future import/transcript scripts

### Spawn when

- User asks about database quality/search/tagging/imports.
- Adding new viral videos/hooks.
- Improving recommendation quality.

### Definition of done

- Hook metadata is richer and useful.
- Search returns more relevant/diverse results.
- Rewrite quality improves from metadata.

## Workstream 5 — Auth / Supabase / Payments

### Owns

- Supabase auth.
- localStorage-to-Supabase sync.
- Profiles.
- Quotas/plans.
- Stripe checkout/webhooks.
- Domain/env config.

### Key decisions

- localStorage stays for anonymous use.
- Supabase is account persistence after signup/login.
- Free = 10 rewrites/month.
- Founding Pro = $19 lifetime for first 100.
- Later Pro = $19/month with legacy pricing promise.
- Payment is upsell after value, not homepage friction.

### Files likely touched

- `app/components/AuthProvider.tsx`
- `app/components/AuthModal.tsx`
- `app/lib/supabase.ts`
- `app/lib/workspaceSync.ts`
- `app/lib/quota.ts`
- `app/lib/plans.ts`
- `app/lib/stripe.ts`
- `app/api/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `supabase_schema.sql`
- Vercel env vars

### Spawn when

- User asks about auth, accounts, Supabase, domain, Stripe, quotas, plans.
- Adding/changing payment behaviour.
- Debugging account persistence.

### Definition of done

- Auth works.
- Workspace sync works.
- Stripe payment updates plan.
- Quotas match plans.
- Production env is configured.

## Workstream 6 — QA / Deployment

### Owns

- Lint/build.
- Production smoke tests.
- Browser checks.
- Mobile checks.
- Broken links/routes.
- Vercel deployment sanity.
- Domain checks.

### Files likely touched

- usually none, unless fixing discovered issues.

### Spawn when

- Before/after major deploys.
- User asks “is it live?” or “are you sure?”
- After homepage/dashboard/payment changes.

### Definition of done

- `npm run lint` passes.
- `npm run build` passes.
- Production opens.
- Critical flows smoke-tested.

## Routing Examples

If user says:

- “Homepage looks wrong” → Homepage / Brand / Visual UX agent.
- “Cards/dashboard/sidebar need work” → Dashboard UX agent.
- “Rewrite output is bad” → Rewrite Experience agent.
- “Search results are irrelevant” → Hook Data / Enrichment agent.
- “Stripe/domain/login is broken” → Auth / Supabase / Payments agent.
- “Are you sure this is deployed?” → QA / Deployment agent.

## Coordination Pattern

For substantial work:

1. Main assistant states plan.
2. Spawn one or more relevant agents.
3. Agents return findings/build recommendations.
4. Main assistant chooses/integrates.
5. Run lint/build.
6. Browser smoke test if UI changed.
7. Commit/push.
8. Update roadmap/decisions if needed.
