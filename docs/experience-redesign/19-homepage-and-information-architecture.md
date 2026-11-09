# 19 — Homepage & Information Architecture: preserve ICB's breadth, not its 14-section stack

**Date:** 2026-11-09
**Status:** UX lead proposal in Phase 1. No production or database changes authorized or made. Owner asked to reassess the existing homepage and complete page hierarchy after liking the Atlas prototype.
**Sources:** Live public homepage and directories (web crawl may lag); current `main` app routes, `src/app/(main)/page.tsx`, `src/components/layout/header.tsx`, `Footer.tsx`, 42 static `/coffees/[slug]` discovery landing configs, `current-state-audit.md` §3–4, `07-decisions.md`, `16`, `17`.

## 1. Principle

**ICB is a connected library with five modes, not a cinematic microsite: discover, compare, independently review, learn, and brew/track.**

The Living Coffee Atlas is the **interaction language**, not the entire information architecture. An engaging home without the existing article/tools/directories/reviews branches would undermine use cases and SEO.

Retain the public entity pages and canonical routes. **Do not replicate 14 full-height marketing bands or 14 card grids on the new home.** Instead provide a comprehensible navigation hierarchy and progressively reveal relevant objects in one coherent spatial/typographic world. Keep off-ramps for experts.

The homepage or Atlas must NEVER force organic arrivals to detour through the new experience: the majority of mobile organic visitors land on coffee, discovery, article, and roaster pages directly.

## 2. Audited existing navigation and pages

### Public product structure

```text
/
├─ Explore (header group)
│  ├─ /coffees                     main filterable directory
│  │  ├─ /coffees/[slug]            42 indexable SEO landing profiles:
│  │  │                            brew, roast, price, process, region, bean type
│  │  └─ /roasters/[slug]/coffees/[coffeeSlug]  canonical product pages
│  │                                               ratings, pricing, roaster, attributes
│  ├─ /roasters                    filterable roaster directory
│  │  └─ /roasters/[slug]          roaster profile and coffee collection
│  ├─ /regions                     geographical map and state/regional hub
│  │  └─ /coffees/[region-slug]     existing indexable region content
│  ├─ /curations                  curated people/picks; exists, hidden from header/footer
│  │  └─ /curations/[slug]
│  ├─ /communities                 external coffee groups directory
│  └─ Estates, varieties, flavours  connected data objects; NOT shipped as own pages
├─ Learn
│  ├─ /learn                       articles and field-guide pillars
│  ├─ /learn/[slug]                canonical editorial article
│  ├─ /learn/series/[slug]         multi-part themes
│  ├─ /learn/category/[slug]       taxonomy
│  ├─ /learn/author/[slug]         author
│  ├─ /learn/glossary
│  └─ /learn/insights              site data insights (not currently in sitemap)
├─ Tools
│  ├─ /tools
│  ├─ /tools/coffee-calculator
│  ├─ /tools/expert-recipes
│  ├─ /tools/coffee-compass
│  └─ /tools/grind-size-converter
├─ My Coffee (profile / account)
│  ├─ /profile/[username]          shareable community identity
│  └─ /dashboard/*                 signed-in profile, reviews, wishlist,
│                                 preferences, notifications, privacy, developer
├─ For roasters / builders
│  ├─ /roasters/partner
│  ├─ /roasters/[slug]/badges
│  ├─ /developers
│  └─ /roasters/terms
└─ Trust & company (footer)
   └─ /about, /how-icb-works, /press, /newsletter, /contact,
      /privacy, /terms, /data-deletion
```

**Absent / not ready:** `/estates` and estate detail routes, variety/flavour routes, `/gear`, comparison, an independent public reviews hub, global Learn/Tools search, any functional `/explore` destination. Header currently sets Explore parent href to `/explore`, but its nav components do not navigate there. Avoid promoting that href until it exists.

### Existing homepage content, top to bottom

1. Personalized discovery hero + search + quick facets + total counts + new additions ticker
2. Top Rated
3. Fresh from Community
4. New Arrivals
5. Discovery collections (beginner, milk, fruity, South Indian filter)
6. Facet accordion (roast, brew, process, origin, beans, price)
7. Discover → Rate → Share explainer
8. Top reviewers/profiles
9. Roaster infrastructure
10. Education / articles
11. Curator spotlight
12. Testimonials
13. FAQs
14. Bottom CTA

What we must **keep as capabilities**: search, facet entry, fresh product updates, genuine submitted reviews, rating action, catalogue, roaster/region discovery, education, utilities, account/taste profile, help, and trust. What we may remove from the *homepage*: duplicated cards, lengthy how-it-works, repeated testimonials, separate FAQ, seller acquisition content, redundant global CTA and multiple nearly identical collections.

## 3. Proposed primary nav (mobile and desktop)

`Explore` — Coffees · Roasters · Regions · Curations · Communities · **Explore connections** (Atlas mode, only when shipped).

`Learn` — Field Guide · Series · Glossary · Data insights (only once editorially ready).

`Tools` — All tools · Calculator · Recipes · Compass · Grind converter.

`My Coffee` — Signed-in Journal/My Reviews · Wishlist · Preferences · Profile (or sign-in/optional anon state).

`Search` — global 1-action search persistent throughout all page templates. Existing Cmd/Ctrl+K stays; expansion beyond coffees/roasters is a separate search project and should label its scope accurately.

