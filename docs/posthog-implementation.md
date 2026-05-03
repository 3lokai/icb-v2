# PostHog — implementation reference

Single reference for how PostHog is wired in IndianCoffeeBeans (Next.js App Router), what is instrumented, and when each event fires.

**Related docs**

- [posthog-setup-report.md](../posthog-setup-report.md) — original setup notes, EU dashboard links, dependencies.
- [posthog_review.md](../posthog_review.md) — audit, identity lifecycle, residual risks, improvement backlog.

---

## Summary

| Item | Detail |
|------|--------|
| **Client init** | [`instrumentation-client.ts`](../instrumentation-client.ts) — `posthog-js`; do not add a second `PostHogProvider` init. |
| **Client events** | [`src/lib/posthog.ts`](../src/lib/posthog.ts) — `capture(event, props)` adds **`env`**: `development` \| `production` \| `test` on every event. |
| **Server events** | [`src/lib/posthog-server.ts`](../src/lib/posthog-server.ts) — `getPostHogClient()` (`posthog-node`); **no** `env` unless you add it. |
| **Proxy** | [`next.config.ts`](../next.config.ts) — `/ingest` → `eu.i.posthog.com` (bypass ad blockers). |
| **Identity** | [`src/components/providers/auth-provider.tsx`](../src/components/providers/auth-provider.tsx) — `posthog.identify(user.id, { email })` when `user` is set; `posthog.reset()` after successful `signOut()`. |
| **Custom event names** | **18** distinct names (see [Event catalog](#event-catalog)). |

---

## Dependencies and environment

| Package | Role |
|---------|------|
| `posthog-js` | Browser SDK (versions pinned in `package.json`; see setup report). |
| `posthog-node` | Server captures in route handlers and server actions. |

**Environment variables**

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — project token (client + server).
- `NEXT_PUBLIC_POSTHOG_HOST` — ingest host for `posthog-node` (must align with EU / proxy).

---

## Architecture

| Layer | File | Purpose |
|-------|------|---------|
| **Initialization** | [`instrumentation-client.ts`](../instrumentation-client.ts) | `posthog.init`: `api_host` `https://b.indiancoffeebeans.com`, `ui_host` `https://eu.posthog.com`, `defaults: "2026-01-30"`, `capture_exceptions: true`, `disable_scroll_properties: false` (scroll context for Web Analytics scroll depth / `$pageleave`), `debug` in development, `disable_session_recording` in development. |
| **Client helper** | [`src/lib/posthog.ts`](../src/lib/posthog.ts) | `capture()` → `posthog.capture` with `{ env: NODE_ENV, ...props }`; re-exports `posthog` for `identify`. |
| **Server client** | [`src/lib/posthog-server.ts`](../src/lib/posthog-server.ts) | Singleton: `flushAt: 1`, `flushInterval: 0`; `shutdownPostHog()` for graceful shutdown (currently unused). |
| **Rewrites** | [`next.config.ts`](../next.config.ts) | `/ingest/static/:path*` → `eu-assets.i.posthog.com`; `/ingest/:path*` → `eu.i.posthog.com`; `skipTrailingSlashRedirect: true`. |
| **Auth shell** | [`src/components/providers/auth-provider.tsx`](../src/components/providers/auth-provider.tsx) | Session `identify`, sign-out `reset` (see [Identity](#identity)). |
| **Root layout** | [`src/app/layout.tsx`](../src/app/layout.tsx) | Wraps the app with `AuthProvider` so identity applies to OAuth return and email sessions. |

**Not automatically tracked here:** PostHog product features beyond init (e.g. session replay is disabled in development via config). Standard PostHog autocapture may still apply per project settings; this doc lists **explicit** `capture` / `getPostHogClient().capture` calls only. **Scroll depth** (Web Analytics) uses the SDK scroll manager when `disable_scroll_properties` is not `true` — we set `disable_scroll_properties: false` explicitly so scroll metrics attach to `$pageleave` (requires `capture_pageleave` to run; default with `defaults: "2026-01-30"` aligns with automatic pageviews).

---

## Identity

| Action | Where | Notes |
|--------|-------|--------|
| `posthog.identify(user.id, { email })` | `auth-provider.tsx` | Runs in a `useEffect` when `user` is non-null — **primary** path for email and OAuth. |
| `posthog.identify(...)` before auth events | `auth-form.tsx` | Email sign-in / sign-up; redundant with provider but runs immediately before `user_signed_in` / `user_signed_up`. |
| `posthog.reset()` | `auth-provider.tsx` `signOut()` | After successful `auth.signOut()`. |

**Residual risks** (see [posthog_review.md](../posthog_review.md)): `SIGNED_OUT` in `onAuthStateChange` does not call `reset`; Zustand [`auth-store.ts`](../src/store/zustand/auth-store.ts) `signOut` has no PostHog reset if used instead of the provider.

---

## Event catalog

All **client** events go through `capture()` unless noted. **Server** events use `getPostHogClient().capture({ distinctId, event, properties })`.

### Authentication

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `user_signed_in` | Client | [`src/components/layout/auth-form.tsx`](../src/components/layout/auth-form.tsx) | Successful email/password sign-in | `method: "email"` |
| `user_signed_up` | Client | [`auth-form.tsx`](../src/components/layout/auth-form.tsx) | Successful email/password sign-up | `method: "email"` |
| `user_signed_up_oauth` | Server | [`src/app/(auth)/auth/callback/route.ts`](../src/app/(auth)/auth/callback/route.ts) | OAuth (or any) callback: user `created_at` is **within the last 5 minutes** | `method`: `"google"` \| `"facebook"` \| `"email"` (from Supabase metadata), `email`. `distinctId`: `user.id`. **Name is fixed in code** — not strictly “OAuth-only”; email-provider signups can match the time window. |

### Ratings and reviews (client)

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `rating_started` | Client | [`src/components/reviews/QuickRating.tsx`](../src/components/reviews/QuickRating.tsx) | First star click on the quick rating widget for the current `entityId` | `entity_type`, `entity_id`, `rating_value`; optional `coffee_slug` if `slug` prop is set |
| `rating_started` | Client | [`src/components/reviews/ReviewCapture.tsx`](../src/components/reviews/ReviewCapture.tsx) | First star click in the full review capture flow | `entity_type`, `entity_id`, `rating_value` |
| `rating_form_submitted` | Client | [`QuickRating.tsx`](../src/components/reviews/QuickRating.tsx) | Review `createReview` succeeds | `entity_type`, `entity_id`, `is_first_rating`, `variant` (component variant) |
| `rating_form_submitted` | Client | [`ReviewCapture.tsx`](../src/components/reviews/ReviewCapture.tsx) | Review create succeeds from capture UI | `entity_type`, `entity_id`, `is_first_rating`, `variant: "review_capture"` |
| `rating_form_abandoned` | Client | [`QuickRating.tsx`](../src/components/reviews/QuickRating.tsx) | Component unmounts after user touched the form but did not successfully submit | `entity_type`, `entity_id`, `variant` |
| `rating_form_abandoned` | Client | [`ReviewCapture.tsx`](../src/components/reviews/ReviewCapture.tsx) | Same pattern for capture flow | `entity_type`, `entity_id`, `variant: "review_capture"` |
| `anon_review_limit_cta_clicked` | Client | [`QuickRating.tsx`](../src/components/reviews/QuickRating.tsx), [`ReviewCapture.tsx`](../src/components/reviews/ReviewCapture.tsx) | User clicks “Sign in / Sign up” from anonymous limit UI | `entity_type`, `entity_id` |

### Ratings and reviews (server)

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `review_submitted` | Server | [`src/app/actions/reviews.ts`](../src/app/actions/reviews.ts) | After a review row is inserted successfully | `entity_type`, `entity_id`, `rating`, `user_type`: `"authenticated"` \| `"anonymous"`, `is_first_rating`. `distinctId`: `user_id` or `anon_id` or `"anonymous"`. |

### Discovery and pages

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `coffee_page_viewed` | Client | [`src/components/coffees/CoffeeDetailPage.tsx`](../src/components/coffees/CoffeeDetailPage.tsx) | Once per coffee detail view in a `useEffect` tied to the coffee (with GA4 view item) | `coffee_slug`, `roaster_name` (nullable) |
| `rating_page_viewed` | Client | [`CoffeeDetailPage.tsx`](../src/components/coffees/CoffeeDetailPage.tsx) | Same mount effect as `coffee_page_viewed` | `entity_type: "coffee"`, `entity_id`, `coffee_slug` |
| `rating_page_viewed` | Client | [`src/components/roasters/RoasterDetailPage.tsx`](../src/components/roasters/RoasterDetailPage.tsx) | On roaster profile load (`useEffect` on `roaster.id`) | `entity_type: "roaster"`, `entity_id`, `roaster_slug` |
| `hero_cta_clicked` | Client | [`src/components/homepage/hero/HeroCTAs.tsx`](../src/components/homepage/hero/HeroCTAs.tsx) | User clicks a hero CTA (labels vary by segment) | `cta_label` (human-readable string), `hero_segment` (e.g. `discovery`, `returning_browser`, `rating_progress`, `anon_conversion`, `authenticated_profile`) |
| `learn_article_viewed` | Client | [`src/components/blog/LearnArticleTracker.tsx`](../src/components/blog/LearnArticleTracker.tsx) | Once per stable article `slug` on `/learn/{slug}` (`useEffect` keyed on `slug`) | `slug`, `title`, `category_slug` (nullable) |

### Onboarding

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `onboarding_completed` | Client | [`src/components/onboarding/onboarding-wizard.tsx`](../src/components/onboarding/onboarding-wizard.tsx) | `saveOnboardingData` succeeds before redirect to personalized coffees | `experience_level`, `brewing_methods_count`, `has_milk_preference` |

### Contact and partner

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `contact_form_submitted` | Client | [`src/app/(main)/(public)/contact/ContactForms.tsx`](../src/app/(main)/(public)/contact/ContactForms.tsx) | Non-newsletter form submit succeeds | `form_type` |
| `partner_cta_clicked` | Client | [`src/app/(main)/roasters/partner/PartnerPageClient.tsx`](../src/app/(main)/roasters/partner/PartnerPageClient.tsx) | User clicks partner tier / benefit CTAs | `tier` (string; includes benefit tier names, `"verified"`, `"free"`) |
| `partner_form_submitted` | Client | [`PartnerPageClient.tsx`](../src/app/(main)/roasters/partner/PartnerPageClient.tsx) | Partner form submission succeeds | `form_type`: active form id or `""` |

### Newsletter and logged coffees (server)

| Event | Layer | Source file | When it fires | Properties |
|-------|-------|-------------|---------------|------------|
| `newsletter_subscribed` | Server | [`src/app/actions/newsletter.ts`](../src/app/actions/newsletter.ts) | Newsletter subscription is persisted successfully | `email`, `authenticated`. `distinctId`: `user.id` or email |
| `coffee_logged` | Server | [`src/app/actions/user-coffees.ts`](../src/app/actions/user-coffees.ts) | User adds a coffee to their list successfully | `coffee_id`, `status` (defaults to `"logged"`). `distinctId`: current user id |

**Note:** Contact page newsletter signup does **not** fire `contact_form_submitted`; subscription is tracked server-side as `newsletter_subscribed`.

---

## Files that touch PostHog (quick index)

| File | Role |
|------|------|
| [`instrumentation-client.ts`](../instrumentation-client.ts) | Client init |
| [`src/lib/posthog.ts`](../src/lib/posthog.ts) | `capture`, `posthog` re-export |
| [`src/lib/posthog-server.ts`](../src/lib/posthog-server.ts) | Server singleton |
| [`src/components/providers/auth-provider.tsx`](../src/components/providers/auth-provider.tsx) | `identify`, `reset` |
| [`src/components/layout/auth-form.tsx`](../src/components/layout/auth-form.tsx) | Email auth `identify` + `user_signed_in` / `user_signed_up` |
| [`src/app/(auth)/auth/callback/route.ts`](../src/app/(auth)/auth/callback/route.ts) | `user_signed_up_oauth` |
| [`src/app/actions/reviews.ts`](../src/app/actions/reviews.ts) | `review_submitted` |
| [`src/app/actions/newsletter.ts`](../src/app/actions/newsletter.ts) | `newsletter_subscribed` |
| [`src/app/actions/user-coffees.ts`](../src/app/actions/user-coffees.ts) | `coffee_logged` |
| [`src/components/coffees/CoffeeDetailPage.tsx`](../src/components/coffees/CoffeeDetailPage.tsx) | `coffee_page_viewed`, `rating_page_viewed` |
| [`src/components/roasters/RoasterDetailPage.tsx`](../src/components/roasters/RoasterDetailPage.tsx) | `rating_page_viewed` |
| [`src/components/reviews/QuickRating.tsx`](../src/components/reviews/QuickRating.tsx) | Rating funnel events |
| [`src/components/reviews/ReviewCapture.tsx`](../src/components/reviews/ReviewCapture.tsx) | Rating funnel events (full form) |
| [`src/components/homepage/hero/HeroCTAs.tsx`](../src/components/homepage/hero/HeroCTAs.tsx) | `hero_cta_clicked` |
| [`src/components/onboarding/onboarding-wizard.tsx`](../src/components/onboarding/onboarding-wizard.tsx) | `onboarding_completed` |
| [`src/app/(main)/(public)/contact/ContactForms.tsx`](../src/app/(main)/(public)/contact/ContactForms.tsx) | `contact_form_submitted` |
| [`src/app/(main)/roasters/partner/PartnerPageClient.tsx`](../src/app/(main)/roasters/partner/PartnerPageClient.tsx) | `partner_*` |
| [`src/components/blog/LearnArticleTracker.tsx`](../src/components/blog/LearnArticleTracker.tsx) | `learn_article_viewed` (mounted from [`learn/[slug]/page.tsx`](../src/app/(main)/learn/[slug]/page.tsx)) |

---

## PostHog app links

EU project dashboard and saved insights are listed in [posthog-setup-report.md](../posthog-setup-report.md) (project `122076`).

---

## Maintenance

When adding an event: prefer `capture()` from `@/lib/posthog` on the client so `env` stays consistent; on the server, use `getPostHogClient()` and set `distinctId` deliberately. Update **this file** and the tables in [posthog_review.md](../posthog_review.md) so counts stay aligned.

Known follow-ups: serverless flush reliability and richer person properties — see [posthog_review.md](../posthog_review.md).
