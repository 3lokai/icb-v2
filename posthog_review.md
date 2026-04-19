# PostHog Implementation Review

Full audit of PostHog integration across the IndianCoffeeBeans codebase.

---

## Architecture Overview

| Layer | File | Role |
|-------|------|------|
| **Initialization** | [instrumentation-client.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/instrumentation-client.ts) | Client-side PostHog init via Next.js instrumentation hook |
| **Client Wrapper** | [posthog.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts) | [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) helper that adds `env` property |
| **Server Singleton** | [posthog-server.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts) | [getPostHogClient()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts#5-18) singleton for server-side capture |
| **Reverse Proxy** | [next.config.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/next.config.ts#L67-L78) | `/ingest` → `eu.i.posthog.com` rewrites |

**Setup is solid:** EU data residency, reverse proxy to bypass ad-blockers, `capture_exceptions: true`, and debug mode in development.

---

## Events Tracked

### Client-Side Events (9)

All of the following use the [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) helper from `@/lib/posthog` (adds `env` on every event). Direct `posthog-js` usage for `capture` exists only inside [posthog.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts) itself.

| Event | File | Import Style |
|-------|------|-------------|
| `user_signed_in` | [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `user_signed_up` | [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `rating_started` | [QuickRating.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/reviews/QuickRating.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `hero_cta_clicked` | [HeroCTAs.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/homepage/HeroCTAs.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `coffee_page_viewed` | [CoffeeDetailPage.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/coffees/CoffeeDetailPage.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `onboarding_completed` | [onboarding-wizard.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `contact_form_submitted` | [ContactForms.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(main)/(public)/contact/ContactForms.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `partner_cta_clicked` | [PartnerPageClient.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(main)/roasters/partner/PartnerPageClient.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `partner_form_submitted` | [PartnerPageClient.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(main)/roasters/partner/PartnerPageClient.tsx) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |

### Server-Side Events (4)

| Event | File |
|-------|------|
| `review_submitted` | [reviews.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/reviews.ts#L296) |
| `newsletter_subscribed` | [newsletter.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/newsletter.ts#L188) |
| `coffee_logged` | [user-coffees.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/user-coffees.ts#L73) |
| `user_signed_up_oauth` | [callback/route.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(auth)/auth/callback/route.ts#L178) |

### User Identification (3)

| Action | File |
|--------|------|
| **`posthog.identify(user.id, { email })` when session user exists** (primary: email + OAuth, client shell) | [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx) (`useEffect` on `user`) |
| `posthog.identify()` before email sign-in capture | [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) (redundant with provider; keeps identify immediate before auth events) |
| `posthog.identify()` before email sign-up capture | [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) (same) |

**`posthog.reset()`** runs after successful `auth.signOut()` in [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx) `signOut()`.

---

## Issues Found

### Identity lifecycle (resolved)

These were previously flagged as critical gaps; the current app addresses them in [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx) (mounted from [layout.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/layout.tsx)).

#### 1. `posthog.reset()` on sign-out — implemented

After a successful `auth.signOut()`, `signOut()` calls `posthog.reset()` and clears local user state. UI sign-out (e.g. [header.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/header.tsx)) uses `useAuth()` from this provider.

#### 2. Client-side `posthog.identify()` for OAuth (and everyone else) — implemented

A `useEffect` runs `posthog.identify(user.id, { email: user.email })` whenever `user` is set. That covers users who return via OAuth [callback/route.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(auth)/auth/callback/route.ts) as soon as the Supabase client session is available, not only email flows in [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx).

---

### Residual identity risks

Smaller edge cases that are **not** the same as “missing reset” or “OAuth never identified”:

| Risk | Detail |
|------|--------|
| **`SIGNED_OUT` without `reset`** | `onAuthStateChange` clears `user` on `SIGNED_OUT` but does not call `posthog.reset()`. Sessions that end without going through `AuthProvider.signOut()` (e.g. revocation, some multi-tab cases) may leave the PostHog client on the old `distinct_id` until something else resets identity. **Possible fix:** call `posthog.reset()` in the `SIGNED_OUT` branch. |
| **[auth-store.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/store/zustand/auth-store.ts) `signOut`** | Store `signOut` does not call `posthog.reset()`. Nothing in the repo imports `@/hooks/use-auth` today; if sign-out is ever wired to the store instead of the provider, PostHog would not reset. **Possible fix:** add `posthog.reset()` there or route all sign-out through the provider only. |

---

### Client capture pattern (standardized)

Event instrumentation uses `import { capture } from "@/lib/posthog"` (and [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) also imports `posthog` from `@/lib/posthog` for `identify`). Direct `import posthog from "posthog-js"` is appropriate for [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx) (`identify` / `reset`) and [instrumentation-client.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/instrumentation-client.ts) (init).

---

### 🟡 Medium

#### 3. Server-side events are fire-and-forget without flush

The [posthog-server.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts) singleton is configured with `flushAt: 1` and `flushInterval: 0`, which means events flush immediately. However, in serverless (Vercel), the function may terminate before the HTTP request completes. None of the server action calls `await` the capture or call [shutdownPostHog()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts#19-24).

The [shutdownPostHog()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts#19-24) function exists but is **never called anywhere.**

**Fix:** Either:
- Call `await getPostHogClient().flush()` after critical server captures, or
- Use `waitUntil()` from `next/server` (Next.js 15+) to ensure the request completes after the response is sent.

---

#### 4. No `$set` / person properties on identify

Client-side `posthog.identify()` in [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx) and [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) only pass `{ email }`. Useful person properties like `name`, `experience_level`, `signup_method`, and `city` are available elsewhere but not sent to PostHog.

Compare with the server-side OAuth tracking which passes `method` and `email` — but doesn't set `$set` person properties either.

**Fix:** Enrich `posthog.identify()` with available profile data, or set `$set` on the server-side captures.

---

### 🟢 Low / Suggestions

#### 5. Missing events that would be valuable

| Missing Event | Where to Add | Why |
|---|---|---|
| `user_signed_out` | `signOut()` in auth-provider | Track churn signals, session length |
| `onboarding_step_completed` | [onboarding-wizard.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx) [handleNext()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx#238-249) | Understand funnel drop-off per step |
| `search_performed` | Search component | Most e-commerce/discovery sites track this |
| `coffee_compass_used` | `CoffeeCompassClient.tsx` | Tool usage tracking |
| `roaster_page_viewed` | Roaster detail page (if exists) | Parity with `coffee_page_viewed` |
| `review_deleted` | [deleteReview()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/reviews.ts#337-427) in [reviews.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/reviews.ts) | Track negative actions |
| `rating_submitted` (client) | [QuickRating.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/reviews/QuickRating.tsx) [handleSubmit()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx#281-322) | Client-side counterpart to `review_submitted` |

#### 6. `onboarding_completed` event has no properties

The event at [onboarding-wizard.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx) fires with zero properties: `capture("onboarding_completed")`. Consider adding `experience_level`, `brewing_methods_count`, `country`, and `has_milk_preference` to enable cohort analysis of onboarded users.

#### 7. `coffee_page_viewed` lacks price or stock info

The event only sends `coffee_slug` and `roaster_name`. The component already has `coffee.summary.min_price_in_stock` and `coffee.rating_avg` available — adding these would enable price-tier and popularity analysis.

---

## Summary

| Category | Count |
|----------|-------|
| 🔴 Critical issues | 0 (identity reset + client identify covered in [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx)) |
| Residual identity risks | 2 (see table above) |
| 🟡 Medium issues | 2 (server flush; person properties on identify) |
| 🟢 Low / Suggestions | 3 |
| Events tracked | 13 total (9 client, 4 server) |
| User identification | Client: `identify` on session user + email-form redundancy; `reset` on provider sign-out |

**The foundation is well-built** (reverse proxy, EU hosting, instrumentation hook, server singleton, client `capture()` wrapper). Remaining work is mostly server reliability (flush), richer person properties, optional `reset` on `SIGNED_OUT`, and product/analytics events from the Low section.