`For Roasters` and `For Developers`, trust/legal and newsletter — accessible footer/secondary destinations, not allowed to crowd top-level consumer discovery.

**A public Reviews landing:** currently missing. Explore a future review activity hub/quality methodology page only if there is meaningful independent evidence and unbiased selection logic. In the meantime, “Rate a coffee” should search/find an actual coffee, not create a fake floating review object.

## 4. New homepage: five compositional regions, not five stacked full-width sections

**A. Entrance (above fold).** Neutral Atlas visual, one statement of purpose, always-visible search and three clear paths: precise filters, guided preferences, open exploration. Profile-aware return path only from actual saved/recent data. Zero default branded product hero.

**B. Choose the lens (next visual beat).** Accessible semantic entry objects: **Brew method / Flavour / Process / Origin / Roaster / Community evidence**. A selection recomposes the same canvas and deep-links to existing `/coffees/[slug]` or filtered directory; don't invent a standalone /flavours route.

**C. The living directory (contextual reveal).** Two honest sources of freshness: new catalogue arrivals **and** latest independent community submissions. Show small balanced samples with explicit "latest" logic, review sample sizes and easy open-all action. No default featured/endorsed roaster: user reviews in a chronological stream are community evidence, not a commercial hero placement. Avoid a misleading “Top Rated” global list based only on unqualified means from n=1 or 2; gate or label insufficient samples.

**D. Follow the thread (on selection).** Coffee ↔ estate ↔ other roaster ↔ region ↔ related Learn article. Treat roaster descriptions, inference and independent opinion as different sources. Use real adjacent relationships and meaningful breadcrumb/Back; preserve permanent canonical route links in accessible DOM.

**E. Field Guide & workbench (lighter footer-adjacent region).** Contextual links into Learn and Tools. If someone selects V60, show the V60 landing + ratio calculator/recipe/glossary/article rather than four disconnected hero advertisements. Retain visible “All articles” / “All tools” / “All roasters” links and footer sitemap.

**Mobile:** homepage opens concise above fold; lens selector plus latest-submission indicators in first ~1.5 viewports, not a two-minute cinematic intro. More rich relationships load on choice, not on scroll alone.

**The footer** remains a structured sitemap and SEO-safe navigation affordance. It should include Regions and Curations, absent today.

## 5. How Atlas fits canonical page templates

- **Coffee detail** `/roasters/[slug]/coffees/[coffeeSlug]`: independent review evidence and quick rating immediately legible; catalogue facts and buy link still present; an adjacent **Explore connections** panel/inline scene reveals estate/roaster/region/variety/articles where sourced. Preserve structured data, SSR, canonical and indexability.
- **Coffee landing** `/coffees/v60` etc: keep indexable educational copy, FAQ, filters, listing and related links; allow selected coffee to focus Atlas without moving the user to a different URL by default.
- **Roaster detail**: same real coffee grid, about information and reviews; Atlas shows origin/other interpretations (not paid/endorsement graph).
- **Regions hub**: keep real map/state structure; in Atlas, region is a lens on coffees and estates, not necessarily a new separate profile URL.
- **Learn article**: its editorial text remains primary; annotate/attach source-backed related coffees, regions, estates, tools, with editorial provenance. Reverse-link from coffee only when a grounded association is available.
- **Tools**: standalone, fast, practical pages. Contextual invocation from relevant coffee/learn paths; never interrupt brewing with animation.
- **Profile/Journal**: signed-in contributions, saved/liked/reviewed coffees and preferences remain private or user-controlled. Do not equate views/wishlists with tasted history.
- **Catalogues**: preserve filters, sorts, URL query semantics, accessibility and pagination. Atlas is an option, not a compulsory replacement for efficient comparison.

## 6. Implementation priority and owner gates

**Phase 1B (now, design):** update the isolated prototype to show the full IA and homepage contextual modules, while retaining neutral hero and first-party review credibility. Demonstrate mobile navigation, “Explore all coffees,” saved-state personalization preview, review feed and article/tool contextual card. Do not style the home as 14 card sections.

**Phase 2 (integration only after owner critique):** shared navigation contract and canonical route linking, isolated preview route with verified data. Test mobile organic deep-link first.

**Before rollout:** review integrity blockers, data provenance, current filter URL/back behaviour, verified SEO route parity, performance, accessibility, instrumentation and trust disclosures.

**Acceptance gates:**
- Every current header/footer primary destination remains reachable within two interactions from any page.
- All ~42 existing landing slugs and canonical coffee/roaster/article URLs remain intact.
- A first-time user can reach an exact /coffees filtered list in one action and identify that reviews are independent.
- A reviewer can find a coffee from search, see current sample size and initiate a rating after trying it without wandering the Atlas.
- On mobile, links to catalogue, Learn and Tools are visible; no hidden full-screen modal required for navigation.
- An organic landing visitor can use Atlas connections without forced homepage visit.
- A member can resume genuine previously visited/saved context with no fabricated “tried” entries.
- No default anonymous featured seller and no sample-size-free top-rated claims.

## 7. UX lead recommendation to owner

**Keep the Atlas prototype's voice and motion direction. Restore its product architecture.** ICB should have a recognisable *front door*, well-signed *rooms* (directories, content, tools, profile), and elegant *passages* (entity connections). The homepage is the foyer, not the entire building. This preserves the ambitious experience without deleting the dependable routes people and Google already use.

No new implementation or production decision is implied by this document. Review the information architecture and upgraded Phase 1B prototype before committing to navigation redesign.
