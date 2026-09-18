# Attribution durability + marketing consent category — handover

**Date:** 2026-09-18 · **Status:** both implemented on `dev` (see below) · **Source:** `icb-claude`
`seo/site-recommendations/backlog.md` items `[paid-attribution-durable]` and
`[consent-marketing-category]`, raised in the paid-ads Part 0 review 2026-09-12
(`docs/paid-ads-playbook-icb.md` §0.2 B1/B2 in the icb-claude repo).

Originally verified against this checkout on 2026-09-18 (`dev`, clean tree) and against
`main`, `origin/main`, `origin/dev`: neither fix existed on any branch. **Both have since
been implemented on `dev`** — attribution now persists to a 90-day cookie and onto
`user_profiles.attribution` at signup, and consent carries a distinct opt-in `marketing`
category. What shipped, and where it diverged from the sketch below, is recorded in
"What shipped" at the end of this document. The diagnosis in §1 and §2 is kept as written
for the record; read it as the problem statement, not as the current state of the code.

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

---

## What shipped (2026-09-18, `dev`)

Both items landed together, plus one surface the handover did not cover.

**1. Attribution durability**
- `icb_attribution` moved to a 90-day cookie, reusing `setCookie`/`getCookie` from
  `src/lib/reviews/anon-id.ts` (now exported) rather than new helpers. The JSON value is
  URL-encoded; a raw comma would truncate the cookie.
- `src/lib/analytics/persist-attribution.ts` writes it onto `user_profiles.attribution`
  (new `jsonb` column, migration `20260918120000`) guarded on `is null` so the first touch
  is never overwritten, and sets PostHog person properties (`$set_once` first-touch,
  `$set` last-touch) through the existing `captureServerEvent`.
- Called from **two** signup paths, not one: `/auth/callback` *and* `saveOnboardingData`.
  The handover assumed the OAuth callback was the natural hook; it is, but email+password
  signup goes straight from `auth-form.tsx` to `/auth/onboarding` and never reaches that
  route, so the callback alone would have attributed only OAuth users.
- Consent is gated at the source: `storeAttributionData` writes nothing without analytics
  consent, and `updateAnalyticsConsent(false)` **deletes** an existing cookie — otherwise
  the 90-day cookie outlives the toggle and is still readable server-side at signup.

**2. Marketing consent category**
- `CookiePreferences` gains `marketing`, defaulting to `false`. A `v: 2` stamp is what
  distinguishes a new stored value from a pre-v2 one, so an existing preference reads as
  `marketing: false` while keeping its analytics answer and without a re-prompt.
- A pre-v2 value whose only answer was the old `marketing` flag still counts as an
  *analytics* refusal. That fallback now lives in exactly one place.
- Third toggle in `CookieNotice` and `CookieSettings`; `ad_storage` / `ad_user_data` /
  `ad_personalization` denied by default in the `layout.tsx` consent-init and granted only
  on a v2 grant.

**3. Dashboard consent controls** (not in the handover)
- The only post-banner way to change consent was the footer button. `/dashboard/privacy`
  now carries a "Cookies & Tracking" card, with copy noting the setting is per-browser —
  consent lives in `localStorage`, not on the profile row.

**Notes for whoever picks this up next**
- `src/lib/consent.ts` is the single source of truth for parsing and storing consent. It is
  deliberately dependency-free: the hook needs side-effects from `@/lib/analytics` and
  `@/lib/analytics` needs to read consent, so the parse cannot live in either.
- The one reader that cannot import it is the `beforeInteractive` script in
  `app/layout.tsx`, which is a stringified inline script. Its conditions must be kept in
  step with `parsePreferences` by hand.
- `scripts/check-consent-attribution.mts` (`npx tsx`) covers the legal-consequence paths:
  legacy refusals, v2 normalisation, first-touch retention, revoke-clears-cookie, and the
  attribution schema.
- Still unverified by hand: the `dataLayer` consent signals and the rendered toggles — no
  browser was reachable in the session that built this.
