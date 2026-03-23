<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the IndianCoffeeBeans.com Next.js 16 App Router project. The integration covers both client-side and server-side event tracking, user identification, and automatic exception capture.

## Files created or modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created — initializes PostHog JS via the Next.js instrumentation hook with EU host, reverse proxy, and exception tracking |
| `src/lib/posthog-server.ts` | Created — singleton `getPostHogClient()` for server-side event capture via `posthog-node` |
| `.env.local` | Updated — added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `next.config.ts` | Updated — added `/ingest` reverse proxy rewrites for EU PostHog endpoints and `skipTrailingSlashRedirect: true` |
| `src/components/layout/auth-form.tsx` | Updated — `posthog.identify()` + `posthog.capture()` on email sign-in and sign-up success |
| `src/app/(auth)/auth/callback/route.ts` | Updated — server-side capture of `user_signed_up_oauth` for new OAuth users |
| `src/components/onboarding/onboarding-wizard.tsx` | Updated — `posthog.capture('onboarding_completed')` on onboarding save success |
| `src/app/actions/reviews.ts` | Updated — server-side capture of `review_submitted` after successful insert |
| `src/app/actions/newsletter.ts` | Updated — server-side capture of `newsletter_subscribed` after successful subscription |
| `src/app/actions/user-coffees.ts` | Updated — server-side capture of `coffee_logged` after successful add |
| `src/app/(main)/(public)/contact/ContactForms.tsx` | Updated — `posthog.capture('contact_form_submitted')` on any contact form success |
| `src/app/(main)/roasters/partner/PartnerPageClient.tsx` | Updated — `posthog.capture('partner_cta_clicked')` and `posthog.capture('partner_form_submitted')` alongside existing GA4 calls |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account via email/password | `src/components/layout/auth-form.tsx` |
| `user_signed_in` | User successfully signs in via email/password | `src/components/layout/auth-form.tsx` |
| `user_signed_up_oauth` | New user signs up via OAuth (Google or Facebook) — detected server-side by creation timestamp | `src/app/(auth)/auth/callback/route.ts` |
| `onboarding_completed` | User finishes onboarding wizard and saves their profile for the first time | `src/components/onboarding/onboarding-wizard.tsx` |
| `review_submitted` | User submits a review for a coffee or roaster (server-side, critical user action) | `src/app/actions/reviews.ts` |
| `newsletter_subscribed` | User subscribes to the ICB newsletter (server-side) | `src/app/actions/newsletter.ts` |
| `coffee_logged` | Authenticated user adds a coffee to their tried/tasted list | `src/app/actions/user-coffees.ts` |
| `contact_form_submitted` | User submits any contact form (roaster suggestion, professional inquiry, etc.) | `src/app/(main)/(public)/contact/ContactForms.tsx` |
| `partner_form_submitted` | Roaster submits a partner/listing inquiry form | `src/app/(main)/roasters/partner/PartnerPageClient.tsx` |
| `partner_cta_clicked` | User clicks a CTA button on the partner page (get listed, claim spot, etc.) | `src/app/(main)/roasters/partner/PartnerPageClient.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/122076/dashboard/584074
- **New Sign-ups (Email + OAuth)**: https://eu.posthog.com/project/122076/insights/Lg0UsajE
- **Sign-up to Onboarding Funnel**: https://eu.posthog.com/project/122076/insights/VeGXJXTB
- **Reviews Submitted**: https://eu.posthog.com/project/122076/insights/4JGK77YO
- **Coffees Logged by Users**: https://eu.posthog.com/project/122076/insights/PUQXIo75
- **Partner & Contact Conversions**: https://eu.posthog.com/project/122076/insights/KfWAIT3c

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
 