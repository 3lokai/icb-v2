# PostHog error triage — 2026-06-13

Triage of `$exception` events from the live site (IndianCoffeeBeans.com), with each fix routed to a
target file in the site repo `icb-v2`. Companion to [posthog-implementation.md](posthog-implementation.md).

**This repo is the AI-ops workspace, not the site source.** Every fix below is tagged `site-repo` —
apply it in `/home/gt/Projects/ICB/icb-v2/`, then verify in PostHog. Nothing here edits `icb-v2`.

---

## Summary

| Item | Detail |
|------|--------|
| **Source** | PostHog EU, project `122076`. The site inits with `capture_exceptions: true`, so all client errors arrive as `$exception`. |
| **Pulled via** | HogQL (read-only) using `POSTHOG_API_KEY` in `.env` — see [Re-pull](#re-pull). |
| **All-time in retention** | 388 `$exception` events. |
| **Last 30 days** | **101 events across 36 issues**, ~1–10/day. |
| **Split** | Real, actionable site bugs ≈ **37 events** (#418 hydration + ChunkLoadError). Non-actionable noise (extensions, dev/localhost, transient network, benign warnings) ≈ **35 events**. `Script error.` (28 events) is cross-origin masked — partly real, partly extension noise. |

**Headline:** the dashboard reads as "multiple errors," but a large share is not site bugs. The
single highest-leverage change is **R1 — add a `before_send` noise filter**, which removes ~35%+ of
volume immediately. The genuine bugs are **React #418 hydration mismatches** and **post-deploy
ChunkLoadErrors**.

---

## Error list (last 30 days, grouped by issue)

### Real, actionable site bugs

| Error | Events / Users | Where (sample) | Root cause |
|-------|----------------|----------------|------------|
| **Minified React error #418** (hydration: text content mismatch) | ~26 ev / many | `/`, `/communities`, `#top-rated`, `translate.goog` proxy | `.toLocaleString()` with no explicit locale → server (en-IN) vs browser locale render differently |
| **ChunkLoadError** — "Failed to load chunk … from module" | ~11 ev / multiple | `/`, `/learn/*`, `#top-rated` | Stale chunk hashes after a deploy; old clients request files that no longer exist |
| **`Script error.`** (cross-origin, detail masked) | 28 ev / 8 users | `/learn/coffee-regions-of-india-complete-guide` + others | CORS-masked, no stack. Source maps + `crossOrigin` needed to unmask; a share is likely extension noise |
| **`Cannot read properties of null (reading 'parentNode')`** | 1 ev | `/` | Possible real DOM-timing bug; too low-volume to prioritize, watch after R1 de-noises |

### Noise to suppress (not our bugs)

| Error | ~Events | Source |
|-------|---------|--------|
| `window.__firefox__.reader`, `…refresh_youtube_quality…`, `Can't find variable: __firefox__` | ~18 | Firefox reader-mode / browser extensions (most cluster on 2026-05-18 — one synthetic session) |
| `window.ethereum.selectedAddress = undefined` | ~3 | Crypto-wallet extension injection |
| Events with `$current_url` on `http://localhost:3001` / `:3002` — `Module not found 'next/font/google/target.css'`, Suspense boundary, devtools chunk, `AbortError`, `Non-Error promise rejection` | ~8 | Dev sessions leaking into the **prod** project |
| `Load failed` / `Failed to fetch` / `network error` / `Connection closed.` | ~5 | Transient user-side network / aborted fetches |
| `ResizeObserver loop completed with undelivered notifications.` | 1 | Benign browser layout warning |

---

## Fixes (all `site-repo` → apply in `icb-v2`)

### R1 — Suppress noise via `before_send` · HIGH · quick win

`icb-v2/instrumentation-client.ts` — `posthog.init` (init block ~lines 3–16) currently has **no**
`before_send` hook, so extension, dev/localhost, and benign-warning errors all reach the prod project.
Add a `before_send` that returns `null` to drop an event when any of these hold:

- `window.location.hostname` is `localhost` / `127.0.0.1` (or `NODE_ENV !== "production"`).
- the exception message or stack matches an extension marker: `__firefox__`, `window.ethereum`,
  `chrome-extension://`, `moz-extension://`.
- the message is `ResizeObserver loop completed with undelivered notifications.` or a bare
  `Script error.` with no stack.

Sketch (read the actual `$exception` payload shape — message lives in
`properties.$exception_list[0].value`, type in `[0].type`):

```ts
posthog.init(token, {
  // …existing config…
  before_send: (event) => {
    if (event?.event !== "$exception") return event;
    if (process.env.NODE_ENV !== "production") return null;
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    if (host === "localhost" || host === "127.0.0.1") return null;
    const blob = JSON.stringify(event.properties?.$exception_list ?? "");
    const NOISE = ["__firefox__", "window.ethereum", "chrome-extension://",
      "moz-extension://", "ResizeObserver loop completed"];
    if (NOISE.some((m) => blob.includes(m))) return null;
    return event;
  },
});
```

**Verify:** after deploy, the extension/localhost/ResizeObserver issues stop appearing on new dates
in PostHog; 30-day volume drops by roughly a third.

### R2 — Fix React #418 hydration mismatches · MEDIUM · real UX bug

Force an explicit locale on user-facing number/date formatting so server and client agree. Reuse the
pattern already used correctly in `icb-v2/src/lib/utils/coffee-utils.ts:10`
(`new Intl.NumberFormat("en-IN", …)`) and `src/lib/utils/community-review-label.ts:7` — don't invent
new formatting.

Primary suspects:
- `icb-v2/src/components/homepage/hero/HeroContextPanel.tsx:170,174` —
  `totals.coffees.toLocaleString()` / `totals.roasters.toLocaleString()` → add `"en-IN"`.
- `src/components/cards/CommunityCard.tsx:53` (`num.toLocaleString()`) and the communities tree
  (`src/components/communities/CommunityGrid.tsx`).
- `src/components/layout/Footer.tsx:14` — `new Date().getFullYear()` rendered server-side; add
  `suppressHydrationWarning` to that element.

Other `.toLocaleString()` without a locale to sweep once the above land: `InsightsCharts.tsx:130`,
`ReviewCapture.tsx:783`, `CoffeeFilterSidebar.tsx:497`, `CoffeeFacetedFilterBar.tsx:502`.

**Verify:** new `#418` events stop arriving from `/` and `/communities`. (Events from the
`translate.goog` proxy domain may persist — that's Google Translate rewriting text, not a site bug.)

### R3 — Make ChunkLoadError observable + confirm recovery · MEDIUM

A handler already exists: `icb-v2/src/components/common/ChunkErrorHandler.tsx` (exponential backoff,
3 reloads, 5-min cooldown, emits `icb:chunk-reload-exhausted`). Gap: it sends **no PostHog signal**,
so deploy-related breakage is invisible in analytics. Add a `posthog.capture("chunk_load_error", …)`
on a caught chunk error and on retry-exhaustion (~lines 101–108) with the failed chunk path and
attempt count.

Optional: set `productionBrowserSourceMaps: true` in `next.config.ts` only if deeper stacks are
needed (adds ~10–20% to the browser bundle).

**Verify:** `chunk_load_error` events appear in PostHog and correlate with deploy times; confirm the
auto-reload recovers (no user-visible white screen).

### R4 — Capture boundary errors to PostHog · HIGH · observability

`icb-v2/src/app/error.tsx:17–20` only `console.error`s — errors that hit the App Router boundary are
never reported. Add `posthog.captureException(error)` (or `posthog.capture("$exception", …)`)
alongside the existing `console.error`. There is **no** `src/app/global-error.tsx`; add one that does
the same so root-level (layout) crashes are also captured.

**Verify:** trigger a deliberate throw in a route; confirm a `$exception` lands in PostHog with the
digest.

### R5 — Unmask `Script error.` · LOW

All first-party scripts are same-origin or proxied (GA via `@next/third-parties`, PostHog via the
`/ingest` rewrite, Vercel Speed Insights), so the 28 `Script error.` events are cross-origin masked
with no stack. The only ways to get detail are enabling source maps (R3) and adding
`crossOrigin="anonymous"` to any future external `<script>`. Expect R1 to absorb a portion of these
as extension noise; revisit only if volume stays high after R1.

---

## Re-pull

Regenerate the list anytime (read-only, no writes):

```bash
node content/scripts/posthog-errors.mjs 30   # lookback days, default 30
```

Uses `POSTHOG_API_KEY` from `.env` (or `content/.env`), project `122076`, host `https://eu.posthog.com`
— same auth as [posthog-query-smoke.mjs](../content/scripts/posthog-query-smoke.mjs). Prints the
grouped issue list (type, message, events, distinct users, last-seen, sample URL) plus daily counts.
The underlying HogQL groups by `properties.$exception_issue_id` and reads
`any(properties.$exception_types / $exception_values)` — extracting from `$exception_list` directly
fails on the EU engine (`illegal_type_of_argument`, Array inside Nullable).
