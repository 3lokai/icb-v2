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

### Client-Side Events (6)

| Event | File | Import Style |
|-------|------|-------------|
| `user_signed_in` | [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx#L109) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `user_signed_up` | [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx#L139) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `rating_started` | [QuickRating.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/reviews/QuickRating.tsx#L237) | ❌ Direct `posthog-js` |
| `hero_cta_clicked` | [HeroCTAs.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/homepage/HeroCTAs.tsx#L24) | ❌ Direct `posthog-js` |
| `coffee_page_viewed` | [CoffeeDetailPage.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/coffees/CoffeeDetailPage.tsx#L51) | ❌ Direct `posthog-js` |
| `onboarding_completed` | [onboarding-wizard.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx#L312) | ❌ Direct `posthog-js` |
| `contact_form_submitted` | [ContactForms.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(main)/(public)/contact/ContactForms.tsx#L176) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `partner_cta_clicked` | [PartnerPageClient.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(main)/roasters/partner/PartnerPageClient.tsx#L201) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |
| `partner_form_submitted` | [PartnerPageClient.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(main)/roasters/partner/PartnerPageClient.tsx#L634) | ✅ [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper |

### Server-Side Events (4)

| Event | File |
|-------|------|
| `review_submitted` | [reviews.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/reviews.ts#L296) |
| `newsletter_subscribed` | [newsletter.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/newsletter.ts#L188) |
| `coffee_logged` | [user-coffees.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/user-coffees.ts#L73) |
| `user_signed_up_oauth` | [callback/route.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/(auth)/auth/callback/route.ts#L178) |

### User Identification (2)

| Action | File |
|--------|------|
| `posthog.identify()` on email sign-in | [auth-form.tsx:L106](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx#L106) |
| `posthog.identify()` on email sign-up | [auth-form.tsx:L136](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx#L136) |

---

## Issues Found

### 🔴 Critical

#### 1. Missing `posthog.reset()` on sign-out

There is **no** `posthog.reset()` call anywhere in the codebase. When a user logs out, PostHog continues to associate all subsequent anonymous events with the previous user's `distinct_id`. This **corrupts analytics** if another user shares the same browser/device.

**Affected files:** [auth-store.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/store/zustand/auth-store.ts), [auth-provider.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/providers/auth-provider.tsx), [header.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/header.tsx)

**Fix:** Add `posthog.reset()` in the `signOut` function of the auth provider or auth store, before or after the Supabase `signOut()` call.

---

#### 2. Missing `posthog.identify()` for OAuth users (client-side)

OAuth sign-ups capture `user_signed_up_oauth` **server-side**, but there's no **client-side** `posthog.identify()` call for OAuth users. The [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) only identifies email sign-in/sign-up users. OAuth users return via the callback route and are redirected to `/dashboard` or `/auth/onboarding` without ever being identified on the client.

This means PostHog's client-side session continues as anonymous for OAuth users — ad-hoc pageviews, `$pageview`, autocaptured clicks, etc. won't merge to the known user.

**Fix:** Call `posthog.identify(user.id, { email })` in the auth provider or a layout component when the session user is detected.

---

### 🟡 Medium

#### 3. Inconsistent import patterns

4 files import `posthog` directly from `posthog-js` and call `posthog.capture()`. 4 other files correctly use the [capture()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11) wrapper from `@/lib/posthog`.

The wrapper adds `{ env: process.env.NODE_ENV }` to every event. The direct imports **skip this property**, so events from [QuickRating](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/reviews/QuickRating.tsx#54-695), [HeroCTAs](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/homepage/HeroCTAs.tsx#11-81), [CoffeeDetailPage](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/coffees/CoffeeDetailPage.tsx#30-531), and `onboarding-wizard` lack the `env` property.

| Uses Wrapper ✅ | Uses Direct Import ❌ |
|---|---|
| [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) | [QuickRating.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/reviews/QuickRating.tsx) |
| [ContactForms.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/%28main%29/%28public%29/contact/ContactForms.tsx) | [HeroCTAs.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/homepage/HeroCTAs.tsx) |
| [PartnerPageClient.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/%28main%29/roasters/partner/PartnerPageClient.tsx) | [CoffeeDetailPage.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/coffees/CoffeeDetailPage.tsx) |
| | [onboarding-wizard.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx) |

**Fix:** Replace all `import posthog from "posthog-js"` + `posthog.capture(...)` with `import { capture } from "@/lib/posthog"` + [capture(...)](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog.ts#5-11).

---

#### 4. Server-side events are fire-and-forget without flush

The [posthog-server.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts) singleton is configured with `flushAt: 1` and `flushInterval: 0`, which means events flush immediately. However, in serverless (Vercel), the function may terminate before the HTTP request completes. None of the server action calls `await` the capture or call [shutdownPostHog()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts#19-24).

The [shutdownPostHog()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/lib/posthog-server.ts#19-24) function exists but is **never called anywhere.**

**Fix:** Either:
- Call `await getPostHogClient().flush()` after critical server captures, or
- Use `waitUntil()` from `next/server` (Next.js 15+) to ensure the request completes after the response is sent.

---

#### 5. No `$set` / person properties on identify

The `posthog.identify()` calls in [auth-form.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/layout/auth-form.tsx) only set `{ email }`. Useful person properties like `name`, `experience_level`, `signup_method`, and `city` are available but not passed to PostHog.

Compare with the server-side OAuth tracking which passes `method` and `email` — but doesn't set `$set` person properties either.

**Fix:** Enrich `posthog.identify()` with available profile data, or set `$set` on the server-side captures.

---

### 🟢 Low / Suggestions

#### 6. Missing events that would be valuable

| Missing Event | Where to Add | Why |
|---|---|---|
| `user_signed_out` | `signOut()` in auth-provider | Track churn signals, session length |
| `onboarding_step_completed` | [onboarding-wizard.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx) [handleNext()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx#238-249) | Understand funnel drop-off per step |
| `search_performed` | Search component | Most e-commerce/discovery sites track this |
| `coffee_compass_used` | `CoffeeCompassClient.tsx` | Tool usage tracking |
| `roaster_page_viewed` | Roaster detail page (if exists) | Parity with `coffee_page_viewed` |
| `review_deleted` | [deleteReview()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/reviews.ts#337-427) in [reviews.ts](file:///d:/Projects/indiancoffeebeans/icb-v2/src/app/actions/reviews.ts) | Track negative actions |
| `rating_submitted` (client) | [QuickRating.tsx](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/reviews/QuickRating.tsx) [handleSubmit()](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx#281-322) | Client-side counterpart to `review_submitted` |

#### 7. `onboarding_completed` event has no properties

The event at [onboarding-wizard.tsx:L312](file:///d:/Projects/indiancoffeebeans/icb-v2/src/components/onboarding/onboarding-wizard.tsx#L312) fires with zero properties: `posthog.capture("onboarding_completed")`. Consider adding `experience_level`, `brewing_methods_count`, `country`, and `has_milk_preference` to enable cohort analysis of onboarded users.

#### 8. `coffee_page_viewed` lacks price or stock info

The event only sends `coffee_slug` and `roaster_name`. The component already has `coffee.summary.min_price_in_stock` and `coffee.rating_avg` available — adding these would enable price-tier and popularity analysis.

---

## Summary

| Category | Count |
|----------|-------|
| 🔴 Critical issues | 2 |
| 🟡 Medium issues | 3 |
| 🟢 Low / Suggestions | 3 |
| Events tracked | 13 total (9 client, 4 server) |
| User identification | Partial (email only, no OAuth client-side, no reset) |

**The foundation is well-built** (reverse proxy, EU hosting, instrumentation hook, server singleton). The main gaps are around identity lifecycle (`reset`, OAuth `identify`) and consistency (wrapper vs direct import).
