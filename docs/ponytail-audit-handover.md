# `ponytail:` comment audit — findings + fixes

**Date:** 2026-09-17 (applied 2026-09-18) · **Status:** all steps applied. Steps 4 and 5 were
deferred in the first pass and picked up the same day.

## Context

`DEFAULT_LIMIT = 100` in `src/lib/filters/roaster-url.ts` carried a `ponytail:` comment whose
stated ceiling — "92 active roasters… revisit past ~200" — the data had quietly outgrown to
114. The roaster picker in `AddSelection.tsx` and the whole `/roasters` directory were
silently dropping 14 roasters. That prompted a sweep of all 18 `ponytail:` comments in the
repo, looking for the same failure mode: a deliberate shortcut whose stated precondition has
expired, failing silently.

All measurements below are against the live Supabase project `fnpsnzqedznsgzxjsowe`, taken
2026-09-17.

> **The finding that matters beyond this audit: PostgREST's `db-max-rows` on this project is
> 1000** (verified — requesting `limit=2000` on `coffees` returns exactly 1000 rows), **and
> the catalogue is now 1500 anon-visible coffees / 1959 rows in `coffee_directory_mv`.** Any
> unbounded select against coffees is being silently truncated today. Treat a missing
> `.range()` on a coffees query as a bug on sight.

## Audit results

| Location | Stated assumption | Verdict |
|---|---|---|
| `lib/filters/roaster-url.ts:5` | "92 active roasters… revisit past ~200" | **WAS EXPIRED — FIXED** (114 roasters, limit now 250) |
| `lib/data/fetch-roasters.ts:260` | *(no comment — same bug class)* | **WAS BROKEN — FIXED** — step 1 |
| `lib/analytics/index.ts:10` | *(no comment — found via the consent question)* | **BROKEN** — opt-out reaches GA + Clarity, never PostHog — step 4 |
| `app/(main)/curations/[slug]/page.tsx:50` | "add url if selection slugs are ever exposed" | **WAS EXPIRED — FIXED** — step 2 |
| `lib/data/fetch-chart-data.ts:24` | "paging, not SQL aggregation" | HOLDS — unbounded loop, stable order, no cap. Two latent gaps — step 3 |
| `components/ui/resizable-navbar.tsx:10` | motion/react kept off every page | HOLDS — no motion importer anywhere in the root/main layout tree |
| `migrations/20260717120000…sql:28` | "handle_new_user retries on unique_violation" | HOLDS — 5-attempt retry loop intact, no later migration overrides it |
| `migrations/20260815181330…sql:28` | "refreshed alongside coffee_directory_mv" | HOLDS — wired in `20260815181520`; the `20260816103000` rebuild does recreate the unique index `REFRESH CONCURRENTLY` needs |
| `lib/seo/coffee-faqs.ts:34` | "swap if get_coffee_detail ever exposes is_single_origin" | HOLDS — the RPC still doesn't expose it |
| `components/discovery/RegionDetailSection.tsx:144` | "not a single per-slug landscape exists" | HOLDS — `public/images/discovery/` still has only `region-landscape.png` |
| `components/discovery/LearnLinks.tsx:17` | "39 otherwise Supabase-only static pages" | HOLDS in substance; the count is now 42 |
| `coffee-name.ts` ×2, `StepList.tsx:19`, `MicrosoftClarity.tsx:53`, `TopRatedSection.tsx:37`, `FreshFromCommunitySkeleton.tsx:31`, `coffees/page.tsx:252` | judgment calls, no expiry condition | HOLD |

## Already shipped

`src/lib/filters/roaster-url.ts` — `DEFAULT_LIMIT` 100 → 250, exported; comment updated with
the new ~250 ceiling and the upgrade path. `src/components/profile/AddSelection.tsx` imports
that constant instead of hardcoding `limit: 100`.

Verified: `/api/roasters?sort=name_asc` returns `items: 114, total: 114, totalPages: 1` (was
100), and `/roasters` server HTML now contains the previously-missing tail (Videshi, Yagachi,
Zenforest, Zupreme). Every consumer routes through `parseRoasterSearchParams` /
`buildRoasterQueryString`, so the directory, the picker and the API were all fixed by the one
constant.

