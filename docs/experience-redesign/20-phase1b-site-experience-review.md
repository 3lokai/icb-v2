# 20 — Phase 1B / Site-wide experience and page-template gates

**Date:** 2026-11-09  
**Status:** Isolated design and interaction prototype, not a production-ready application. User authorized continuing the experience and IA work, not publishing the redesign.  
**Artifacts:** [interactive prototype](../../prototype/atlas-phase1/experience-v2.html) · [existing architecture audit](19-homepage-and-information-architecture.md) · [Phase 1 review trust contract](18-phase1-atlas-prototype-contract.md).  
**Penpot:** `D · Phase 1B — Site navigation and lenses` (three boards: desktop, mobile, canonical hierarchy).

## What was changed

The new isolated HTML experiment **does not remove or alter the Phase 1 prototype**. It adds:

- Permanent desktop header and mobile section ribbon: **Atlas · Explore · Learn · Tools · My Coffee · Reviews**. Search remains persistent. These are *prototype states*, **not claims of newly live /explore routes**.
- A neutral homepage continuation: **six selectable interest lenses** (Brew method, Flavour, Process, Origin, Roaster, Community evidence). Focus changes the same visual world; it does not require a quiz.
- Three tightly integrated adjacent paths for independent community evidence, recently added catalogue products, and articles/tools.
- A clickable IA view for the real `Explore`, `Learn`, `Tools`, `My Coffee` destinations, using actual ICB links that open in a separate tab.
- The original coffee → estate → other roaster thread and dated independent review states remain available.
- Explicit **unpublished** state for estate profile routes. There are canonical estate relationships in the database but no live public estate pages.
- Personal-account preview with clear **simulation** disclosure. It does not read user sessions, generate a fake journal, or call the production database.
- Original HTML continues with `noindex,nofollow`, no credentials and no writes.

## The conceptual hierarchy

| Product area | First-class public/own routes | Page responsibility in the finished experience |
| --- | --- | --- |
| **Atlas / Home** | `/` | Neutral invitation, search/direct actions, contextual lens and community evidence with no brand promotion |
| **Explore** | `/coffees`, `/roasters`, `/regions`, `/curations`, `/communities` | Efficient directories + semantic paths into the Atlas |
| **Coffee discovery landing** | `/coffees/[slug]` for 42 configurations | Indexable SEO content, browse/filter and contextual Atlas reveal, no homepage dependency |
| **Coffee detail** | `/roasters/[slug]/coffees/[coffeeSlug]` | Critical review/ratings evidence, provenance, factual relationships, buying details and contribution |
| **Roaster** | `/roasters/[slug]` | Identity, catalogue and independent reviews; no paid bias |
| **Region** | `/regions` hub, region landing pages under `/coffees/[slug]` | Origin browse and grounded paths into estates/coffees |
| **Learn** | `/learn` plus article, series, category, glossary, insights | Practical reading in context; editorial links clearly distinct from roaster claims and community ratings |
| **Tools** | `/tools` plus 4 tool routes | Fast practical tools, optionally invoked from relevant coffee/article context |
| **My Coffee** | `/dashboard/*`, `/profile/[username]` | Authenticated review history, wishlist, preferences, privacy and public profile |
| **Company, commercial, legal** | `/about`, `/roasters/partner`, `/developers`, `/privacy`, etc. | Accessible navigation/footer without overwhelming organic consumer discovery |

**Unshipped proposals, not included as working public links:** public estate detail, variety/flavour profile, gear comparison, a new standalone reviews route, cross-entity site-wide search, `/explore`. For review evidence, the HTML provides a *prototype state* while the real site's reviews remain on its coffee/roaster detail routes.

## Priorities for page-template design before components

1. **Canonical coffee detail, mobile first.** Biggest opportunity to connect seller data, independently submitted review evidence, transparent sample sizes, logged contributions and relationships. Prototype must preserve real content and external-buy links.
2. **Coffee discovery / facet landing.** Many search visitors enter here, not through home. Preserve educational content, filters, SERP-indexable HTML and existing canonical paths. Integrate the Atlas only as a chosen adjacent action.
3. **Roaster and origin.** Show relationships without implying sensory similarity. Don't link to unpublished estate pages.
4. **Learn article.** Editorial reading remains primary; verified related entities appear as intelligent contextual links.
5. **Tools.** Single-task high-utility UI, no obligatory animations.
6. **My Coffee.** Real preferences, saved items and review records with privacy-safe context, not invented “you tasted this” claims.
7. **Homepage implementation** after the deep-link test confirms portable experience and performance.

### Components to derive later from these templates (not yet approved as a UI library)

- **Evidence object:** score (optional), current sample count, source type, review-age context, zero-review invitation, moderation-state limits. Preserve correctness before rendering animation.
- **Coffee identities:** directory comparison result, Atlas focus object and personal journal entry are *distinct compositions* of the same entity. Do not redesign a single huge generic CoffeeCard with 25 conditional props.
- **Navigation graph:** typed relationship label, prior/next focus, actual route link, provenance indicator, focused state, reduced-motion fallback.
- **Universal wayfinding:** primary nav, compact mobile section ribbon/sheet, global search, breadcrumbs, visible Back, grounded next step.
- **Knowledge & practical cards:** contextual editorial reference vs standalone article preview, direct tool launch vs utility instructions.
- **Personal-context object:** owned saves/ratings and explicit preference controls; no marketing inference masquerading as historical fact.

Keep shared primitives thin and compose context-specific patterns.

## Validation performed

- Browser sample implemented as self-contained HTML, no package installation or database access.
- JavaScript syntax checked with Node v22.
- Headless Chromium/Playwright at **1440 × 900** and **390 × 844** verified:
  - neutral home with six interest lenses and dynamic focus;
  - site sections: Explore, Learn, Tools, My Coffee;
  - visible Curations link and explicitly unavailable estate profiles;
  - fallback real catalogue/article/tool hyperlinks;
  - coffee detail and independent zero-review state;
  - rating input preview only, with no submission;
  - no uncaught browser page errors in tested flows.
- **Not tested:** real Next.js SSR, live login, keyboard screen-reader end-to-end, production Core Web Vitals, public indexability, larger set of canonical graph relations or genuine review publication.
- The prototype uses a static 2026-11-09 data snapshot. It intentionally doesn't claim to be a live feed.

## Still open — user review gate before detailed components

- Does the full ICB hierarchy feel discoverable without damaging the premium/quiet atmosphere?
- Does the homepage continuation feel like *one environment*, or too much like old stacked homepage sections?
- Do we give enough weight to independent reviews versus discovery, learning and shopping?
- Should **My Coffee** be a top-level navigational item, or primarily an avatar/account affordance after sign-in?
- Is **Reviews** a separate top-level navigation destination, or should evidence live inside Explore + the personal journal until a public review hub exists?
- Should Curations and Communities live directly under Explore, or one level deeper?
- Can one of the six lenses become an alternative *primary* entry for novices without making a compulsory first-time quiz?

## Release boundaries

Do **not** merge this prototype into the live Next.js app. Preserve the previously agreed review integrity hardening (delete/tombstone semantics, anonymous cap fail-open fix, identity merge, anti-abuse), SEO route and metadata parity, accessibility, consent and performance before staged integration.

**Next milestone** after critique: design the critical mobile coffee detail and V60 organic discovery landing as actual page templates; then derive real CoffeeCard, ReviewEvidence, RelationLink, and SearchPanel components from approved contexts rather than simply reskinning today's cards.

**Owners:** GT for product calls/release, UX Lead for experience and prototypes, Codex for implementation after approval, Claude for independent review before live review write integration.
