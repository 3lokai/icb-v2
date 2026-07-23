# Cleanup & Refactor — Context Docs

Pre-launch effort to shrink the codebase surface: remove dead code, reduce
client JS, and break up the worst complexity/edit-hazard hotspots. Driven by
`fallow` (the installed analyzer — `npm run fallow`), cross-checked by hand.

**Two goals, stated by the owner:**
1. **Edit safety** — you, me, or any other editor should be able to change code
   without tripping over hidden coupling or 1000-line files.
2. **Less client JS** — reduce what ships to and hydrates in the browser.

Each doc below is self-contained: pick one up in a fresh session without
needing the others.

## Done (for reference, not re-doing)

- **Dead code:** fallow dead-code 125 → 37 (remaining 37 are intentional keeps:
  7 shadcn `ui/` kit files + ~28 exported-type contracts + 1 server action).
  health 64.6 (C) → 71.5 (B). Deleted `user-coffees`, dead curations wrappers,
  dead barrels, regions cluster, `ReviewCapture` (953 LOC unwired), etc.
- **Dashboard dedup:** shared `use-settings-form` hook + `DashboardPageHeader`.
  duplication 10.45% → 10.06%.
- **`"use client"` audit:** dropped the directive from 23 mislabeled
  presentational components (now render server-side, ship no client JS).
- **PostHog deferral:** was static-imported into the shared first-load bundle on
  every route; now lazy-loaded on `requestIdleCallback`. **First Load JS 602 →
  403 KB gzip (−199 KB / −33%) on every route.** See `posthog-implementation.md`.
- **recharts dynamic-import:** was static in all 3 chart modules
  (`UsageCharts`, blog `DataChart`, `InsightsCharts`). Now `next/dynamic`;
  biggest win is the blog — `ArticleContent` renders on every article, so
  recharts used to ship on all of them; now only on articles that embed a
  `dataChart` block (verified: a normal article ships 0 recharts scripts).
  Insights kept `ssr:true` (its charts + callout text are SEO content).

## Pending — one doc each

| Doc | Type | Payoff |
|-----|------|--------|
| [`js-phosphor-icons.md`](js-phosphor-icons.md) | client JS | Largest remaining lib (~711 KB app-wide, per-route-split). Mostly already tree-shaken — read before assuming a win exists. |
| [`refactor-coffee-filters.md`](refactor-coffee-filters.md) | edit safety | 1023 + 684 LOC filter components; the largest interactive client bundle. |
| [`refactor-quickrating.md`](refactor-quickrating.md) | edit safety | 762 LOC, cognitive 108, 8+ useState / 6+ useEffect. Highest complexity score. |
| [`refactor-seo-schema.md`](refactor-seo-schema.md) | edit safety | 676 LOC, fan-in 27 (many callers → risky to touch). |
| [`refactor-auth-callback.md`](refactor-auth-callback.md) | edit safety | 341 LOC, cognitive 112. Auth-critical — most careful. |

## Ground rules for every change

- **Trace before delete:** `npm run fallow -- dead-code --trace <file>:<export>`.
- **Verify after every change:** `npm run type-check` (the test equivalent here)
  and `npm run lint` (`--max-warnings=0`). For JS-reduction work, a full
  `npm run build` too.
- **Refactors are behavior-preserving.** Extraction that just scatters cognitive
  load across 5 files nobody reads is not a win — only split where the seams are
  real. If a split doesn't make the next edit safer, skip it.
- **Measuring client JS:** Turbopack build has no First-Load-JS table. Method:
  `npm run build`, `PORT=<free> npm start`, then for each route sum the gzipped
  sizes of every `<script src>` in the served HTML. Baseline = same measurement
  on a worktree without the change. (See memory `bundle-delta-measurement`.)
