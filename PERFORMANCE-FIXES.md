# Performance Fixes — LCP / FCP / CLS

Lighthouse run: **local production build** (`next build` + `next start`), **mobile throttled**, one build, five pages. Date: 2026-07-20.

## Measured baseline

| Page               |  Perf  |  FCP  |    **LCP**    |  TBT  |   **CLS**    |   JS shipped   |
| ------------------ | :----: | :---: | :-----------: | :---: | :----------: | :------------: |
| `/` (home)         | **50** | 1.96s | **11.42s** 🔴 | 1.05s |    0.000     | 938KB / 49 req |
| `/roasters`        |   72   | 1.36s |     7.06s     | 240ms |    0.001     | 809KB / 41 req |
| `/coffees`         |   71   | 1.81s |     7.74s     | 214ms |    0.042     | 822KB / 43 req |
| `/roasters/[slug]` | **45** | 1.35s |     6.99s     | 309ms | **0.932** 🔴 | 805KB / 42 req |
| `/coffees/[slug]`  |   58   | 1.36s |     7.00s     | 209ms | **0.290** 🔴 | 899KB / 49 req |

## Root cause (one diagnosis, explains everything)

- **TTFB is 4–30ms everywhere.** Server render is excellent — not the problem.
- **FCP is ~1.4s** — SSR HTML paints fast.
- **LCP is 7–11s.** The ~5.5s gap between FCP and LCP = **the main thread is pinned hydrating ~800–940KB of JS** before the LCP element can paint. Home main-thread work = 7.7s, others 2.4–2.9s.
- **Images are NOT the problem** (biggest is 40–68KB, well optimized).
- **205 of 310 component files are `"use client"` (66%).** That is the structural driver of the JS weight and the hydration cost.
- **CLS on slug pages** = the whole detail page is a single client component that grows after hydration and shoves the footer down (footer is the _victim_, not the cause).

The same ~800KB shared bundle loads on every route, so fixing the shared pieces lifts all five pages at once.

---

## P0 status — DONE (2026-07-21)

All four P0 fixes landed and were re-measured on a fresh prod build (same mobile-throttled config).

| Page               | Perf b→a  |     LCP b→a     |    TBT b→a    |  JS KB b→a  |
| ------------------ | :-------: | :-------------: | :-----------: | :---------: |
| `/` (home)         | 50→**75** | 11.42→**7.75s** | 1.05s→**0ms** | 938→**609** |
| `/roasters`        |  72→67¹   | 7.06→**4.44s**  |  240→**0ms**  | 809→**589** |
| `/coffees`         | 71→**78** | 7.74→**5.86s**  |  214→**0ms**  | 822→**602** |
| `/roasters/[slug]` | 45→**59** | 6.99→**5.26s**  |  309→**0ms**  | 805→**589** |
| `/coffees/[slug]`  | 58→**80** | 7.00→**5.41s**  |  209→**0ms**  | 899→**611** |

**Wins:** motion/react left the global bundle (−200–300KB JS/page), **TBT → 0ms everywhere**, LCP down 2–4s across the board.

¹ `/roasters` score dipped because its footer CLS surfaced (0.001→0.362). This is **not** a structural regression from the P0 changes: `/coffees` uses the identical navbar/auth/streaming path and stayed at 0.000. It's a latent Suspense-streaming footer shift (the Fix #6 pattern) — the baseline's single run measured a lucky 0.001; the freed main thread changed swap timing and exposed it. Confirmed independent of skeleton card count (6→15 left CLS pixel-identical). **→ Fix #6 territory, needs its own diagnosis.**

Changed files: `src/hooks/use-scrolled-past.ts` (new), `src/components/ui/resizable-navbar.tsx` (motion→CSS), `src/components/layout/header.tsx`, `src/components/providers/query-provider.tsx` (devtools removed + dep uninstalled), `instrumentation-client.ts` (recorder deferred to idle), `src/components/analytics/MicrosoftClarity.tsx` (idle init), `src/components/providers/auth-provider.tsx` (getSession gate).

