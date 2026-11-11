# 23 — Next Design Phase: Information Architecture → Components → Copy

**Status (2026-11-11): PROPOSED execution sequence; not an approval to change routes or production.** This is the single handoff for the next chat. The visual identity phase is closed.

## Starting point — locked

- **Product:** [20 — Find, Rate, Buy](20-direction.md) (neutral directory, authentic packaging, independent ratings, linked attributes, mobile-first).
- **Brand character — CONFIRMED:** "Quiet authority in the typography and information design; warmth in the colour and voice; curiosity and liveliness in the imagery, interactions and graphic details."
- **Visual system:** [22](22-visual-system.md) and [system/](system/). Gambetta + Ranade; Deep Roast light/dark; restrained grain and frames; terrain contours; espresso editorial wash; bottom scrim by default; Light + Contour ambient; three separate feature textures. Do not reopen palettes/fonts/motifs.
- **Design reference:** Penpot file `New File 2`, page `02` for approved I-v2 experience; `03–06` for editable (not pixel-exact) working references; `01` for signed-off identity boards. Full-fidelity styling is in [playground/index.html](playground/index.html) and [system/index.html](system/index.html), **not** on the older Penpot storyboards.
- **Production constraint:** `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md`, existing ADRs and deployed routes remain authoritative until an approved ADR. This branch has design docs/assets, not a production redesign.

## Recommended sequence and approval gates

### Phase A — Current sitemap, proposed IA and coverage (**NEXT**)

**First distinguish three things:** (1) public **URL/SEO sitemap**, (2) visitor-facing **navigation and discovery IA**, and (3) **page template inventory**. A visual redesign does not imply a URL redesign.

1. Refresh the route census from `src/app`, navigation/header/footer, `src/app/sitemap.ts`, redirects and canonical/robots rules. Start with [current-state-audit.md §3 and §13](current-state-audit.md); its 2026-11-07 inventory is a snapshot, not a substitute for current code. Include mobile nav, search, `/learn`, `/tools`, logged-in/account and 404/empty states.
2. Make a **current → proposed** matrix: route, visitor purpose, existing/needed template, header/footer/breadcrumb/search entrance, canonical/indexing status, traffic priority, main CTA, outbound vs internal link, change type (`KEEP / LABEL CHANGE / ADD / MERGE / REDIRECT / DEFER`), evidence and decision status.
3. Preserve important distinctions: `/coffees/[slug]` is an **indexable discovery landing**, not a coffee detail; canonical coffee detail is `/roasters/[slug]/coffees/[coffeeSlug]`. `/regions` is the region hub; regional landing pages currently resolve via `/coffees/<region-slug>`. Do not invent `/regions/[slug]` without evaluating existing SEO/ADR-013.
4. Consider planned objects separately from live routes: gated `/estates/[slug]` (15 qualifying in the Nov 7 audit; recheck), varieties, flavour taxonomy, potential `/gear`, and editorial-to-coffee links. No thin entity pages; no mandatory graph navigation.
5. Map the **three practical pathways**: specific coffee → buy externally; coffee tried → rate; browsing editorial/estate/process → connected directory results. Test anonymous and returning-member paths without implying a view or Buy click means tasting.
6. Decide what belongs in primary navigation, footer, global search, contextual links, breadcrumbs and homepage. Keep **directory** as the visitor-facing browsing term under the current proposal; `record` can remain editorial language. Search scope beyond coffees/roasters remains an explicit decision.
7. Deliver a navigable sitemap, a per-route/template matrix and a list of owner decisions. **Stop for approval.** Do not build or rename routes from this phase.

**Acceptance:** every public template accounted for; existing SEO URLs and redirects protected; core user tasks reachable quickly; no data object is promised a page without content/coverage; desktop/mobile navigation is understandable.

### Phase B — Content model, information hierarchy and representative page anatomy

Before visual component variants, decide what **must appear** and **where** on each template. Specify entity title, provenance, rating sample size and empty states, coffee imagery, process/roast/estate links, freshness and pricing, direct Rate/Buy actions, and relevant editorial/context links. Make a cross-template inventory for homepage, directories, discovery landings, coffee detail, roaster detail, regions/estates, article/tool pages, rating states and returning visitor.

