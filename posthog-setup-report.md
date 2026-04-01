# PostHog setup report

PostHog is integrated across the IndianCoffeeBeans Next.js 16 App Router project: client init via Next.js instrumentation, a shared `capture()` helper (adds `env` on every event), server-side `posthog-node` for actions and auth callback, user identification on email auth and on session, and `posthog.reset()` on sign-out.

## Dependencies

| Package       | Version (approx.) |
| ------------- | ----------------- |
| `posthog-js`  | ^1.363.3          |
| `posthog-node`| ^5.28.5           |

## Environment variables

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — project token (client + server)
- `NEXT_PUBLIC_POSTHOG_HOST` — ingest host for `posthog-node` (should match your EU / proxy setup)

## Architecture

| Layer | Role |
| ----- | ---- |
| `instrumentation-client.ts` | Initializes `posthog-js` once (Next.js 15.3+ pattern). Uses production `api_host` `https://b.indiancoffeebeans.com`, `ui_host` `https://eu.posthog.com`, `defaults: "2026-01-30"`, `capture_exceptions: true`, `debug` in development. **Do not** add a separate `PostHogProvider` init. |
| `src/lib/posthog.ts` | Client `capture(event, props)` → `posthog.capture` with `{ env: NODE_ENV, ...props }`. Re-exports `posthog`. |
| `src/lib/posthog-server.ts` | Singleton `getPostHogClient()` (`posthog-node`), `flushAt: 1`, `flushInterval: 0`, `shutdownPostHog()` for graceful shutdown. |
| `next.config.ts` | Rewrites `/ingest/static/*` → `eu-assets.i.posthog.com`, `/ingest/*` → `eu.i.posthog.com`; `skipTrailingSlashRedirect: true`. |
| `src/components/providers/auth-provider.tsx` | On authenticated user: `posthog.identify(user.id, { email })`. On sign-out success: `posthog.reset()`. |
| `src/components/layout/auth-form.tsx` | Email sign-in / sign-up: `posthog.identify` then `capture` (see events below). |

## Files created or modified (integration)

| File | Role |
| ---- | ---- |
| `instrumentation-client.ts` | Client PostHog init |
| `src/lib/posthog-server.ts` | Server client |
| `src/lib/posthog.ts` | Client capture helper |
| `next.config.ts` | EU proxy rewrites |
| `src/components/layout/auth-form.tsx` | Email auth + identify + events |
| `src/components/providers/auth-provider.tsx` | Session identify + reset |
| `src/app/(auth)/auth/callback/route.ts` | OAuth new-user server event |
| `src/components/onboarding/onboarding-wizard.tsx` | `onboarding_completed` |
| `src/components/homepage/HeroCTAs.tsx` | `hero_cta_clicked` |
| `src/components/coffees/CoffeeDetailPage.tsx` | `coffee_page_viewed` |
| `src/components/reviews/QuickRating.tsx` | `rating_started` |
| `src/app/actions/reviews.ts` | `review_submitted` |
| `src/app/actions/newsletter.ts` | `newsletter_subscribed` |
| `src/app/actions/user-coffees.ts` | `coffee_logged` |
| `src/app/(main)/(public)/contact/ContactForms.tsx` | `contact_form_submitted` |
| `src/app/(main)/roasters/partner/PartnerPageClient.tsx` | `partner_cta_clicked`, `partner_form_submitted` |

`.env.local` should define the PostHog variables (not committed).

---

## Events tracked

There are **13** distinct custom event names in the codebase (see tables below).

All client events sent through `capture()` also include **`env`** (`development` | `production` | `test`) unless noted.

### Authentication & identity

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `user_signed_in` | `auth-form.tsx` | `method: "email"` |
| `user_signed_up` | `auth-form.tsx` | `method: "email"` |
| `user_signed_up_oauth` | `auth/callback/route.ts` (server) | `method`: `"google"` \| `"facebook"` \| `"email"` (from provider metadata), `email` |

Server events use `distinctId: user.id` (or email where applicable). Client email flows call `posthog.identify` before capture. **`user_signed_up_oauth`** runs when this callback sees a user whose **`created_at` is within the last five minutes** (first session after sign-up). The event name is fixed in code; it is **not** OAuth-only—`method` is still set from Supabase provider metadata (`email` when no OAuth provider is detected).

Server `getPostHogClient().capture()` calls do **not** add the client helper’s `env` property; only `capture()` in `src/lib/posthog.ts` does.

### Onboarding & profile

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `onboarding_completed` | `onboarding-wizard.tsx` | `experience_level`, `brewing_methods_count`, `has_milk_preference` |

### Coffee discovery & detail

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `coffee_page_viewed` | `CoffeeDetailPage.tsx` | `coffee_slug`, `roaster_name` (nullable) — fired once per `coffee.id` in a `useEffect` (alongside GA4 view item). |
| `hero_cta_clicked` | `HeroCTAs.tsx` | `cta_label`: `"Start rating coffees"` \| `"Explore coffees"` |

### Reviews

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `rating_started` | `QuickRating.tsx` | First star interaction only: `entity_type`, optional `coffee_slug` if `slug` is set. |
| `review_submitted` | `actions/reviews.ts` (server) | `entity_type`, `entity_id`, `rating`, `user_type`: `"authenticated"` \| `"anonymous"`; `distinctId`: `user_id` or `anon_id` or `"anonymous"`. |

### Newsletter & contact

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `newsletter_subscribed` | `actions/newsletter.ts` (server) | `email`, `authenticated`: boolean; `distinctId`: `user.id` or email. |
| `contact_form_submitted` | `ContactForms.tsx` | `form_type` — only when submit succeeds and **not** the newsletter-only form (newsletter is tracked server-side). |

### Partner (roasters)

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `partner_cta_clicked` | `PartnerPageClient.tsx` | `tier`: benefit tier string, or `"verified"` / `"free"` depending on CTA. |
| `partner_form_submitted` | `PartnerPageClient.tsx` | `form_type`: active form id or `""`. |

### User coffee list

| Event | Where | Properties |
| ----- | ----- | ----------- |
| `coffee_logged` | `actions/user-coffees.ts` (server) | `coffee_id`, `status` (defaults to `"logged"`); `distinctId`: current user id. |

---

## PostHog UI links (wizard)

Dashboards and insights from the original setup (project `122076`, EU):

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/122076/dashboard/584074
- **New Sign-ups (Email + OAuth)**: https://eu.posthog.com/project/122076/insights/Lg0UsajE
- **Sign-up to Onboarding Funnel**: https://eu.posthog.com/project/122076/insights/VeGXJXTB
- **Reviews Submitted**: https://eu.posthog.com/project/122076/insights/4JGK77YO
- **Coffees Logged by Users**: https://eu.posthog.com/project/122076/insights/PUQXIo75
- **Partner & Contact Conversions**: https://eu.posthog.com/project/122076/insights/KfWAIT3c

Consider adding insights for `coffee_page_viewed`, `hero_cta_clicked`, and `rating_started` if not already covered by funnels.

## Agent skill

`.claude/skills/integration-nextjs-app-router/` — PostHog + Next.js App Router patterns for future work.