---

## Step 1 — APPLIED — P0: roaster `coffee_count` was truncated at 1000

`src/lib/data/fetch-roasters.ts:260-263`:

```ts
const { data: coffeeStats } = await supabase
  .from("coffees")
  .select("roaster_id, rating_avg, rating_count")
  .in("roaster_id", roasterIds);      // ← no .range(), capped at 1000 rows
```

Measured against the dev server after the limit bump:

- `/api/roasters?sort=name_asc` → 114 roasters, **summed `coffee_count` = exactly 1000**
  (true total ≈1500).
- **10 roasters report 0 coffees.** Spot-checked: *Vui Coffee Roasters* has **11** coffees,
  *Big Cup Coffee* has **1**. (Two of the ten genuinely have 0.)
- `.in()` returns rows in arbitrary order, so *which* roasters get zeroed shifts between
  queries — this is not a stable alphabetical tail.

Raising the roaster limit 100 → 250 made this worse: more roasters now split the same
truncated 1000 coffee rows. Fix it in the same change.

**This exact bug was already diagnosed and fixed once, in charts.** The docblock at
`fetch-chart-data.ts:14-21` says it outright: *"PostgREST caps an unbounded select at 1000
rows… that cap silently truncated every chart on the site."* The fix was applied locally
instead of shared, so `fetch-roasters` kept the bug. Root-cause fix = share the helper.

**Change:**

1. Move `fetchAllRows` (`fetch-chart-data.ts:29-50`) into a shared module —
   `src/lib/data/fetch-all-rows.ts` — and export it. Make the sort column a parameter
   (currently hardcoded `.order("coffee_id")`); `fetch-roasters` needs `id`. Carry the
   existing docblock across; it is the explanation of why the helper exists.
2. `fetch-chart-data.ts` imports it; its call site at :313 passes `"coffee_id"`.
3. `fetch-roasters.ts:260` routes the stats query through it, ordered by `id`.

At 250 roasters × ~2000 coffees that is 2 round trips instead of 1. No migration.

**As applied (2026-09-18):** `src/lib/data/fetch-all-rows.ts` now holds `PAGE_SIZE` and an
exported `fetchAllRows(buildQuery, label, orderColumn)`; `fetch-chart-data.ts` and
`fetch-roasters.ts` both import it. Two notes for whoever reads this next:

- The helper `throw`s on error; the old stats call ignored `error` entirely, so a failed
  stats query now fails the roaster list instead of quietly rendering every count as 0.
- `coffee_count` semantics are unchanged — every `coffees` row the client can see, with no
  `is_coffee` / `status` filter, matching the `coffee_count` inside `get_roaster_detail`
  (`20260816140000…sql:101`). Note `fetchRoasters` uses the **service-role** client when
  `SUPABASE_SECRET_KEY` is set (:222-226), so it counts all 1989 rows, not the 1500
  anon-visible ones. Pre-existing, unrelated to the truncation.

Verified: summed `coffee_count` went 1000 → **1989**, roasters reporting 0 went 10 → 3
(those three genuinely have none), Vui Coffee Roasters 0 → 14, Big Cup Coffee 0 → 1.

## Step 2 — APPLIED — expired comment: curations `ListItem` can carry a URL

`src/app/(main)/curations/[slug]/page.tsx:46-57` says selections carry no slug. They do:
`CurationSelectionDTO` has `coffeeSlug` / `roasterSlug` (`src/data/curations.ts:49-59`,
populated at :344-345), and `CurationAccordion.tsx:149-157` already builds hrefs from them.

Added `url` to each `ListItem` when both slugs are present, reusing `coffeeDetailHref`
(`src/lib/utils/coffee-url.ts`) with the `baseUrl` already in scope; comment corrected. Still
a plain `ListItem`, not a `Product` — the `offers` half of the original reasoning holds.

