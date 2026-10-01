# ADR-012: Cookie Consent Model and First-Touch Attribution

**Date:** 2026-09-18  
**Status:** Accepted  
**Participants:** Project Lead

## Context
The analytics opt-out never reached PostHog, the cookie banner was switched off for everyone,
UTM attribution lived only in `sessionStorage`, and ad tags had no consent category to fire
under. Full records: [`completed/ponytail-audit-handover.md`](../completed/ponytail-audit-handover.md)
(steps 4–5) and [`completed/attribution-consent-handover.md`](../completed/attribution-consent-handover.md).

## Decision
**Consent model**
- **Analytics: opt-out** (pre-granted). The banner is a notice with a manage option. GA, Clarity
  **and PostHog** all honour the toggle; PostHog reads the stored choice at init
  (`opt_out_capturing_by_default`).
- **Marketing: opt-in**, default `false`. `ad_storage` / `ad_user_data` / `ad_personalization`
  are denied until a v2 grant.
- `src/lib/consent.ts` is the **single source of truth** for parsing and storing consent. It
  stays dependency-free to avoid an import cycle with `@/lib/analytics`.
- The `beforeInteractive` inline script in `app/layout.tsx` can't import it, so its conditions
  are kept in step with `parsePreferences` **by hand**.
- Consent is **localStorage-only**, per browser. If server-side consent is ever wanted, copy the
  `user_notification_preferences` + `upsert_notification_preferences` pattern.

**Attribution**
- `icb_attribution` is a 90-day cookie, written only with analytics consent and **deleted** when
  analytics is revoked.
- Persisted to `user_profiles.attribution` at signup, first touch only (`is null` guard), from
  **both** `/auth/callback` (OAuth) and `saveOnboardingData` (email + password).

## Consequences
- `scripts/check-consent-attribution.mts` (`npx tsx`) guards the legal-consequence paths. Run it
  after touching consent or attribution.
- EU/UK visitors get the same opt-out default as Indian ones (no geo detection). The privacy
  policy doesn't name the analytics processors. Both are flagged for legal review, not fixed.

## Addendum (2026-09-26): ad tags
- **Google Ads** (`NEXT_PUBLIC_GOOGLE_ADS_ID`) is a `gtag("config")` on the GA4 gtag, gated by the ad_* consent signals.
- **Meta Pixel** (`NEXT_PUBLIC_META_PIXEL_ID`, `components/analytics/MetaPixel.tsx`) ignores Consent Mode, so `fbevents.js` is not requested at all without `marketing`; `updateMarketingConsent` sends `fbq("consent", "revoke")`.
- `hasStoredConsent()` now counts only a v2 answer, so pre-v2 visitors are re-asked once (their analytics answer is kept). Signed-in users with marketing off get a one-time dashboard ask (`MarketingConsentPrompt`).
- Email-list uploads (Meta Custom Audiences / Google Customer Match) are **not** built: they need a separate, server-side opt-in, since cookie consent is per-browser.