---

## LCP / FCP workstream — DIAGNOSIS (2026-07-21)

Same discipline as the CLS work: **identify the actual LCP element before touching anything.** Homepage first — it's the worst (LCP ~7.8s, now ~12s carrying the font-preload cost). No fixes applied yet; this is the diagnosis.

### The homepage LCP element is the hero **video background**, not the serif `<h1>`

Two above-the-fold contentful candidates in `HeroControl`:

1. **Hero `<h1>` headline** (`text-display` = Fraunces via `font-serif`). Server-rendered — it's in the initial HTML via the Suspense fallback (`HeroSuspenseFallback` → `HeroPrimaryHeadline`), so it paints at **FCP (~1.4s)** in the fallback serif and swaps to Fraunces later (`display:swap`).
2. **Hero video background** (`HeroVideoBackground`, full-viewport `object-cover`, ~90svh × full width — the largest element on screen). But it's `"use client"` and mounts the `<video>` element **only after hydration + a 100ms timer**; before that it's a CSS-gradient `<div>` (gradients aren't LCP-eligible). So its first frame can't paint until the ~600KB bundle finishes hydrating → paints at **~7s**.

**Why we can name the LCP element without a fresh trace — the font-preload regression is the proof.**
Turning Fraunces `preload:true` regressed home LCP **7.8s → 12s** (measured, see the CLS section). But with `display:swap` the h1 **always** paints immediately in the fallback serif regardless of preload — preloading Fraunces can only make the real font arrive _sooner_, never delay the h1's first paint. So **a preload could not possibly regress an h1-driven LCP.** Since it did regress LCP by ~4s, the LCP element is **not** the h1 — it's an element whose paint competes with the high-priority font fetch for bandwidth/main-thread during the critical window. That's the **hydration-gated video background**: LCP updates to the largest element as the page loads, so the h1 is only the _interim_ LCP at FCP, and the full-viewport video paint at ~7s **overtakes** it as the final LCP. Adding a Fraunces preload delayed the JS/video pipeline → later video paint → +4s LCP.

This also explains the cross-page split: home is the only page with a full-viewport, hydration-gated video, which is why it's the 7.8→12s outlier while the listing/detail pages sit at 4.4–5.9s (their LCP is the main-thread-pinned shared-bundle hydration cost from the core diagnosis, not a video).

### FCP is healthy — leave it alone

FCP is **1.36–1.96s** across all five pages (home slightly worst because its SSR does the hero data fetch). SSR HTML paints fast; the h1 text is already in the initial HTML. The only FCP risk is regressing it — keep the h1 server-rendered and keep fonts non-blocking (`display:swap`/`optional`, never `block`). No FCP fix needed.

### Prescribed fixes (home LCP), lazy → higher rungs

**L1. Give the hero a real server-rendered poster `<img>` — DONE (2026-07-21).**
The only poster used to be an inline-SVG data-URI _on the `<video>`_, which doesn't exist until hydration. Now a static full-viewport `<img src="/videos/hero-poster.webp" fetchPriority="high">` renders **unconditionally** in `HeroVideoBackground` (server HTML, behind the scrims); the `<video>` still mounts on top after hydration (unchanged — good for TBT). The poster is the largest contentful element and lands in the first flush → it becomes the LCP element and paints at FCP.
_Asset (15KB):_ `ffmpeg -y -i public/videos/hero-video-sm.mp4 -frames:v 1 -c:v libwebp -quality 60 public/videos/hero-poster.webp`.
**Measured (prod build, CDP mobile-throttled: 4× CPU, 1.6Mbps):**

|             |    before (post-P0)     | with font preload |          **after L1**          |
| ----------- | :---------------------: | :---------------: | :----------------------------: |
| Home LCP    |          7.75s          |        12s        |        **~1.8s** (cold)        |
| LCP element | video (hydration-gated) |       video       | **`hero-poster.webp` `<img>`** |
| Home FCP    |          1.96s          |         —         |             ~1.5s              |

The LCP element flipped from the video to the poster and collapsed to ≈FCP — so the font preload (L2) no longer sits on the LCP path for home (LCP is now a font-independent image). Changed file: `src/components/homepage/hero/HeroVideoBackground.tsx` + new `public/videos/hero-poster.webp`.
_Note:_ measured via a headless-Chrome CDP `largest-contentful-paint` PerformanceObserver, not full Lighthouse — good enough to confirm the element flip and the timing collapse; run Lighthouse for the official Perf score before/after.

**L2. Fraunces `preload:true` → `display:optional` — WON'T DO (superseded by L1, 2026-07-21).**
The whole reason to touch the font was that `preload:true` put Fraunces on home's critical path and cost ~4s LCP. **L1 removed that:** home's LCP is now the poster `<img>` (font-independent) and measured ~1.8s _with `preload:true` still on_ — the preload cost is gone. Keeping the current config (`preload:true` + `display:swap`) is the best UX: Fraunces is preloaded so it arrives before first paint on most loads → the brand font renders with minimal/no swap flash, and the PageHeader CLS stays 0. `display:optional` was rejected on UX grounds (product call). Net: **leave `src/app/layout.tsx` font config unchanged.**

**L3. (only if L1+L2 leave home short) Trim above-the-fold hero client JS** — folds into existing item **#5** below (keep motion out of the hero) and **#7** (the 66% `"use client"` ratio). The faster the bundle hydrates, the sooner the video swaps in; but with L1 the poster already owns LCP, so this is TBT/polish, not the LCP lever.

**Confirmation step (the team's established method):** re-run the same local-prod Lighthouse (mobile-throttled) and read the "Largest Contentful Paint element" audit before and after L1 to confirm the element flips from `<video>` to the poster `<img>` and the timing collapses. (This diagnosis is code + the measured preload regression; a headless CDP trace was attempted but the sandbox kills a Chrome debug port, and dev-server timings aren't representative anyway — Lighthouse on the prod build is the right instrument.)

---

> **⚠ CORRECTION (2026-07-21, later): the sweep below is CDP `PerformanceObserver`, NOT Lighthouse — do not read it as the Perf score.**
> A real prod Lighthouse run (mobile, simulate throttling) on `/` scored **44**, not ~75+: LCP **7.4s**, TBT **1.98s**, TTI **12.9s**, bootup **11.5s**, CLS **0**. The CDP observer records the LCP _element_ and its paint time correctly (that's why it read ~1.85s — the poster is paint-eligible), but it does **not** capture main-thread hydration cost, which is what Lighthouse penalizes. **Home is NOT done.** See the Lighthouse baseline table directly below. The CDP sweep remains useful only for confirming the LCP _element_ and CLS=0, which both still hold.

### Real prod Lighthouse baseline — home (2026-07-21)

`next build` + `next start`, mobile, simulate throttling (Lighthouse default). This is the number that counts.

| Metric                   |   Value   | Note                                                         |
| ------------------------ | :-------: | ------------------------------------------------------------ |
| Perf score               |  **44**   | vs P0 table's claimed 75 (that was a different/luckier run)  |
| FCP                      |   1.8s    | healthy, unchanged                                           |
| LCP                      | **7.4s**  | poster is the element but its paint waits behind main thread |
| TBT                      | **1.98s** | P0 table's "0ms" does not reproduce under real Lighthouse    |
| TTI                      |   12.9s   |                                                              |
| **CLS**                  |   **0**   | ✅ the CLS/poster/loading.tsx work is real and holds         |
| Script Evaluation (main) | **11.4s** | of ~14s total main-thread — **the entire bottleneck**        |
| bootup-time              |   11.5s   | one 134KB entry chunk credited 8.3s = client-tree hydration  |

**Root cause = P2 #7 (66% `"use client"`).** The 8.3s isn't the entry chunk's own code — it's the synchronous hydration of the client-component tree it boots. Fonts, poster, and the LCP element are already correct and are **not** the lever; only cutting hydration cost moves LCP/TBT/TTI. Fix workstream tracked under P2 #7 below.

### Full sweep — LCP / FCP / CLS re-measured (2026-07-21, after L1) — CDP observer, not Lighthouse

Cold first-visit loads (browser cache disabled), prod build, CDP mobile-throttled (4× CPU, 1.6Mbps). **Canonical URLs** — note `/coffees/[slug]` is a discovery-landing route that renders a not-found shell for real coffee slugs; the canonical coffee detail is `/roasters/[roaster]/coffees/[slug]`. **⚠ These are element-paint times, not Perf scores — see the correction above.**

| Page (canonical)                                 |  FCP  |    LCP    | LCP element                |  CLS  |
| ------------------------------------------------ | :---: | :-------: | -------------------------- | :---: |
| `/` (home)                                       | 1.53s | **1.85s** | `hero-poster.webp` `<img>` | **0** |
| `/roasters`                                      | 1.34s | **1.75s** | `hero-roasters.avif`       | **0** |
| `/coffees`                                       | 1.46s | **2.60s** | `hero-bg.avif`             | **0** |
| `/roasters/hill-groove-coffee` (detail)          | 1.34s | **1.67s** | roaster logo `<img>`       | **0** |
| `…/coffees/orchardale-…` (coffee detail, nested) | 1.46s | **1.79s** | product `<img>`            | **0** |

**CLS progress is intact** — every well-formed page measured **0** (the home poster is `absolute inset-0`, out of flow → it cannot shift anything). LCP is down massively vs the P0 table (home 7.75→1.85, roasters 4.44→1.75, coffees 5.86→2.60, details ~5.3→~1.7) and FCP holds ~1.3–1.5s. Neither the poster nor anything else regressed CLS.

**Two pre-existing issues the cold sweep surfaced (NOT from L1 — both are data/content-dependent, unrelated to the home poster):**

- **Cookie banner becomes the LCP element on pages that lack a large hero image.** `CookieNotice` is `"use client"`, `position:fixed` (portal to `document.body`, so **CLS stays 0**), and mounts on `requestIdleCallback` (1s timeout). On pages whose largest paint is otherwise small (e.g. `/roasters/6-degrees-coffee`, no big logo) the banner `<p>` is the largest contentful paint → **LCP ~5.8s** for first-time (no-consent) visitors. Pages _with_ a hero image (hill-groove) are unaffected — LCP is the image at ~1.7s.
  - **Tried removing the idle-defer (mount on hydration instead) — DID NOT help, reverted (2026-07-21).** Re-measured: banner still LCP at **5.77s**. The defer was never the gate — under CPU throttle the banner (a client component) can't paint until the page's ~600KB bundle **hydrates ~5.7s**, which is ~when the idle callback fired anyway. Removing it only moved the banner's mount work onto the critical hydration path. So this is the **same hydration-gating root cause as P2 #7** (66% `"use client"`), not a banner-specific bug.
  - **Real fix:** either give hero-less detail pages an early, reasonably-sized above-fold content element so real content owns LCP (content work), or cut the hydration cost so _all_ late client paints land sooner (P2 #7). SSR-gating the banner won't work — consent lives in `localStorage`, unreadable server-side, so a server-rendered banner would flash for consented visitors.
- **Some roaster slugs render a late client "Bean Not Found" error boundary.** `/roasters/blue-tokai-coffee-roasters` SSRs real content but then a client island swaps in a `«4 4 Bean Not Found»` boundary at ~5.2s, shifting the footer → **CLS 0.44** and a garbage LCP. Looks like a per-roaster client-side data/hydration failure, not a layout bug. **Its own bug hunt** — separate from the perf work.

### P0 — Shared bundle, helps every page

**1. Remove Framer Motion (`motion/react`) from the global header.**
`src/components/layout/header.tsx:6` imports `useScroll` / `useMotionValueEvent` just to shrink the navbar on scroll. The header hydrates on **every route**, so this drags motion's runtime into the shared chunk sitewide.
→ Replace with a plain `scroll` listener + a CSS class toggle (or `IntersectionObserver` sentinel). Removes motion from the critical global path.
Impact: high (all 5 pages). Effort: low.

**2. Lazy-load `ReactQueryDevtools` — it ships in the shared chunk.**
`src/components/providers/query-provider.tsx` statically imports `@tanstack/react-query-devtools` and renders `<ReactQueryDevtools />` unconditionally.
→ Gate behind `process.env.NODE_ENV === "development"` with `next/dynamic` (or drop it). One line, ships zero devtools JS to prod.
Impact: medium (all pages). Effort: trivial.

**3. Defer the analytics stack — 4–5 third-party scripts compete with LCP.**
`src/app/layout.tsx` loads, on every page: Google Analytics (`@next/third-parties`), Microsoft Clarity, Vercel `SpeedInsights`, a `beforeInteractive` inline GA-consent script, and PostHog (`instrumentation-client.ts`, incl. `posthog-recorder.js` ≈ 52KB in prod). They execute during the exact window LCP needs the main thread.
→ Load GA/Clarity with `strategy="lazyOnload"` (not `afterInteractive`), and gate PostHog session recording to start after `load`/idle or first interaction. PostHog config is already lean (surveys + dead-clicks off) — just delay the recorder.
Impact: high (all pages, esp. TBT/LCP). Effort: low–medium.

**4. Skip the Supabase `getUser()` round-trip for anonymous visitors.**
`src/components/providers/auth-provider.tsx` calls `auth.getUser()` on mount on every page, and the header calls `useUserProfile()` — both fire for logged-out users who have no session cookie.
→ Short-circuit when no auth cookie is present (check cookie before the network call); skip `useUserProfile` when `user` is null.
Impact: medium (all pages, main-thread + network). Effort: low.

### P1 — Home page (the 11.4s / 7.7s outlier)

**5. Keep Framer Motion out of the above-the-fold hero.**
Home statically imports `HeroSection` → `HeroControl` (`"use client"`); 10 homepage components use `motion/react`. The hero's client JS is why home does ~3× the main-thread work of other pages.
→ Ensure the hero renders from SSR HTML with no motion dependency; make motion-driven flourishes hydrate after paint. Below-fold sections are already `dynamic()` — good; the problem is above-fold.
Note: per the LCP diagnosis above, the LCP element is the hydration-gated **video**, not the heading/panel — so this is a TBT/hydration-speed win (item L3), secondary to the poster-image fix (L1). Impact: high (home only, but home is worst). Effort: medium.

### Listing/hero CLS (`/coffees` 0.042) — DONE (2026-07-21): CLS → 0.000

The `#coffee-filters` bar was a **victim**, not the cause. Trace `LayoutShift.impacted_nodes` showed
everything below the hero shifting down a uniform ~30px (heights unchanged) → the shared `PageHeader`
hero title (`text-hero` = Fraunces, `preload:false`) swaps from fallback to Fraunces, grows past its
`min-h-[55vh]`, and pushes all content below. Affects every PageHeader page. **Fix: Fraunces
`preload:true`** (`src/app/layout.tsx`) → CLS 0.000, LCP unchanged on the listings.
**⚠ Known trade-off:** the global preload regressed **homepage LCP ~7.8s → 12s** (serif now on the
critical path, competing with home's LCP element). Accepted to keep the brand font rendering; the
homepage LCP is tracked as a separate fix (see the **LCP / FCP workstream** section above — fix L2
revisits this preload). `display:optional` would fix the CLS with no LCP cost but shows the fallback
serif until cached.

### P1 — Slug-page CLS (0.93 / 0.29) — DONE (2026-07-21): CLS 0.932 → 0.000

**Actual root cause (not what was theorized below):** the detail routes' `loading.tsx` was a
`fixed inset-0` full-screen spinner with **zero document-flow height**. While the page streams, the
shell is `header + empty main + footer`, so the footer sits near the top; when content streams into
`<main>` the page grows to ~6600px and the footer drops → CLS 0.932. **Fix:** removed
`roasters/[slug]/loading.tsx` and `roasters/[slug]/coffees/[coffeeSlug]/loading.tsx` — each page now
renders as one server unit (footer in final position); client navigation keeps the previous page
visible instead of a spinner overlay. Verified: **CLS 0.000, 0 shifts, Perf 47→72** on both detail pages.

Independently, the detail pages were refactored to **Server Components + client islands** (`RoasterHero`/
`CoffeeHero`, `ScrollspyTabBar`, `RatingPanel`, `ExitIntentRating`, id-wired `FloatingRateCTA`), UI
identical — a client-JS/architecture win (matches "main page server-rendered"), though it did NOT move
CLS (the `loading.tsx` fix did). Ruled out as causes: fonts (`display:optional` unchanged it), skeleton
card count, and review-data-at-SSR. LCP on detail pages is still ~7s — a separate, open issue.

**6. (original theory — superseded) Stop the roaster/coffee detail page from reflowing after hydration.**
`src/components/roasters/RoasterDetailPage.tsx` is one big `"use client"` component with `min-h-screen` and a `useImageColor(logoUrl)` hook that re-themes after the logo loads. First paint ≈ 1 viewport; post-hydration content fills in and pushes the footer down ~a full screen → CLS 0.932. The coffee slug page has the same shape (0.290).
→ Two options: (a) render the detail body as a Server Component so the SSR HTML is already full-height (biggest win, also cuts JS); or (b) if it must stay client, reserve real height for the sections that mount late and make `useImageColor` not affect layout. Confirm the logo `<Image>` has explicit width/height (it uses `aspect-square` — verify the container has a fixed size before the image loads).
Impact: high (both slug pages). Effort: medium (a) / low (b).

### P2 — Structural, longer horizon

**7. Cut the 66% `"use client"` ratio.**
205/310 component files are client. Many are static presentational components that only need to be client because of one icon, one `motion` flourish, or a barrel re-export. Auditing these back to Server Components is the durable fix for the shared-bundle size — it compounds with every fix above.
Impact: high (sitewide). Effort: high (incremental).

**Phase A — de-clienting the shared layout primitives (2026-07-21): DONE, but ZERO metric impact.**
Removed the gratuitous `"use client"` from 5 pure presentational primitives (`stack`, `section`, `cluster`, `prose`, `rule` — verified no hooks/events/browser-APIs/motion; kept `reveal.tsx` which genuinely needs client). Type-check/lint/build all clean, render identical. Kept the change (it's correct + tidier), but **Lighthouse home was unchanged: Perf 44→44, LCP 7.4→7.5s, TBT 1.98→2.09s.** Lesson: these primitives are thin `<div>` wrappers — making them Server Components saved nothing because the expensive client components _inside_ them (hero, motion sections, cards) stayed client and hydrate regardless.

**Phase B — cards/layout/common: NO safe yield (verified file-by-file, 2026-07-21).** Every `"use client"` file in those folders is either (a) genuinely interactive (`useState`/`onClick`/`onError`/forms/custom hooks — correctly client) or (b) rendered inside a **client** parent (`CommunityCard`→`CommunityGrid`, `TopProfileCard`→`TopProfilesSection`), where removing the directive is a no-op (RSC auto-promotes it back to client) and stripping its `memo`/`useMemo` would _regress_ re-renders. Directive removal is exhausted; the real lever is island-ifying the client _parents_ (server shell + minimal client island), which is behavior-touching Phase-C work, not a directive edit.

**Measurement caveat discovered:** Lighthouse `simulate` (Lantern) inflates "Script Evaluation / bootup-time" (reported 11–13s) far beyond the real long-tasks (longest single task ≤554ms; TBT ~2s). Trust **TBT and LCP**, not the bootup-time number.

**CDP-vs-Lighthouse LCP contradiction — RESOLVED (2026-07-21).** Confirmed from the Lighthouse HTML report's LCP insight audits: **the LCP element IS the `hero-poster.webp` `<img>`** (full-viewport, `fetchpriority=high`, `priority:High`). Its network entry shows it **fully downloaded at 124ms** (15KB). Yet `simulate` times its paint at **7.5s** — pure _render delay_, not load delay. An already-downloaded, above-the-fold, high-priority image can only be delayed by a congested main thread. So: CDP (real browser, observed) saw the poster paint at ~1.85s; Lantern _models_ it at 7.5s because it chains the LCP render behind its simulated (inflated) main-thread queue. **Real-user LCP is almost certainly ~2s; the 7.5s is a lab-model penalty.** This is why L1 (poster) + font + CLS work can't move the `simulate` score — under Lantern, LCP is gated on main-thread script work, and the only lever is cutting above-the-fold client JS.

### Observed-throttle sweep — the real numbers (2026-07-21)

Ran Lighthouse locally with `--throttling-method=devtools` (observed, headless Chrome) across all 5 pages. **This is the honest picture; the `simulate` scores were Lantern artifacts.**

| Page                              | Perf | FCP | LCP | TBT  |   CLS    |
| --------------------------------- | :--: | :-: | :-: | :--: | :------: |
| `/` (home)                        |  65  | 2.0 | 2.6 | 1.78 |    0     |
| `/roasters`                       |  74  | 1.9 | 2.3 | 0.73 | **0.11** |
| `/coffees`                        |  76  | 2.0 | 2.3 | 0.84 |    0     |
| `/roasters/{slug}`                |  73  | 2.0 | 2.4 | 0.61 | **0.12** |
| `/roasters/{slug}/coffees/{slug}` |  75  | 2.1 | 2.5 | 0.81 |    0     |

- **LCP is good sitewide (2.3–2.6s)** — every `simulate` 4–7.5s reading was a modeling artifact. No LCP work warranted.
- **Home is the TBT/Perf outlier** (1.78s / 65) — the above-fold hero client JS. The other four sit at 73–76 / TBT 0.6–0.84s.
- **Real CLS defect: `/roasters` 0.11 and `/roasters/{slug}` 0.12** (not 0). `/coffees` + coffee-detail are clean, so it's the roaster-path Suspense/footer streaming shift (Fix #6 territory) — its own item.

**posthog-recorder removed entirely (2026-07-21).** User does not record sessions, so the idle-`startSessionRecording()` block in `instrumentation-client.ts` was deleted (kept `disable_session_recording: true`). Verified: `posthog-recorder.js` = **0 network requests** (was a ~319ms main-thread block on every page). **Home TBT 1.78→1.42s, Perf 65→67**, LCP/CLS unchanged. Every page reclaims ~350ms TBT. Supersedes the P0 #3 "idle-defer the recorder" approach — it's now off, not deferred.

**Hero-island refactor: NOT warranted for LCP** (LCP is 2.6s observed — fine). It would only help home's residual TBT (~1.42s post-recorder), which is diffuse hydration with no single culprit — high effort for a lab-metric that field data doesn't gate on. Deferred; revisit only if CrUX INP is poor. The candidate components if pursued: `HeroControl`/`HeroSearch`/`HeroCTAs`/`HeroContextPanel`/`HeroSegmentDevToggle`/`HeroVideoBackground` → server shell + one minimal client island.

**8. Make `ModalProvider` / `SearchProvider` lazier.**
`src/app/layout.tsx` mounts both on every page though they're only needed on interaction. `SearchCommand` is already `dynamic()` (good). Consider mounting the modal/search context contents on first use.
Impact: low–medium. Effort: medium.

---

## Suggested order

1–4 first (P0, all one bundle, every page benefits, mostly low effort) → re-measure → then 5 and 6 (the two worst individual numbers: home LCP and slug CLS) → then 7 as ongoing cleanup.

## Not worth touching

- Image optimization (already good).
- Server/TTFB (already 4–30ms).
- `recharts` / `embla` — route-scoped to dashboard/insights/blog, not in the global path.
- `optimizePackageImports` for `motion` / phosphor icons is already configured.