**Separate bug found while verifying — curation links drop on discontinued coffees.** On
`/curations/coffee-lab` only 2 of 8 selections emit a `url`. Not a data gap: all 8
`curation_selections` rows carry a valid `coffee_id` and all 8 coffees exist with slugs. Six
of them are `status = 'discontinued'`, which anon RLS hides, so the `coffees(slug)` /
`roasters(slug)` embeds in the selections query (`src/data/curations.ts:249`, run through the
RLS-bound `createClient()` at :191) come back null and both the visible card link
(`CurationAccordion.tsx:149`) and the JSON-LD `url` silently disappear.

Those pages are live and indexable — `get_coffee_detail` is SECURITY DEFINER and filters only
`is_coffee IS NOT FALSE`, never `status`, so e.g.
`/roasters/coffeeverse/coffees/blossom-washed` returns 200 with `robots: index, follow`. The
curation is the only surface refusing to link to them.

**Fixed 2026-09-18.** `src/data/curations.ts` now resolves coffee slugs by `coffee_id` through
the existing `imageSupabase` client (`process.env.SUPABASE_SECRET_KEY ? createServiceRoleClient()
: supabase`, :266-268 — already there for images of coffees the anon client cannot see). The
embed stays as the fallback when no secret key is configured. Roaster slugs still come from the
embed: all three curated roasters are active, so it resolves; the `ponytail:` note records that
an inactive roaster (3 exist) would need the same treatment.

Verified: `/curations/coffee-lab` went 2/8 → **8/8** on both the JSON-LD `url` and the card
links, and all six newly-linked pages return 200.

## Step 3 — APPLIED — harden chart paging

Both in `src/lib/data/fetch-chart-data.ts`:

1. **The roasters branch at :157-160** is an unbounded `.from("roasters").select(column)` —
   the same unpaged shape as step 1. Safe at 114 roasters, silently wrong past 1000. Route it
   through the shared helper (ordered by `id`) while the helper is being extracted.
2. **The loop's termination test** (`if (data.length < PAGE_SIZE) break`) assumes the server
   cap is exactly `PAGE_SIZE = 1000`. It is today — verified — but if `db-max-rows` is ever
   lowered, every page comes back short and the loop stops after page 1, reintroducing the
   original bug invisibly. The `ponytail:` line recording that `PAGE_SIZE` must stay ≤ the
   server's `db-max-rows` (currently 1000) now lives in `fetch-all-rows.ts`.

## Step 4 — APPLIED — P1: the analytics opt-out never reached PostHog

**What exists and works:** `CookieSettingsButton` in the footer
(`src/components/layout/Footer.tsx:342`) opens `CookieSettings.tsx`, which persists via
`savePreferences` (`src/hooks/use-cookie-consent.ts:43-50`) → `updateAnalyticsConsent`
(`src/lib/analytics/index.ts:10-22`) → gtag `consent update` + `window.clarity("consent", …)`.
The root layout's inline script (`src/app/layout.tsx:181-203`) re-applies the stored choice to
GA before it loads. Clarity re-applies it at init (`MicrosoftClarity.tsx:59`). The model is
opt-out, analytics pre-granted; `ad_storage` is always denied.

**The defect:** `updateAnalyticsConsent` never touches PostHog, and there is no
`opt_out_capturing_by_default`, `posthog.opt_out_capturing()`, or any consent read anywhere in
`src` (grepped `opt_out|opt_in|optOut|has_opted` — zero hits). `instrumentation-client.ts`
fires `loadPostHog()` on idle on every page load regardless. A user who switches analytics off
in the footer keeps being tracked by PostHog, which sets its own cookie and autocaptures. The
UI asserts something it doesn't do.

**Change (keeps the opt-out model as-is — this is a wiring fix, not a policy change):**

1. `src/lib/analytics/index.ts:10-22` — add PostHog alongside the existing gtag and Clarity
   calls. Mirror the Clarity guard style already there: PostHog may not be loaded when consent
   changes, so go through the existing lazy `loadPostHog()` promise (`src/lib/posthog.ts:16`)
   rather than assuming a global, and call `opt_out_capturing()` / `opt_in_capturing()`.
