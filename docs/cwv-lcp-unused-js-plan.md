# Core Web Vitals: TBT & Unused JavaScript (revised 2026-07-22)

> **Revision note:** the original draft of this plan was fact-checked against the codebase and
> PERFORMANCE-FIXES.md. Roughly half its items were already shipped (auth getSession gate,
> PostHog recorder removal, roaster/coffee detail server-component refactor) or targeted problems
> that no longer exist (the Fuse.js index download — search is already a lazy `search_directory`
> RPC). Its headline targets also gated on **simulated-mobile LCP**, which PERFORMANCE-FIXES
> proved is a Lantern modeling artifact; observed-throttle LCP (2.3–2.6s) and CLS (0) are
> already at target sitewide. The surviving, verified items are below, effort-ordered.

## Goal

Cut above-the-fold client JS and hydration cost — the one remaining lever per
PERFORMANCE-FIXES.md ("Root cause = P2 #7"). **Primary KPIs: TBT and first-load JS.**
LCP and CLS are regression guards, not goals.

## Targets (three-run medians, prod build, `--throttling-method=devtools`)

- **TBT:** ≤300ms mobile (from 1.42s home / 0.6–0.84s elsewhere), ≤200ms desktop.
- **First-load JS:** ≥35% reduction (~600KB → ~390KB uncompressed) on the audit URLs.
- **Bundle-content asserts:** initial chunks contain no 150-icon Phosphor registry, no
  landing-page config data, no cmdk (until search opens).
- **Guards (no regression):** observed LCP ≤2.5s, CLS ≤0.1 (currently 0), FCP ~1.3–1.5s.
- **Informational only:** Lighthouse `simulate` scores/LCP — do not gate on them
  (Lantern inflates main-thread cost; see PERFORMANCE-FIXES.md "Measurement caveat").

Audit URLs: `/`, `/coffees/varieties` + `/coffees/estates` (discovery landing fixtures, served
by `coffees/[slug]`), `/roasters/kcroasters` + `/roasters/hunkal` (roaster detail fixtures).

## Work items (effort-ordered; re-measure after each before proceeding)

### 1. Discovery barrel leak — **DONE (2026-07-22)**

`RoastScale.tsx` (`"use client"`, rendered on every discovery landing page) imported
`discoveryPagePath` from the `landing-pages` barrel, whose **top-level duplicate-slug check
references `LANDING_PAGES`** — a module side effect that defeats tree-shaking and drags all six
config files (~270KB source: bean-type 64KB, region 65KB, brew-method 53KB, process 34KB,
price-bucket 29KB, roast-level 29KB) into the discovery client bundle.

Fix: import from the `./paths` leaf instead (`src/components/discovery/RoastScale.tsx`), and
wrap the barrel's duplicate-slug check in `NODE_ENV !== "production"` so bundlers can DCE the
side effect and tree-shake the barrel if a client component ever imports it again
(`src/lib/discovery/landing-pages/index.ts`).

**Second leak found while verifying the build:** `DiscoveryAccordionGrid` (`"use client"`,
homepage) imported `DISCOVERY_PILL_ROWS` from `discovery-pill-labels.ts`, which pulls the full
barrel + `brew-method-pages` — same dataset, different door. Fix: the rows are static
serializable data, so they're now computed server-side and passed as a `rows` prop from
`src/app/(main)/page.tsx`; `discovery-pill-labels.ts` is marked `import "server-only"` so any
future client import fails the build instead of silently re-leaking.

Verified on a clean prod build: landing-page config strings appear in **zero** client chunks
(`grep -rl` over `.next/static/chunks` — hits only in `.next/server`). Note:
`DiscoveryPillGrid.tsx` has zero importers (dead code, would now fail the server-only guard
if revived) — candidate for deletion.

### 2. Icon registry → direct imports — **DONE (2026-07-22)**

`src/components/common/Icon.tsx` mapped **150** Phosphor icons and was imported by the shared
header and footer, so the full registry shipped on every page (`optimizePackageImports` can't
tree-shake a dynamic-key lookup).

**What was done:** the `Icon` wrapper kept its styling contract (size 20 / duotone / semantic
color→CSS-var mapping — rendering byte-identical) but now takes `icon={FireIcon}` (component)
instead of `name="Fire"` (string). A codemod converted 418 literal call sites across 145 files
to direct `@phosphor-icons/react/dist/ssr` imports (`*Icon` aliases — bare names deprecated;
`/dist/ssr` kept because those are the RSC-compatible variants the registry already used).
Dynamic sites (ternaries, local `STEP_ICONS`-style tables) now hold components instead of name
strings. The registry file was **deleted** — zero `IconName` refs remain. Watch-outs for next
time: four files importing Icon via *relative* paths (`../common/Icon`) escaped the codemod's
grep; tsc caught all of them because `icon` is a required prop.