Write **working microcopy now** for navigation labels, CTA meanings, filters, rating feedback, provenance and empty states. Final style polishing comes later. Maintain honest "Just added" chronology, independent evidence and no paid organic rank.

**Acceptance:** reusable information hierarchy on desktop and mobile, with explicit source and state for every dynamic field; no mismatches between experience promise and implementation feasibility.

### Phase C — Image treatment, iconography and components

1. **Image rules:** colour-accurate coffee packs and roaster logos on appropriate plates; mixed aspect ratios/white backgrounds; crops, missing-image fallbacks, loading and attribution. Espresso wash for editorial photos only; bottom scrim for overlaid text; contours outside the packaging zone.
2. **Icon system:** one coherent stroke/style, sizing, UI meaning and accessibility labels. `↗` outward to roaster; `→` internal navigation (PROPOSED, confirm during this phase). Ratings and half-star rendering need precise rules; decorative icons never substitute for evidence.
3. **Component matrix:** nav/search, coffee image tile, coffee cards, ratings/review snippets, filter chips/drawer, breadcrumbs, facet doorways, Rate/Buy CTA, buttons, sheets/forms, provenance blocks, empty/loading/error/skeleton states, mobile touch targets and keyboard/focus states. Decide Buy/Rate prominence (currently PROPOSED) with examples.
4. **Variants before polishing:** mobile/desktop, light/dark, with/without ratings, missing price, sold out/discontinued, anonymous/signed-in, image missing, low sample size, no results.
5. Use the **locked HTML visual system** for responsive comparisons and Penpot `07` for reusable design components/variants *after* the component contracts are agreed.

**Acceptance:** reusable primitives deliver the same meaning across templates without excessive decorative motifs or one-off styling.

### Phase D — Compositions, interaction & motion

Apply components to representative page templates and end-to-end journeys in Penpot and interactive HTML. Native scrolling and straightforward filtering remain the baseline. Test optional scroll-linked continuity, focus/hover/tap states, reduced motion, low-powered mobile, SEO/DOM discoverability and real accessibility. Confirm horizontal gallery behaviour and neutral rotation/chronology policies before implementation.

**Acceptance:** tested mobile-first journeys and credible desktop parity; clear prototype-to-production path.

### Phase E — Final copy, QA, production handoff

Polish editorial voice, CTAs, labels, source disclosures, tutorials, FAQ, accessibility strings and dates/counts **after** content hierarchy and interactions have stabilized. Audit canonical URLs, redirects, indexability, metadata, LCP, layout shifts, contrast, WCAG keyboard/touch, image fidelity, screenshot and interaction parity. Prepare an ADR explicitly superseding the old production design tokens and document incremental rollout, tests and success metrics.

**Acceptance:** owner-approved IA, component system, copy and UX QA; approved ADR **before** production changes.

## Still OPEN — do not mistake these for locked identity decisions

- Site navigation labels, search scope, cross-entity template coverage and any new URL paths.
- Gallery native sideways behaviour (PROPOSED) and strict `Just added` versus neutral editorial selection policy (OPEN).
- Buy/Rate action roles, small-label type sizes, focus/destructive/chart/sidebar colours, half-star rules, icon library, dark pack tiles and image framing details.
- Which feature texture (Weave, Contour, Laid Paper) appears for each section intent.
- Estate timing and data gate, variety/flavour canonical pages and editorial reverse links.
- Signed-in personalization and optional grounded Concierge are future templates, not a reason to delay the core flows.

## First message for the next chat

> Continue ICB's redesign on `3lokai/icb-v2`, branch `design/experience-redesign`. Read `docs/experience-redesign/23-next-design-phase.md`, `20-direction.md`, `22-visual-system.md`, `07-decisions.md`, the existing public-route inventory in `current-state-audit.md`, and the current `src/app` routes. **Start with Phase A only: audit current URLs, nav, site structure and indexable entity templates; propose a current-versus-future sitemap and page-template inventory, with explicit changes and SEO implications.** Do not reopen typography/colours/motifs, do not rebuild the playground, do not change production code, and do not go straight to detailed cards or copy. Ask for sign-off on IA before component design.