2. `src/lib/posthog.ts` — in `loadPostHog`, check `getStoredPreferences().analytics` after
   `init` and opt out immediately if false, so a stored opt-out survives a reload. Reuse
   `getStoredPreferences` from `@/hooks/use-cookie-consent` — the same import
   `MicrosoftClarity.tsx:5` already uses. Don't duplicate the localStorage read.

**Not changing here:** the opt-out default, the banner, or `disable_session_recording`.

**As applied (2026-09-18):** `loadPostHog()` passes `opt_out_capturing_by_default` from
`getStoredPreferences().analytics` at init, so a stored refusal is in force before the first
event and survives reloads. `updateAnalyticsConsent` reaches a *running* instance through a new
`loadedPostHog()` accessor, dynamically imported — pulling ~330KB in order to switch capture
off would be the one case where loading is the wrong move, and a visitor who never fires an
event is already covered by the init-time read. The dynamic import also keeps the module graph
acyclic (`posthog.ts` → `use-cookie-consent` → `analytics`).

Note there is no longer an idle bootstrap — `instrumentation-client.ts` is gone, so posthog-js
loads only on the first `capture()` / `identifyUser()` / `captureException()`.

## Step 5 — APPLIED — cookie notice re-enabled

The `{false && <CookieNotice />}` gate at `src/app/(main)/layout.tsx:58` is gone; the banner
renders again. Both preconditions below were met first. Recorded so nobody has to re-derive it:

**The component already behaves as intended.** `CookieNotice.tsx:40-52`:

```ts
const hasConsent = localStorage.getItem(STORAGE_KEY) !== null;
if (hasConsent) { setPreferences(getStoredPreferences()); setVisible(false); }
else { setVisible(true); }
```

It shows only to users who haven't consented yet. The gate does **not** implement that — it
hides the banner for *everyone*, consented or not, so nobody is ever asked and nothing is ever
stored. Whenever it's re-enabled the change is one line; no component work is needed.

It was switched off in commit `76604ed` (2026-09-06), *"Removed the CookieNotice component
from the main layout to streamline the user interface"* — a performance/UI decision, left as
`{false && …}` plus an unused import rather than deleted.

**Both preconditions were met in the same change:**

1. **Step 4 landed first.** A banner that says unticking Analytics stops tracking has to be
   telling the truth; PostHog is now wired into `updateAnalyticsConsent`.
2. **The `NotFoundError` note in `src/lib/posthog.ts` was reworded.** It had ruled out the
   CookieNotice portal-race theory on the grounds that the component never renders. It renders
   again, so the theory is back on the list of live candidates and the comment now says so.

**Model unchanged:** still opt-out — analytics is pre-granted, the banner is a notice with a
manage option, and `ad_storage` stays denied. Re-enabling restores the ask; it does not
change what runs by default.

**Still open:** the LCP question below is untested against the re-enabled banner. Worth a
Vitals check on hero-less routes after this ships.

**Open LCP question** — likely the real motive for `76604ed`. `CookieNotice.tsx:55-60` records
that on hero-less pages the banner can become the LCP element and that the idle defer does not
fix it: *"the real fix… is giving those pages real above-fold content"*. Identify which routes
are hero-less before re-enabling, so a regression is distinguishable from a pre-existing
problem. See also `docs/cwv-lcp-unused-js-plan.md`.

### DB consent: checked — it exists, but not for cookies

Introspected the live schema (all 68 exposed tables/views, via the PostgREST OpenAPI spec).
**No consent, cookie, tracking, privacy, opt-in/opt-out or GDPR column exists anywhere** — the
only regex hit is `firecrawl_usage_tracking`, which is scraper telemetry.

The DB consent that *does* exist is **email/marketing, not analytics**:

- `user_notification_preferences` — `newsletter`, `coffee_updates`, `new_roasters`,
  `platform_updates`, `email_frequency`, with an `upsert_notification_preferences` RPC and a
  dashboard form (`NotificationsFormClient.tsx`).