**Measured (identical method both builds — prod build, sum of script bytes referenced by the
served HTML, gzip):**

| Route | before | after | Δ |
| --- | --- | --- | --- |
| `/` | 818 KB | 697 KB | **−121 KB (−15%)** |
| `/coffees/light-roast` (discovery) | 779 KB | 670 KB | **−109 KB (−14%)** |
| `/roasters/hill-groove-coffee` | 711 KB | 584 KB | **−127 KB (−18%)** |

(Uncompressed: −516/−472/−533 KB.) Baseline = HEAD before today, so this delta includes both
step 1 (barrel leak) and step 2 (icons). Note these totals count every script tag in the HTML
(incl. preloaded below-fold dynamic chunks), so they run higher than Lighthouse's
transfer-size numbers — compare deltas, not absolutes, across methods.

### 3. Defer late-interaction islands

All review/rating islands on both detail pages are static imports today (zero `next/dynamic`
in the roaster/coffee/review trees), and the code-split `SearchCommand`/cmdk chunk mounts on
every `(main)` page load rather than on first open.
→ `next/dynamic` + near-viewport gating for `RatingPanel`, `ReviewList`, `ReviewStats`,
`ExitIntentRating` in `RoasterDetailPage.tsx` / `CoffeeDetailPage.tsx`; mount `SearchCommand`
on first ⌘K / launcher click (`src/app/(main)/layout.tsx`). Preserve rating behavior, keyboard
shortcuts, and exit-intent semantics.

### 4. Replace runtime logo-color analysis

`useImageColor(logoUrl)` (canvas-based) still runs in `RoasterHero.tsx:56` (roaster detail
only). → Replace with a stored/deterministic accent per roaster.

### 5. Homepage ISR shell + deferred personalization — LAST, and only if justified

`/` renders dynamically for two reasons: the page awaits `searchParams` (used only for the
dev-only `?heroSegment` preview) and `HeroSection` → `fetchHeroSegment` reads `cookies()` /
`getCurrentUser()`. Everything else on the page is already `unstable_cache`-wrapped.
**Local TTFB is 4–30ms — this item is only worth doing if production/field TTFB data shows a
real cost** (Vercel function invocation per request). It is also the riskiest item: it moves
personalization client-side and touches auth behavior.

- Cheap partial win, can do anytime: gate the `searchParams` await to development, removing
  one of the two dynamic-rendering causes.
- Full version (as originally designed — the pieces map cleanly onto existing code):
  ISR shell with `revalidate = 600` rendering `HERO_SEGMENT_FALLBACK`
  (`fetch-hero-segment.ts`) / `HeroSuspenseFallback`; new `GET /api/home/hero` returning
  `HeroSegmentPayload`, `private, no-store`, cookie-aware, degrading to the fallback;
  fetched after load only when a session or `icb_anon_id` exists. Keep the public headline
  and poster fixed; personalize only a reserved-size context panel (no LCP-element swap, no
  CLS). Warm homepage TTFB target: <200ms with an ISR hit.

## Explicitly cut (verified against the codebase, 2026-07-22)

- **`GET /api/search` rewrite** — dead problem. Fuse.js is uninstalled; there is no index
  download; search hits the `search_directory` Supabase RPC only at ≥2 chars, debounced, via
  TanStack Query (`use-search-directory.ts`). A REST route + hand-rolled fetch/debounce/cancel
  re-implements working code for ~zero bundle savings.
- **Provider re-scoping (Search/Query/ModalProvider out of root)** — all three are pure
  context, no fetch on mount; re-scoping QueryProvider is a large refactor for ~nothing.
- **PostHog dynamic init/dispatch** — recorder already deleted (0 requests, verified),
  surveys/dead-clicks off, init is ~70 lean lines.
- **Auth idle-defer** — done (P0 #4): `auth-provider.tsx` getSession gate; anonymous visitors
  make no auth network call; `useUserProfile` is `enabled: !!user`-gated.
- **Roaster hero server-side + island isolation** — already shipped: `RoasterDetailPage.tsx`
  and `CoffeeDetailPage.tsx` are Server Components with exactly those client islands.

## Method

Unchanged from PERFORMANCE-FIXES.md: prod build (`next build` + `next start`), Lighthouse
devtools throttling, three-run medians, re-measure after every item before starting the next.
Bundle-content asserts via `npm run analyze` / grepping `.next/static/chunks`. `npm run
type-check` + `npm run lint` after each change. Preserve URLs, metadata, structured data,
keyboard shortcuts, auth flows, search semantics, rating behavior, analytics event names,
reduced-motion support, and themes.
