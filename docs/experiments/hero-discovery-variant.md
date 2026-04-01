# Experiment: Hero discovery variant (A/B test)

## Summary

| Field | Value |
|-------|--------|
| **PostHog feature flag** | `hero-discovery-variant` |
| **Variants** | `control` (current hero), `discovery` (discovery-first hero with quick pills) |
| **Code** | [`HeroSectionClient.tsx`](../../src/components/homepage/HeroSectionClient.tsx) |

## Local preview (`npm run dev`)

1. In **`.env.local`**, set **one** of:
   - `NEXT_PUBLIC_HERO_VARIANT_OVERRIDE=discovery` — new hero (pills + discovery CTAs)
   - `NEXT_PUBLIC_HERO_VARIANT_OVERRIDE=control` — original hero
2. Restart the dev server (`npm run dev`).
3. Open `/`. Remove the variable (or leave it unset) to rely on the PostHog flag again.

**Production:** this override is ignored when `NODE_ENV` is not `development`.

## Hypothesis

A discovery-first hero (headline + quick explore pills + “Explore coffees” primary + “Rate a coffee” link) improves first-action clarity versus the current “Which coffee did you brew last?” hero.

## Metrics

| Metric | Type | How to measure |
|--------|------|----------------|
| **CTA click rate** | Primary | `hero_cta_clicked` count ÷ homepage visits (PostHog trends / experiments) |
| **Engagement time** | Primary | Average session time on `/` (PostHog) |
| **Pill engagement** | Secondary (discovery only) | `hero_discovery_pill_clicked` |
| **Scroll depth** | Secondary | PostHog session replay / custom events if added |
| **Bounce rate** | Secondary | Single-page sessions from homepage |

Events include `hero_variant: "control" | "discovery"` on `hero_cta_clicked` where applicable.

## Traffic and duration

- **Approximate traffic**: ~1,500 visitors/month (~375/week).
- **Split**: 50% control / 50% discovery when the flag is configured that way in PostHog.
- **Rough guidance**: Aim for **~1,000 users per variant** before a strong read (often **8–12 weeks** at this traffic level).
- **Early check** (optional): After ~4 weeks, if one variant shows a **>30% relative lift** on primary metrics with a clear confidence interval in PostHog, consider an early decision or stop.

## Decision criteria

| Outcome | Action |
|---------|--------|
| Discovery **wins by >10%** on primary metrics (vs control) | Roll out `discovery` to 100%; remove flag branching or default to discovery. |
| Control wins or **difference <5%** | Keep **control**; remove discovery variant code or leave flag off. |
| **5–10%** difference, inconclusive | Extend the run **4+ weeks** or iterate the discovery design and re-test. |

## PostHog setup (manual)

1. Create a multivariate feature flag or experiment: **`hero-discovery-variant`**.
2. Variants: **`control`**, **`discovery`** (e.g. 50/50).
3. Tie experiment goals to **`hero_cta_clicked`** and optionally **`hero_discovery_pill_clicked`**.
4. Ensure production traffic uses the same PostHog project as [`instrumentation-client.ts`](../../instrumentation-client.ts).

## Rollout

1. **Weeks 1–2**: Validate events, no regressions in hero or search.
2. **Week ~4**: Optional interim read (early stop only if lift is very large and stable).
3. **Weeks 8–12**: Final decision using primary metrics.
4. **After decision**: Ship the winner, remove the losing branch and archive or delete the flag in PostHog.

## Final decision log

_Use this section when the experiment ends._

| Date | Decision | Owner | Notes |
|------|----------|-------|-------|
| | | | |
