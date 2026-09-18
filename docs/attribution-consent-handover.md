# Attribution durability + marketing consent category — handover

**Date:** 2026-09-18 · **Status:** both open, neither started · **Source:** `icb-claude`
`seo/site-recommendations/backlog.md` items `[paid-attribution-durable]` and
`[consent-marketing-category]`, raised in the paid-ads Part 0 review 2026-09-12
(`docs/paid-ads-playbook-icb.md` §0.2 B1/B2 in the icb-claude repo).

Verified against this checkout on 2026-09-18: `dev`, clean tree — and against `main`,
`origin/main`, `origin/dev`. Neither fix exists on any branch.

Both live in this repo, which is why they're written up here rather than in the icb-claude
backlog: that file diagnoses, this repo applies.

---

## 1. UTM attribution is sessionStorage-only, and nothing reads it

**Priority:** High · **Blocks:** paid ads, and already costs organic/AI-referral attribution today.

### What the code does now

`storeAttributionData` (`src/lib/analytics/index.ts:137`) writes `icb_attribution` —
`original_source` / `original_campaign` / `original_content`, `touchpoints`,
`first_visit_time`, `last_visit_time`, `session_quality_score` — to **`sessionStorage`**
(`:164` for a new attribution, `:178` for an update). `icb_page_count` at `:151` is the same.

Two consequences, both live:

1. **It dies with the tab.** `sessionStorage` is per-tab and cleared on close. A visitor who
   arrives from a campaign on Monday and signs up on Tuesday is recorded as unattributed —
   and the rating → gate → signup funnel is cross-session *by design*.
2. **Nothing reads it.** The only consumer of `icb_attribution` anywhere in `src/` is
   `getStoredAttribution` (`:120`), which exists to feed `storeAttributionData` itself. It is
   never sent to GA, PostHog, Supabase, or any server action. The sole caller of the whole
   mechanism is `Analytics()` in `src/components/analytics/GoogleAnalytics.tsx:28`, on route
   change. So even within a single session the data is write-only.

### Fix

- **Storage:** move `icb_attribution` from `sessionStorage` to a 90-day cookie or
  `localStorage`. Keep the existing first-touch semantics (`original_*` is only set when it's
  empty — `:157`) and keep appending last-touch (`last_visit_time` / `touchpoints` — `:169-175`).
  A cookie is the better default if the value ever needs to be read server-side at signup;
  `localStorage` is fine if the persist happens from the client.
- **Signup persist:** write the attribution onto the `user_profiles` row at signup. The OAuth
  return path (`src/app/auth/callback/route.ts`) is the natural hook — it already runs
  server-side per new user and already does server-side PostHog capture.
- **PostHog:** set the attribution as **person properties** (not event properties) so cohorts
  can filter by acquisition source. `$set_once` for the `original_*` first-touch fields,
  `$set` for `touchpoints` / `last_visit_time`.
- **Consent:** this is analytics-category data. Gate the PostHog person-property write behind
  the existing analytics consent the same way `updateAnalyticsConsent`
  (`src/lib/analytics/index.ts:10`) gates the rest.

### Verify

Click a UTM-tagged link → close the tab → return the next day → sign up. The `user_profiles`
row carries the campaign, and the PostHog person shows the acquisition source.

---

## 2. Consent has no marketing category, so ad tags have no lawful basis to fire

**Priority:** High, but **harmless until the first ad tag ships** — nothing today is
mis-categorised, because there is no ad tech on the site yet. This is a decide-before-you-collect
item, not a live defect.

### What the code does now

`CookiePreferences` (`src/hooks/use-cookie-consent.ts:5-8`) is exactly two flags:

```ts
export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
};
```

Default is **opt-out** — an absent or unparseable stored value returns
`{ necessary: true, analytics: true }` (`:12`, `:17`, `:39`). An older `marketing` category
was explicitly folded *into* `analytics` by the migration branch at `:21-31`:

```ts
// Handle migration from old format that included marketing
if (parsed.marketing !== undefined) {
  // If old format exists, treat marketing as analytics
```

`savePreferences` (`:43-50`) persists to `localStorage` under `icb-cookie-consent` and fans the
single `analytics` boolean out to GA, Clarity and PostHog via `updateAnalyticsConsent`.

That shape is defensible for PostHog / GA / Clarity. It is the wrong shape for a Meta Pixel or
a Google Ads tag: loading ad tech under an opt-**out** "analytics" toggle is precisely the
pattern DPDP Act consent enforcement targets, and a hashed-email export for Customer Match
would inherit the same defective basis. A legal basis cannot be retrofitted to an
already-collected list, which is why this lands before the first ad tag, not after.

### Fix

- Restore a distinct `marketing` category on `CookiePreferences`, defaulting to **`false`**
  (opt-**in**) — deliberately unlike `analytics`, which stays opt-out and otherwise unchanged.
- The `:21-31` migration branch has to stop reading an old `marketing` value as consent for
  the new one. A pre-existing stored preference carries no marketing consent; it must read as
  `marketing: false` until the user actively grants it.
- Surface the third toggle in `CookieSettings.tsx` (opened by `CookieSettingsButton`,
  `src/components/layout/Footer.tsx:342`) and in `CookieNotice.tsx`.
- Gate every future ad tag — and any hashed-email export — on `marketing`, never on `analytics`.

### Verify

Decline marketing → no request to `connect.facebook.net` or `googleads.g.doubleclick.net`.
Accept → both fire. Analytics consent behaviour identical either way, and an existing visitor
with a stored preference starts at `marketing: false` without being re-prompted for analytics.

---

## Related, already shipped

`22f66b4` (2026-09-18) re-enabled `<CookieNotice />` in `src/app/(main)/layout.tsx` — it had
been rendering as `{false && <CookieNotice />}` since `76604ed` (2026-09-06) — and wired the
analytics opt-out through to PostHog, which `updateAnalyticsConsent` had previously skipped.
That closed the *analytics* consent gap. Neither item above was part of it.
