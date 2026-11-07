# 05 — Technical, SEO, Performance and Accessibility Guardrails

## Baseline confirmed from repository (read-only check, 2026-11-07)
Repository `3lokai/icb-v2` uses Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase/Postgres, Sanity, TanStack Query, shadcn/Radix and `motion`. It also has `docs/README.md`, root `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md`, `docs/decisions`, and dedicated `.claude`, `.codex` directories.

`CLAUDE.md` documents:
- Server-first data access in `src/lib/data/fetch-*.ts`; browser async state via TanStack Query and `src/hooks`.
- Coffee filters in `src/lib/filters/coffee-url.ts` and a dynamic metadata RPC, with `coffee_directory_mv` for listing performance.
- URL query state for repeatable/shareable filters.
- Existing static SEO discovery landing pages for brew method, roast, process, price bucket and region in `src/lib/discovery/landing-pages/`.
- Metadata and JSON-LD helpers in `src/lib/seo`, sitemap in `src/app/sitemap.ts`, and non-production `noindex` behaviour.
- `/learn` through Sanity, auth/consent and API routes that should not be casually disturbed.

`PRODUCT.md` and `DESIGN.md` define the CURRENT brand identity as locked. A redesign may explore an evolution, but current style rules stay binding on production until an explicit superseding ADR is accepted.

## Stack recommendation — keep core
**Keep:** Next.js App Router, React, TypeScript, Tailwind, server-rendered content, Supabase, Sanity, existing routes, existing filtering and analytics. CSS is not the obstacle; composition, interaction and motion direction are.

**Try selectively:** existing `motion` package for everyday UI transition; React Three Fiber + Three.js for the few immersive client-rendered scenes proven necessary; GSAP/ScrollTrigger if more precise timeline choreography is required; Lenis only after user testing demonstrates a benefit over native scroll. Test compatibility and bundle size before introducing any package. Do not commit to the entire set by default.

**Avoid:** framework migration, SPA-only rebuild, all-WebGL site, global scroll-smoothing by default, multiple competing animation engines across every component, duplication of the filtering/data logic.

## SEO — route and content preservation
- Build current-route inventory including home, coffee list/details, roaster list/details, regions, (actual) estates, learn routes, tools, discovery landing pages, profiles and public collections.
- Baseline Search Console clicks/impressions/indexation and top-performing landing pages, plus crawl and internal links, metadata, canonicals, JSON-LD, sitemap and page speed.
- Preserve existing public URLs, meaningful headings, indexable copy, site structure and relevant internal links. Redesign can improve markup without changing a slug's meaning.
- Never put essential coffee fields, flavour descriptions, links or taxonomy into WebGL-only rendering.
- Keep deep links and browser navigation functional; preserve shareable filtered URLs.
- Preview/staging must remain `noindex`; do not change production robots semantics without review.
- Track SEO regression per route template, not only homepage analytics.

## Accessibility / performance
- Existing baseline: WCAG 2.1 AA, reduced-motion alternatives, keyboard/focus, light/dark parity (verify against the current code).
- Target Core Web Vitals: LCP <= 2.5s; INP <= 200ms; CLS <= 0.1 at p75. Track mobile and representative slow devices/network conditions.
- Keep interactive 3D client-only and lazy, preferably below initial content paint. Have static art or CSS counterpart and meaningful fallback.
- Budget JS and GPU work; don't use a perpetual 60fps render loop when idle.
- Compare first-visit and returning-visit experiences; users with data savers/reduced motion/weak GPUs get coherent quality.

## API and data integrity
No schema changes or personalization tracking before a separate explicit design decision and consent review. Reuse authenticated access rules (RLS), current identity merge mechanisms and current sources of truth. Avoid separate divergent catalogue or filter implementations.