- `user_profiles.newsletter_subscribed` — a denormalised mirror of the newsletter flag, kept
  in sync deliberately at `src/app/actions/profile.ts:574`.

These govern whether you may email someone. They say nothing about whether GA, Clarity or
PostHog may run. **Cookie/analytics consent is localStorage-only**, so a logged-in user who
consents on a laptop is asked again on their phone, and clearing site data re-asks. If
server-side cookie consent is wanted later, `user_notification_preferences` +
`upsert_notification_preferences` is the pattern to copy.

### Known disclosure gaps (not code — flagged for review)

Noted while tracing consent, unresolved, and **not legal advice** — worth a lawyer's eye if
the opt-out posture is ever questioned:

- `(public)/privacy/page.tsx:192-198` tells users the cookie tools let them disable
  "analytics… cookies at any time". That is not true for PostHog today (step 4 fixes it).
- The policy never names Google Analytics, Microsoft Clarity or PostHog as processors.
- `(public)/privacy/page.tsx:344` describes third-party **ad targeting cookies**; the repo has
  no ad network and `ad_storage` is always denied.
- There is no geo detection anywhere, so EU/UK visitors get the same opt-out-by-default
  treatment as Indian ones. Clarity is session replay, initialised bare
  (`Clarity.init(projectId)` with no options), so masking depends entirely on dashboard
  settings not visible from this repo.

## Step 6 — APPLIED — delete dead code

`src/components/ui/animated-list.tsx` and `src/components/ui/parallax-scroll.tsx` — **zero
importers** (verified by grep across `src`), and both import `motion/react`, the dependency
`resizable-navbar` was deliberately stripped of.

`CookieNotice.tsx` is explicitly **not** in this list — it's dormant, not dead, and step 5
expects it back. It and `CookieSettings.tsx` do duplicate each other's panel markup; worth
collapsing when the banner decision is settled, not before.

## Step 7 — APPLIED — comment accuracy (no behaviour change)

- `fetch-chart-data.ts:114` claims "is_single_origin lives on the base coffees table (not the
  MV)". **It is on the MV** (`20260718092346…sql:141`, plus an index at :213). The RPCs are
  still the right call for aggregation — fix the stated reason, keep the code.
- `LearnLinks.tsx:19` — "39" → 42 landing pages (9 brew + 7 bean-type + 4 price + 5 process +
  5 roast + 12 region).
- `20260815181330_roaster_similarity.sql:28` — "96 roasters x ~1250 coffees" → 114 × ~1959.
  Still far inside the stated ~5000 ceiling; just refresh the numbers.
- `coffee-faqs.ts:34` — holds, but worth noting that `is_single_origin` now exists on both
  `coffees` and `coffee_directory_mv`, so the upgrade is one line in the `get_coffee_detail`
  RPC whenever someone wants it.

## Verification

1. `npm run type-check` && `npm run lint`.
2. `npm run dev`, then fetch `/api/roasters?sort=name_asc` and assert:
   - `items.length === 114`, `total === 114`
   - **summed `coffee_count` > 1000** (expect ≈1500, no longer pinned at exactly 1000)
   - `Vui Coffee Roasters` reports **11**, not 0; `Big Cup Coffee` reports **1**, not 0
3. Load a `/learn` article with a chart backed by a roaster dataKey
   (`roaster_sourcing_model` / `founded_year`) and confirm it still renders.
4. Load a `/curations/[slug]` page, view source, confirm the JSON-LD `ListItem` entries carry
   `url` and the page still renders.
5. **Consent:** footer → "Cookie Settings" → toggle Analytics off → Save. In the console:
   - `localStorage.getItem("icb-cookie-consent")` shows `"analytics":false`
   - `window.posthog.has_opted_out_capturing()` → `true` (new behaviour; returns `false`
     today), and still `true` after a hard reload
   - toggling back on returns it to `false` and capture resumes
6. `npm run build` — catches the deleted UI files if anything references them dynamically.
