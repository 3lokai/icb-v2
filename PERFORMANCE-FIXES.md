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
→ Ensure the LCP element (hero heading/panel) renders from SSR HTML with no motion dependency; make motion-driven flourishes hydrate after paint. Below-fold sections are already `dynamic()` — good; the problem is above-fold.
Impact: high (home only, but home is worst). Effort: medium.

### P1 — Slug-page CLS (0.93 / 0.29)

**6. Stop the roaster/coffee detail page from reflowing after hydration.**
`src/components/roasters/RoasterDetailPage.tsx` is one big `"use client"` component with `min-h-screen` and a `useImageColor(logoUrl)` hook that re-themes after the logo loads. First paint ≈ 1 viewport; post-hydration content fills in and pushes the footer down ~a full screen → CLS 0.932. The coffee slug page has the same shape (0.290).
→ Two options: (a) render the detail body as a Server Component so the SSR HTML is already full-height (biggest win, also cuts JS); or (b) if it must stay client, reserve real height for the sections that mount late and make `useImageColor` not affect layout. Confirm the logo `<Image>` has explicit width/height (it uses `aspect-square` — verify the container has a fixed size before the image loads).
Impact: high (both slug pages). Effort: medium (a) / low (b).

### P2 — Structural, longer horizon

**7. Cut the 66% `"use client"` ratio.**
205/310 component files are client. Many are static presentational components that only need to be client because of one icon, one `motion` flourish, or a barrel re-export. Auditing these back to Server Components is the durable fix for the shared-bundle size — it compounds with every fix above.
Impact: high (sitewide). Effort: high (incremental).

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
