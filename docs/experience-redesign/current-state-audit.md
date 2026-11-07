# Current-State Audit — ICB Experience Redesign, Phase 0

**Status:** Phase 0 deliverable (read-only). Awaiting owner review. No phase advanced.
**Date:** 2026-11-07 · **Branch:** `design/experience-redesign` · **Author:** Claude Code
**Companion:** [requirements-traceability.md](requirements-traceability.md)

## 0. Goal, method, constraints

**Goal.** This audit gives an evidence-backed inventory of what ICB ships today. It covers routes, navigation, entry points, journeys, the filter system, discovery landing pages, objects and relationships, personalization, SEO and motion. Each item is mapped to the three intent paths and canonical objects in [02](02-experience-architecture.md). The audit also reconciles the redesign docs against the production rules.

**What was reviewed.**
- The redesign docs: `README.md` and files 01–09.
- The production rules: `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` and `docs/README.md`.
- ADRs 002, 005, 006, 012 and 013, plus `docs/auth.md`, `docs/regions-estates-handover.md` and `docs/gear-directory-plan.md`.
- The code: `src/app/**` (all 53 `page.tsx` and every route handler), `src/components/{layout,coffees,roasters,discovery,homepage,search,tools,onboarding,dashboard,blog}`, `src/lib/{filters,discovery,seo,data,sanity,glossary}`, `src/hooks`, `src/types/supabase-types.ts`, `supabase/migrations`, `next.config.ts` and `package.json`.

**Evidence legend.**
- **K** — known. Read in code at the cited path. Line numbers are as of commit `1ce8d8b`.
- **D** — stated in a repo document. Dated; not re-verified against live data.
- **U** — unverified or inferred. Treat as a lead, not a fact.

**Constraints observed.**
- No application code, CSS, schema, routes, Penpot files or existing docs were modified. The only files written are this one and the traceability file.
- The live database was queried **read-only** (SELECT only) through `supabase db query --linked` against project `fnpsnzqedznsgzxjsowe` on 2026-11-07. Those figures are tagged **L** and collected in §10.0. No coffee field or stock value is invented.

**L** = live database count, 2026-11-07.
**S** = ops-workspace analytics snapshot (`../icb-claude`, GSC, GA4, PostHog, Clarity and PageSpeed, fetched 2026-10-26 to 2026-11-06). Only existing snapshots were read; no APIs were re-called. Sanity schema read from `../studio-icb`.

---

## 1. Top findings

1. **The "expert path" is largely built, and it is ahead of its own ADR.**
   - `/coffees` filters are **instant**, with no Apply button. State lives in the URL. **K** — `src/hooks/use-coffee-filters.ts:41-43`, `src/components/coffees/CoffeeFacetedFilterBar.tsx:258`.
   - ADR-006 still prescribes an Apply button and Zustand. The ADR is stale; the redesign's intent matches the live code.
2. **URL state uses `history.replaceState`.** Browser Back does not step back through filter states, and the page title and metadata do not change with filters. **K** — `use-coffee-filters.ts:27-31,41`. This is the main gap against "back without losing context" (02, 08 acceptance metrics).
3. **Global search exists, but it searches only coffees and roasters.** It is a Cmd/Ctrl+K command palette on every `(main)` page, backed by the Supabase RPC `search_directory`. It does not search Learn articles, the glossary, regions, tools or estates. **K** — `src/types/search.ts:5`, `src/hooks/use-search-directory.ts:30`.
4. **There is no "Guide me" path for anonymous visitors.** The only guided-to-filters flow is the post-signup onboarding wizard. It asks experience level, brew methods, milk and decaf, then redirects to a prefiltered `/coffees`. **K** — `src/components/onboarding/onboarding-wizard.tsx:75-110,617-725`. Coffee Compass is a brew-extraction troubleshooter, not a taste guide. **K** — `src/components/tools/CoffeeCompassClient.tsx:87-100`.
5. **Catalogue and editorial are almost disconnected.**
   - No coffee, roaster or region page pulls a Sanity article.
   - Articles reach the catalogue only through embedded spotlight and collection blocks, and the link runs one way. **K** — `src/components/blog/ArticleContent.tsx:59-72`. A reverse lookup is possible from existing data (§11).
   - The one hard link is `/regions` → `/learn/coffee-regions-of-india-complete-guide`. **K** — `src/app/(main)/regions/page.tsx:357`.
   - This is the largest structural gap against "Let me explore" and "serendipity grounded in real relationships".
6. **Several proposed objects have data but no page.**
   - Estates have data, a filter facet and an API, but no page. The nav shows "Estates — Coming Soon" as a disabled item. **K** — `src/components/layout/header.tsx:85-90`. **15 estates already pass the ADR-013 gate (L)**, so this is no longer blocked on content.
   - Varieties are a text array with no table, facet or page.
   - Flavour notes have a canonical taxonomy (`canon_sensory_nodes`) and a facet, but no page.
   - Gear has tables but no route.
7. **Personalization infrastructure exists but is unused for ranking.** `user_taste_profile_cache` and the `user_recommended_coffees` view exist in the database. No code in `src/` reads either one. **K** — grep returns zero hits outside the generated types.
8. **The homepage is already personalised by segment.** It has five hero segments driven by auth state, rating count and recently viewed coffees. **K** — `src/lib/data/fetch-hero-segment.ts:50-67`. A "recognised returning visitor" moment therefore exists in a basic form.
9. **The SEO surface is large and rule-dense.**
   - 42 static landing pages. **K** — counted in `src/lib/discovery/landing-pages/*-pages.ts`.
   - Bespoke canonical and noindex logic for filtered and paginated listings.
   - Per-template JSON-LD.
   - Any template rebuild must carry all three (§13).
10. **No 3D, WebGL, GSAP or Lenis is in the stack.** Motion is `motion` v12 in about 20 files, the `Reveal` primitive in 11 files, Lottie, a lazy hero video, and a View Transitions theme toggle. Reduced motion is handled throughout. **K** — `package.json:86-87`.

---

## 2. Reconciliation: exploration vs production rules

These conflicts are flagged for the owner, not resolved here. Production rules remain in force (09, 07).

| # | Redesign says | Production rule / reality | Severity | Suggested resolution path |
|---|---|---|---|---|
| C1 | Expert facets apply instantly with URL state (02, 06) | ADR-006 requires an **Apply** button and Zustand. The live code is instant and URL-driven (**K**, §7). | Low (doc drift) | Supersede ADR-006 to match the shipped behaviour. No UX conflict. |
| C2 | **Regions** are a canonical object with linked estates and profiles (02) | ADR-013 allows a `/regions` **hub only**. The region profile *is* `/coffees/<region-slug>` (12 configured). Region page slugs are not canon slugs. | Medium | Treat `/coffees/<region-slug>` as the region object page in the screenplay. Any `/regions/<slug>` needs a new ADR and a URL-equity plan. |
| C3 | Estates have pages "when actually available" (02) | ADR-013 permits `/estates/<slug>` only through the gate `country='India' AND description IS NOT NULL AND coffee_count >= 3`. **15 estates pass today (L)**. The handover's "blocked on content" (2026-09-11) is out of date. | Medium | Estate pages are now buildable without breaking ADR-013. The screenplay may use those 15 and must not mock rich estate content for the rest. |
| C4 | Expressive depth, 3D and camera movement (03, 05) | DESIGN.md: "Depth comes from **tonal paper layers**, not from glass or drop shadows". Motion vocabulary is `Reveal` (opacity + 24px rise, `ease-out-expo`, 0.6s) and image hover-zoom. **The Flat-Paper Rule** applies. | **High** | Any 3D or depth language is a brand change and needs an ADR (07 change-management rule). Penpot keyframes should show a paper-native depth alternative alongside any 3D one. |
| C5 | Creative north star: hospitality in an opera-house café (01) | DESIGN.md north star: **"The Coffee Field Guide"**. PRODUCT.md: "refined, confident, editorial … quiet authority". | Medium | The two north stars are compatible (expert host ≈ expert guide), but there should be one. The ADR should state whether "hospitality" is a behavioural layer over the field guide or replaces it. |
| C6 | One evolving visual environment (03) | **The One Smear Rule**: terracotta accent on one phrase per page. One accent, one radius, one theme per page. No third emphasis language. | Medium | A scene metaphor must not introduce a second accent or emphasis system without an ADR. |
| C7 | Newcomer: "atmospheric but fast welcome" (02) | The homepage has 14 stacked sections (§4.3). PRODUCT.md and DESIGN.md already reject "stacks of interchangeable card grids". | Aligned | Both rule sets point the same way. The current homepage violates both, which is an opportunity, not a conflict. |
| C8 | 09 suggests creating root `AGENTS.md` and adding a pointer in `CLAUDE.md` | 09's own initial task says "do not edit … existing product/design docs" | Process | **Not done.** Owner to approve. Both are one-line edits outside this folder. |
| C9 | 04 asks to "respect … 3-free-ratings/login gate if still active" | **Still active.** `ANON_LIMIT_REACHED` after 3 distinct entities. **K** — `src/app/actions/reviews.ts:273-278`, `src/components/reviews/QuickRating.tsx:139`. | Info | Personalization design must work within this gate. |
| C10 | 05 lists Fuse.js in the stack (via CLAUDE.md) | Search is now the Supabase RPC `search_directory` (FTS + pg_trgm). The Fuse.js index was removed. **K** — `use-search-directory.ts:13-15`. | Low (doc drift) | See §18. |

---

## 3. Route inventory (public)

Indexability is taken from page metadata, robots and sitemap (§13). The internal and public APIs, webhooks and crons are listed in `src/app/api/**` and are out of scope for UX.

| Route | Purpose | Object | Indexable | In sitemap |
|---|---|---|---|---|
| `/` | Homepage, personalised hero | — | yes | yes |
| `/coffees` | Coffee directory with instant facets | Coffee | bare and `?page=N` yes; any filter → noindex, canonical `/coffees` | yes |
| `/coffees/[slug]` | **Discovery landing page** (42 configs). This is *not* coffee detail. **K** — `src/app/(main)/coffees/[slug]/page.tsx:14-37` | Brew method, roast, process, price, region, species | yes | yes |
| `/roasters` | Roaster directory | Roaster | as `/coffees` | yes |
| `/roasters/[slug]` | Roaster detail, including its coffee grid | Roaster | page 1 only | yes |
| `/roasters/[slug]/coffees` | Permanent redirect to `/roasters/[slug]` | — | — | no |
| `/roasters/[slug]/coffees/[coffeeSlug]` | **Canonical coffee detail.** **K** — `src/lib/utils/coffee-url.ts:9` | Coffee | yes | yes |
| `/roasters/[slug]/badges` | Badge embed kit for roasters | — | noindex | no |
| `/roasters/partner`, `/roasters/terms` | Roaster acquisition and terms | — | yes | yes |
| `/regions` | Regions hub: map, state groups, `RegionCard` plates | Region | yes | yes |
| `/learn`, `/learn/page/[page]` | Article index | Article | yes | `/learn` only |
| `/learn/[slug]` | Article (Sanity) | Article | yes, unless Sanity `noIndex` | yes |
| `/learn/category/[slug]`, `/learn/series`, `/learn/series/[slug]` | Editorial groupings | Article | yes | yes |
| `/learn/author/[slug]` | Author profile | Person | yes | **no** |
| `/learn/glossary` | Glossary, from local `glossary.md` (not Sanity) | Glossary | yes | yes |
| `/learn/insights` | Data insights | Report | yes | **no** |
| `/tools`, `/tools/{coffee-calculator,coffee-compass,expert-recipes,grind-size-converter}` | Utilities | Tool | yes | yes, except grind converter (**U**) |
| `/curations`, `/curations/[slug]` | Curator lists (real data) | Community | yes | yes |
| `/communities` | Directory of external community groups (real data) | Community | yes | yes |
| `/profile/[username]` | Public member profile | Person | apparently yes (**U**) | no |
| `/profile`, `/profile/anon` | Redirect and anonymous profile | — | noindex | no |
| `/dashboard/*` (8 pages) | Signed-in area: profile, preferences, wishlist, my reviews, notifications, privacy, developer | Personalization | robots-disallowed | no |
| `/auth/*` | Auth and two-step onboarding | — | robots-disallowed | no |
| `/about`, `/contact`, `/press`, `/how-icb-works`, `/newsletter`, `/newsletter/[date]`, `/privacy`, `/terms`, `/data-deletion`, `/developers` | Company, trust and legal pages | — | yes | yes, except `/developers` (**U**) |
| `/go/roaster/[slug]`, `/go/coffee/[slug]/[coffeeSlug]` | 302 redirect for badge click-tracking. **Not** used by the buy button. | — | not blocked | no |

**Missing routes relative to the 02 objects:** `/estates` and `/estates/[slug]` (planned, gated by ADR-013), variety pages, flavour pages, `/gear` (planned in `docs/gear-directory-plan.md`, not built), a compare view, and Learn search. ADR-002 says `/learn?q=`, but no `searchParams` handling was found in `src/app/(main)/learn/page.tsx` (**U** for any client-side search elsewhere).

---

## 4. Navigation and entry points

### 4.1 Global chrome
- **Shell.** Layouts nest as root → `(main)/layout.tsx:33-60`: announcement banner, skip link, `Header`, `<main id="main-content">`, `Footer`, lazy `SearchCommand` and `CookieNotice`. **K**
- **Header nav.** **K** — `src/components/layout/header.tsx:76-114`.
  - **Profile**: `/profile` when signed in, `/profile/anon` when not.
  - **Explore**: Coffees, Roasters, Communities, *Estates (disabled, "Coming Soon")*, Regions.
  - **Learn**: Articles, Series, Glossary.
  - **Tools**: All tools plus the four tools.
  - Actions: a Search button with a ⌘K hint; "For Roasters" and "Login" when signed out; an avatar menu when signed in.
- **Latent defect.** The Explore parent has `link: "/explore"`, and that route does not exist. Desktop renders the parent as a button and mobile renders only the child links, so no user reaches a 404 today. **K** — `resizable-navbar.tsx`, `header.tsx:353-368`. A redesign that makes nav parents clickable would expose it.
- **Footer.** **K** — `src/components/layout/Footer.tsx`.
  - Discover: coffees, roasters, communities.
  - Learn: three links.
  - Tools: four links.
  - Company: six links.
  - Newsletter, founder links, legal and social.
  - `/regions` and `/curations` are missing from the footer; `/curations` is in neither the header nor the footer.
- **Mobile.** A hamburger opens a sheet with the same groups. There is a search icon and dashboard links for signed-in users. No bottom bar. **K** — `header.tsx:317-460`.

### 4.2 Search
- **Coverage.** The `SearchCommand` palette (cmdk) is mounted once for all `(main)` pages and opens with ⌘/Ctrl+K, the header button or the hero search. **K** — `src/hooks/use-search.ts:57-76`, `src/components/homepage/HeroSearch.tsx:91-97`.
- **Engine and scope.** RPC `search_directory(q, lim=25)`, using FTS plus trigram, minimum 2 characters. Scope is **coffee and roaster only**. **K** — `supabase/migrations/20260701120000_search_directory_substring_match.sql`.
- **No facet handoff.** Search does not pass filters into the directory. Inside the directory, `q` is a separate name-only `ilike`. **K** — `src/lib/data/fetch-coffees.ts:161`. There are two search behaviours with different semantics.

### 4.3 Homepage (render order)
**K** — `src/app/(main)/page.tsx`.
1. **Hero.** **K** — `src/components/homepage/hero/HeroControl.tsx:20-46`, `HeroContextPanel.tsx:40-47`.
   - Lazy video and a context panel with search.
   - Quick chips: Light, Medium, Dark, V60, AeroPress, "Fruity" (`/coffees?q=fruity`) and "Under ₹500" (`/coffees/budget`).
   - CTAs, a stats strip and a new-additions ticker.
2. Top Rated
3. Fresh From Community
4. New Arrivals
5. "How do you like your Coffee?" collection grid
6. Discovery accordion: roast, brew, process and origin pills
7. How It Works
8. Top Profiles
9. Roaster Infrastructure
10. Education, linking to `/learn`
11. Curator Spotlight
12. Testimonials
13. FAQ
14. CTA

**Personalization.** Five hero segments: `discovery`, `returning_browser`, `rating_progress`, `anon_conversion` and `authenticated_profile`. They drive the greeting, recently viewed coffees, rated coffees and a "continue last viewed" CTA. **K** — `src/lib/data/fetch-hero-segment.ts:50-67`, `src/components/homepage/hero/HeroCTAs.tsx:110`.

### 4.4 Breadcrumbs
- **Visible breadcrumbs.** Rendered only on discovery landing pages, `/learn/author/[slug]` and `/learn/category/[slug]`. **K** — `src/components/discovery/DiscoveryLandingLayout.tsx:276-297`.
- **Schema only.** Coffee detail, roaster detail and articles emit `BreadcrumbList` JSON-LD. A visible trail on those pages is **U**; grep found no visual breadcrumb import.

### 4.5 Dead ends and recovery
- The global 404 offers Home, `/coffees` and `/roasters` plus a Lottie animation. It has **no search**. **K** — `src/app/not-found.tsx`.
- Empty directory results show "No coffees match these filters" and a "Clear all filters" button. It offers no "relax one facet" suggestion. **K** — `src/components/coffees/CoffeeGrid.tsx:45-55`.

---

## 5. Journeys: what exists today

| Journey (02) | What works today | Breaks or gaps |
|---|---|---|
| **Newcomer** | Hero chips map vocabulary to landing pages. Landing pages explain each concept: brew params, roast scale, process explainers, region overviews. Glossary and Learn exist. | No guided or mood entry for anonymous visitors. Chips assume vocabulary (roast or brewer). "Why this coffee" exists nowhere. The homepage is 14 sections long. The path from coffee to story (article, estate) is missing (§11). |
| **Expert** (20-second target) | `/coffees` offers 15+ facets, instant updates, shareable URLs, seven sorts, and active-filter chips. ⌘K search. Coffee detail exposes process, roast, region, species and brew methods as links to landing pages. | Back does not undo a filter (`replaceState`). Facet counts are static, so options can lead to zero results. There is no variety, altitude or flavour-family facet, no compare view, and no saved search. Desktop shows only three primary facets; the rest sit behind "Refine". Mobile facets are in a left sheet. |
| **Organic deep link** | Coffee, roaster, landing and article pages are server-rendered with h1, canonical and JSON-LD (§13). Landing pages carry FAQ, related links and curated `learnLinks`. | No visible breadcrumbs on coffee or roaster detail. Coffee detail has no editorial or contextual "universe" links beyond the landing-page links and similar coffees. Estate names are plain text. |
| **Returning** | Hero segments, recently viewed (DB `coffee_views`, anonymous or user), wishlist, a preferences form, my reviews, public profile with taste profile, gear station and selections. | Saved preferences are not used to rank anything (the onboarding redirect is the only consumer). There is no "last discovery context" (filters are not remembered). There is no new-since-last-visit view. |

---

## 6. Mapping to the three intent paths

| Intent path | Existing features that serve it | Strength | Missing |
|---|---|---|---|
| **Guide me** | Onboarding redirect (signed-in only); "How do you like your coffee?" grid; landing-page explainers; glossary; Coffee Compass (brew troubleshooting, not taste guidance) | Weak | Anonymous, optional, progressive taste prompts; reasons attached to suggestions; a mood-to-attributes mapping, which has no data model today |
| **I know my coffee** | `/coffees` facets plus URL state; ⌘K; sorts; landing pages as facet shortcuts; landing → "See all" handoff with the filter preserved (`CoffeeGridTeaser.tsx:44-45`) | **Strong** | History-aware URL state; live facet counts; variety, altitude and flavour-family facets; compare; saved searches |
| **Let me explore** | `/learn` (articles, series, categories, authors); `/regions` map hub; region landing pages; curations; insights; similar coffees; landing `RelatedLinks` and `LearnLinks` | Medium on content, weak on connection | Reverse links from catalogue to editorial; estate and variety pages; relationship-typed links ("grown at", "processed using"); search across editorial content |

---

## 7. Filter system (coffee directory)

| Aspect | Current state | Evidence |
|---|---|---|
| Apply model | Instant. Text search debounced; commits on Enter or blur | **K** — `CoffeeFacetedFilterBar.tsx:69-126,258` |
| URL as state | Yes. Parser and builder in `src/lib/filters/coffee-url.ts:137-270` and `:300-401` | **K** |
| History | `replaceState`, so each change does not create a history entry | **K** — `use-coffee-filters.ts:41-43` |
| Data | `coffee_directory_mv` via `/api/coffees` + TanStack Query (staleTime 60s); server cache 24h | **K** — `src/lib/data/fetch-coffees.ts:756-762` |
| Facets | `roastLevels`, `processes`, `brewMethodIds`, `beanSpecies`, `regions`, `estates`, `roasters`, `flavors` (canonical flavour slugs), `statuses`, `minPrice`/`maxPrice`, plus toggles: in stock, 250g, decaf, single origin, international, works with milk | **K** — `coffee-url.ts` |
| URL-only (no UI) | `limitedOnly`, `hasSensoryOnly`, `coffeeIds` | **K** / **U** for the sidebar |
| Sort | `newest` (default), `relevance` (actually A–Z), `price_asc`, `price_desc`, `best_value`, `rating_desc`, `name_asc` | **K** — `coffee-url.ts:17-29,80-93` |
| Facet counts | Shown but **static**. The filtered-meta RPC exists but is not used by the page. | **K** — `CoffeeFacetedFilterBar.tsx:143-144`; `src/app/(main)/coffees/page.tsx:246-250` |
| Layout | Desktop: three primary multi-selects plus a "Refine" panel and chips. Mobile: a left `Sheet` with Reset and no Apply. | **K** |
| Paging | 15 per page, numbered pagination | **K** |
| Missing facets | Variety, altitude, flavour family (`family` exists in the data), crop year or harvest | **K** |
| Multi-select semantics | OR within roast and process (`.in`). Other arrays not checked. | **K** / **U** |

`/roasters` uses the same pattern: instant, `replaceState`, and facets for city, state, country and active. `region-url.ts` and `estate-url.ts` are used only by unused hooks and APIs; no page UI consumes them. **K**

---

## 8. Discovery landing pages

- **42 configs**, all single-dimension, in one flat namespace `/coffees/<slug>`. **K** — `src/lib/discovery/landing-pages/index.ts:30-45`, `paths.ts:17-27`.

  | Type | Count | Slugs |
  |---|---|---|
  | Brew method | 9 | aeropress, v60, chemex, kalita, french-press, espresso, cold-brew, moka-pot, filter-coffee |
  | Roast level | 5 | light-roast … dark-roast |
  | Price bucket | 4 | budget, mid-range, under-1000, premium |
  | Process | 5 | natural, washed, honey, anaerobic, monsooned-malabar |
  | Region | 12 | chikmagalur, baba-budangiri, coorg, araku, nilgiris, shevaroy-hills, wayanad, koraput, northeast-india, sakleshpur, palani-hills, biligiriranga-hills |
  | Bean type | 7 | arabica, robusta, liberica, excelsa, blends, chicory-mixes, single-origin |

- **Anatomy.** **K** — `src/components/discovery/DiscoveryLandingLayout.tsx`.
  - Breadcrumb, h1 from config, intro.
  - A type-specific profile.
  - A **12-coffee teaser**, in stock only, rather than the full grid.
  - Recipe, roast scale, value tips or roaster sourcing, depending on type.
  - `UtilityCard`, `LearnLinks` (curated hrefs in config), FAQ, and `RelatedLinks` (static slugs plus nearby regions).
- **Handoff.** "See all" goes to `/coffees?<filter>`. The landing filter carries over; the stock filter does not. **K** — `src/components/discovery/CoffeeGridTeaser.tsx:44-45`.
- **Region slugs** bridge to canon via `filter.region_slugs[]` (CLAUDE.md, ADR-013). The handover documents that counts roll up `parent_id`. **D**
- **Phantom file.** `discovery-pages.json` is referenced in `src/app/sitemap.ts:41`, ADR-013 and the handover, but **does not exist**. The sitemap uses `getAllLandingPageSlugs()`. **K**
- **Combinations are not landing pages.** "V60 + natural + light + region" exists only as a noindexed query URL. Whether any combination deserves an indexable page is an SEO decision (§19).

---

## 9. Detail-page anatomy

### Coffee detail
`/roasters/[slug]/coffees/[coffeeSlug]` renders `src/components/coffees/CoffeeDetailPage.tsx`. **K**

**Sections, in order:**
1. Scrollspy tabs
2. `CoffeeHero`: name, roaster link, wishlist, buy
3. Story and production details
4. Flavour: sensory profile and tasting-note tags
5. Pricing and availability (`CoffeeVariantSelector`)
6. Rate and review (up to 10 reviews)
7. FAQ
8. More from roaster
9. Similar coffees (4)
10. Exit-intent rating modal and floating rate CTA

**How relationships render:**

| Relationship | Render |
|---|---|
| Roaster | Link (`CoffeeHero.tsx:143-148`) |
| Roast, process, region and sub-region, species, brew methods | `DiscoveryInlineLink`: links to `/coffees/<slug>` **only if a landing page exists**, otherwise plain text (`CoffeeDetailPage.tsx:81-99`). For example, a coffee from an unconfigured region gets no link. |
| Estate | Plain text, comma-joined (`:275-276`) |
| Variety | Text with tooltip from a code file (`src/lib/coffee/variety-info`) |
| Flavour notes | `Tag`s, not links (`:453`) |
| Altitude | Fetched but **not rendered** (`src/lib/data/fetch-coffee-by-slug.ts:98,244`) |
| Buy | `direct_buy_url`, `target=_blank`, `rel="noopener noreferrer"`. No `/go` tracking hop. |
| Similar | RPC `get_similar_coffees`: flavour overlap ×10 + roast 5 + process 5 + origin 3 − same roaster 2. Requires at least 1 flavour overlap. **K** — `supabase/migrations/20260128000002_fix_get_similar_coffees_rpc.sql:110-135` |
| Articles, glossary | **None** |

### Roaster detail
**K** — `src/components/roasters/RoasterDetailPage.tsx`. Sections: hero (site and social links), about, coffee grid with breakdown and pagination, reviews, similar roasters (`roaster_similar` view), partner CTA, badges link, FAQ. No editorial links.

---

## 10. Object and relationship coverage

### 10.0 Live catalogue snapshot (**L**, 2026-11-07)

"Public" means `coffees.status IN ('active','seasonal')`.

| Measure | Value | Note |
|---|---|---|
| Public coffees | 1,688 | |
| Rows in `coffee_directory_mv` | 2,180 | active 1,651 · discontinued 527 · coming_soon 2. The MV carries discontinued coffees, so directory defaults decide whether they show (**U**). |
| Active roasters | 122 | |
| `canon_regions` | 96 total · 49 India · 11 India at `tier='region'` | The handover said 46 international (**D**). Consistent. |
| `canon_estates` | 186 total · 33 with description | The handover said 187 and 179 without description (**D**, 2026-09-11). Content has grown since. |
| Estates passing the ADR-013 gate (India, description, ≥ 3 public coffees) | **15** | 61 estates have ≥ 3 public coffees regardless of description. |
| Public coffees with a region link | 1,275 (76%) | |
| Public coffees with an estate link | 918 (54%) | Joined via legacy `estates.canon_estate_id`; all 1,263 `coffee_estates` rows resolve that way. |
| Public coffees with flavour notes | 1,483 (88%) | |
| Public coffees with brew methods | 1,149 (68%) | |
| Public coffees with `varieties` | 709 (42%) | Text array only |
| Sensory taxonomy | 344 nodes · 15 families | |
| Reviews | 397 | |
| Wishlist rows | 39 | |
| Users with saved preferences | 49 | |
| Curators | 1 | |
| Communities | 19 | |
| Gear catalogue items | 75 | |

**What this means for the screenplays.**
- Region (76%) and flavour (88%) coverage are strong enough to anchor "explore" and "guide me" moments on real data.
- Estates now have a real but small shippable set (15).
- Varieties cover under half the catalogue, so a variety page or facet would be visibly patchy.
- Personalization usage is tiny: 49 preference rows and 39 wishlist rows. Personalization moments should be designed as light and optional, not as the spine.
- Curations are a single curator, so community depth is thin.

### 10.1 Objects (02 vs reality)

| Object | Data | Public page | Directory facet | Linked from coffee | Gap |
|---|---|---|---|---|---|
| Coffee | `coffees`, `variants`, `prices`, `coffee_images`, `coffee_directory_mv` | ✅ | — | — | — |
| Roaster | `roasters`, `roaster_members`, `roaster_similar` | ✅ | ✅ `roasters` | ✅ | — |
| Region | `canon_regions` (`tier`, `parent_id`, area with source), `coffee_regions(pct)`. 96 rows, 49 in India (**L**). | Hub plus 12 landing pages (ADR-013) | ✅ `regions` | ✅ if a landing page exists | 37 India regions have no landing page or link |
| Estate | `canon_estates`, `coffee_estates(pct)` via legacy `estates`, `get_estate_detail` RPC wired in `src/lib/data/fetch-estate-by-slug.ts`. 186 estates, 33 with a description (**L**). | ❌ (nav "Coming Soon") | ✅ `estates` | ❌ text | **15 pass the ADR-013 gate now.** UI not built. |
| Variety | `coffees.varieties text[]` (42% of public coffees, **L**); region and estate `primary_varieties text[]`. **No table.** Not in the MV. | ❌ | ❌ | ❌ tooltip | Needs a data model and coverage before any page |
| Flavour notes | `flavor_notes`, `coffee_flavor_notes`, canonical taxonomy `canon_sensory_nodes` (family > subcategory > descriptor), `sensory_params` | ❌ | ✅ `flavors` (descriptor level) | ❌ tags | Pages or family facet possible from existing data |
| Process | `process_enum` (12 values) | 5 landing pages | ✅ | ✅ when configured | 7 enum values without a page |
| Roast level | `roast_level_enum` (5) | 5 landing pages | ✅ | ✅ | — |
| Brew method | `brew_methods`, `coffee_brew_methods` | 9 landing pages | ✅ | ✅ | — |
| Species | `species_enum` (14) | 7 landing pages | ✅ | ✅ | — |
| Articles | Sanity: `article`, `category` (pillar), `series`, `author`. Schemas in `../studio-icb/schemaTypes`. 96 articles have dates in the 2026-11-02 snapshot (**D**). | ✅ `/learn/*` | — | ❌ | No reverse link (embeds exist, §11) |
| Glossary | Local `glossary.md` (`src/lib/glossary/server.ts`) | ✅ | — | ❌ | Not linked from catalogue terms |
| Reports | `/learn/insights` (catalogue stats) | ✅ (not in sitemap) | — | — | — |
| Tools | Code only | ✅ 4 tools | — | ❌ | Tools don't hand off to filtered coffees |
| Community | `reviews` (coffee and roaster), `curation_*`, `curators`, `communities` (external groups) | Curations, communities, profiles | ❌ | Reviews embedded | No discussions (none exist) |
| Personalization | `wishlists`, `user_coffee_preferences`, `user_profiles` (experience, brew methods), `user_coffees` (logged/brewing/finished/rated), `user_gear`, `coffee_views`, `user_taste_profile_cache`, `user_recommended_coffees` | Dashboard, profile | — | Wishlist button | **No "disliked"**; recommendations not wired |
| Gear | `gear_catalog`, `gear_merchants`, `gear_offers`, `user_gear` | ❌ (plan only) | — | ❌ | Not linked to coffees |

### 10.2 Semantic relationships (02)

| Relationship | Support | Evidence |
|---|---|---|
| grown at | **Data.** FK and joins: `coffee_regions` and `coffee_estates` (with `pct`), `canon_estates.canon_region_id`, `canon_regions.parent_id` | **K** |
| roasted by | **Data.** `coffees.roaster_id` | **K** |
| processed using | **Data.** Enum column plus `process_raw` | **K** |
| related variety | **Text only.** No variety entity, no variety-to-variety relation | **K** |
| tastes of | **Data.** `coffee_flavor_notes` → `flavor_note_to_canon` → `canon_sensory_nodes`; `sensory_params` with `source` and `confidence` | **K** |
| can be brewed with | **Data.** `coffee_brew_methods`. Gear-to-brew is text only (`gear_catalog.brew_methods`) | **K** |
| featured in | **Partial.** Curations reference coffee and roaster IDs. Articles reference catalogue objects only through spotlight blocks inside the body; GROQ has no queryable relation. | **K** |
| reviewed by | **Data.** `reviews.user_id`/`anon_id` with polymorphic `entity_id` | **K** (hard FK **U**) |
| similar to (extra) | **Computed.** `get_similar_coffees`, `roaster_similar` | **K** |

**Evidence quality for "known vs inferred" (02, 04).** `sensory_params` carries `source` and `confidence`. Areas require `area_source` and `area_as_of` (enforced in the database). Similarity is computed and should be labelled *inferred*. Spotlight blocks are *editorial*. The data already supports the three-way labelling that 02 asks for.

---

## 11. Editorial ↔ catalogue

- **Imports.** No file under coffee, roaster or region code imports `@/lib/sanity`. **K** — grep.
- **GROQ.** Nothing in `src/lib/sanity/queries.ts` filters by coffee, roaster, region, process or variety. **K**
- **Article → catalogue.** One direction only, through Portable Text blocks, all rendered by `src/components/blog/ArticleContent.tsx:59-72`. **K**
  - Spotlight blocks: `coffeeSpotlight`, `roasterSpotlight` and `regionSpotlight`, each holding a single ID.
  - Collection blocks: `coffeeCollection` (manual by ID, or dynamic by roast, bean type, process, regions, roasters or brew method), `roasterCollection` and `regionCollection`.
  - `dataChart`, filterable by region, brew method or process.
  - All are defined in `studio-icb/schemaTypes/objects/*` (**K**) and fetched client-side.
- **Article top-level fields** (`studio-icb/schemaTypes/article.ts`). **K**
  - References only `author`, `category` (plus `topics[]` → category) and `series`.
  - `tags` is a free-text string array; `brewingMethod` and `equipment` are strings.
  - **No top-level reference to any catalogue object.**
- **Landing → article.** Landing pages link to articles through hand-curated `learnLinks`. **K**
- **A reverse lookup is possible today without a schema change.** GROQ can find the articles that embed a given coffee, roaster or region inside `body[]`, e.g. `*[_type=="article" && $id in body[_type=="coffeeSpotlight"].coffeeId]`. Dynamic collections, `tags` and `brewingMethod` could also be matched against landing-page facets. Coverage depends on how many articles embed blocks; not counted (**U**).
- **Implication for "Let me explore".** Editorial adjacency can start from existing embeds with no schema change. Typed, editor-curated relations ("featured in", "about this region") would need new reference fields in `studio-icb`, which requires approval (05).

---

## 12. Personalization and trust

| Signal | Anonymous | Signed in | Used for ranking? |
|---|---|---|---|
| Ratings and reviews | ✅ `anon_id`, **3-entity cap** | ✅ | Feeds aggregates and hero segment only |
| Recently viewed | ✅ `coffee_views` (cookie anon id) | ✅ | Hero "continue" CTA, dashboard |
| Wishlist | ❌ | ✅ | No |
| Preferences (roast, process, region, flavour, decaf, organic, milk) | ❌ | ✅ | **No.** Form only. |
| Experience level and brew methods | ❌ | ✅ (onboarding) | Only for the one-time onboarding redirect |
| Gear | ❌ | ✅ | No |
| Coffee log (`user_coffees`) | ❌ | ✅ | No |
| Disliked | — | — | **Not present** |
| Taste cache and recommendations view | — | DB only | **Unused by the app** |

- **Merge on login.** `merge_coffee_views_for_anon` then `merge_reviews_for_anon`. **K** — `src/app/actions/post-login-anon-merges.ts`; **D** — `docs/auth.md:177-200`.
- **Consent.** Analytics is opt-out and marketing is opt-in. `src/lib/consent.ts` is the source of truth (ADR-012). Any new behavioural signal must route through it.

---

## 13. SEO baseline (code only)

- **Global.** Organization and WebSite (with SearchAction) JSON-LD in `src/app/layout.tsx:152`. Each sitemap entry carries self hreflang `en` and `x-default`. The helper `generateMetadata` in `src/lib/seo/metadata.ts:223` builds canonical, robots and OG (`/api/og`) for every template.
- **Listing canonicals.** **K** — `src/app/(main)/coffees/page.tsx:96-134`, `src/app/(main)/roasters/page.tsx:97-126`.
  - `/coffees` and `/roasters`: any non-`page` param → `noindex, follow`, canonical to the bare path.
  - `?page=N` → self-canonical and indexable.
- **Roaster pagination.** Page 2 and up is noindex. **K**
- **Per-template JSON-LD.**

  | Template | JSON-LD |
  |---|---|
  | Coffee detail | Product (Brand, Offer, AggregateRating) + BreadcrumbList + FAQPage |
  | Roaster | LocalBusiness + BreadcrumbList + FAQPage |
  | Landing | CollectionPage + BreadcrumbList + FAQPage |
  | Article | BlogPosting + BreadcrumbList, plus FAQ, HowTo or Recipe conditionally |
  | `/regions`, `/learn`, curations, communities | CollectionPage |
  | Tools | HowTo (calculator, recipes, converter) |

- **h1.** One h1 per template, owned by a shared component: `PageHeader.tsx:58`, `CoffeeHero.tsx:138`, `RoasterHero.tsx:150`, `ArticleHeader.tsx:78`. **K**. The homepage h1 location is **U**.
- **Sitemap families.**
  - Static: core pages, 42 landing pages and newsletters.
  - Database, through the service-role client: active or seasonal coffees with `is_coffee IS NOT FALSE`, active roasters, curators.
  - Sanity: articles, categories and series.
  - Excluded: estates, author pages, insights, `/learn/page/N`, profiles. **K** — `src/app/sitemap.ts`.
- **Non-production noindex.** `next.config.ts:231` applies `X-Robots-Tag: noindex` to everything when `VERCEL_ENV !== "production"`. **K**
- **URL-equity history.** About 25 permanent redirects in `next.config.ts:85-181`: legacy price, brew and roast slugs → `/coffees/<slug>`, and region aliases (kodagu, chikkamagaluru and others) → canonical landing slugs. Any IA change must keep these chains one hop long. `/budget-coffee` is declared twice (:101, :141).
- **robots.** Disallows `/dashboard/`, `/api/` (re-allows `/api/coffees` and `/api/roasters`) and `/auth/`. Does not block `/go/*` or `/badges/*`. Outbound buy links carry no `nofollow` or `sponsored` (ICB does not sell, so this is likely intentional; **U**).
- **Risks a redesign could break.**
  - Config-owned h1, FAQ, `related` and `learnLinks` on landing pages.
  - The bespoke canonical and noindex rules inside the two listing `page.tsx` files.
  - JSON-LD assembled inside page files.
  - h1 ownership in shared hero components.

---

## 13a. Traffic and behaviour baseline (from `../icb-claude`)

**Sources.** All read-only from the ops workspace; nothing re-fetched.
- `content/data/snapshots/latest-search-data.json`: GSC + GA4 + PostHog, fetched 2026-11-02, window 2026-08-01 → 2026-10-30.
- `latest-posthog-product.json`: fetched 2026-11-06, window 2026-08-08 → 2026-11-06.
- `seo/ux/2026-10-26-clarity-triage.md`.
- `seo/cache/pagespeed/*.json`.

These are tagged **S** (snapshot) below.

**Totals, 91 days.** **S**
- GSC: 5,545 clicks, 381,625 impressions, CTR 1.45%, average position 8.3.
- The last 28 days are up against the prior 28: 2,221 vs 1,755 clicks.
- GA4: 17,678 sessions and 13,896 users.

**Channels.** **S**
- Organic Search 8,274 and Direct 8,043 sessions, roughly equal.
- AI Assistant 948 sessions; this channel fell 36% over the last 28 days.
- Organic Social 350.

**Devices (GSC clicks).** **S** Mobile 3,632 · desktop 1,858 · tablet 55. Mobile is **66%**.

**Indexing.** **S** 1,305 sitemap URLs.
- Of 2,130 URLs inspected: 1,686 indexed, 178 crawled-not-indexed, 100 discovered-not-indexed.

**Organic clicks by template.** Covers the top 100 pages, which account for 3,624 of 5,545 clicks. Template classification is mine. **S**

| Template | GSC clicks | Impressions | Pages in top 100 | GA4 landing sessions | Engaged rate |
|---|---|---|---|---|---|
| Discovery landing `/coffees/<slug>` | 1,034 | 81,019 | 25 | 2,511 | 0.47 |
| Article `/learn/<slug>` | 919 | 80,312 | 20 | 2,314 | 0.40 |
| Roaster detail | 537 | 49,035 | 23 | 1,011 | 0.47 |
| Coffee detail | 432 | 12,841 | 25 | 915 | 0.48 |
| Home | 327 | 10,587 | 1 | 2,171 | 0.61 |
| `/roasters` | 161 | 6,423 | 2 | 350 | 0.63 |
| Tools | 104 | 4,033 | 2 | 187 | 0.72 |
| Communities and curations | 97 | 1,832 | 1 | 353 | 0.66 |
| `/coffees` index | 13 | 2,613 | 1 | 440 | 0.45 |

**Top organic pages.** **S**
1. `/` — 327 clicks
2. `/learn/indian-coffee-varieties-explained` — 282
3. `/coffees/budget` — 230
4. `/roasters` — 143
5. `/communities` — 97
6. `/learn/understanding-indian-coffee-estates` — 96
7. `/coffees/chicory-mixes` — 92
8. `/tools/grind-size-converter` — 85
9. `/learn/coffee-regions-of-india-complete-guide` — 81 clicks from 20,994 impressions

**Queries.** **S** Mostly navigational: roaster names such as hunkal, naivo, kapi kottai and caramelly, plus "indian coffee beans" (130 clicks). "coffee estate" has 1,116 impressions and "premium coffee" 3,443.

**Product behaviour (PostHog, 90 days).** **S**
- 17,314 unique visitors and 9,011 coffee page views.
- Rating funnel: `rating_started` 183 → `rating_form_submitted` 102, with 110 abandoned. 118 reviews in total, 40 of them anonymous.
- 14 signups, 17 onboarding completions, 34 `wishlist_added`.
- Hero CTA clicks:
  - "Explore coffees" 358 (discovery) + 222 (returning).
  - "Top rated coffees" 337.
  - "Continue with last viewed" 14.
- **No search, filter, sort or facet events are instrumented.** None appear in `event_volumes`. Expert-path usage cannot be measured today.

**UX friction (Clarity, 3-day window to 2026-10-26).** **S**
- Site-wide: dead clicks 11%, quickback 12.8%, average scroll 40%.
- **Homepage: quickback 23.4% (1.8× the site rate) and average scroll depth 13%.** Most visitors never get past the hero of the 14-section page (§4.3).
- `/learn/understanding-indian-coffee-estates`: scroll 7.7%.
- `/coffees` is healthy: dead 4.6%, scroll 51%.

**Core Web Vitals.** **S** — PageSpeed cache, October.
- Field data is **origin-level** (identical on every URL): **LCP 2,205ms · INP 163ms · CLS 0** (FCP 1,826ms, "average"). This passes the 05 targets, but LCP has only about 300ms of headroom.
- Mobile lab performance 58–76. Mobile lab LCP 5.2–8.2s; articles are worst.
- PostHog holds about 21k `$web_vitals` events, which could give per-template field data. The snapshot does not roll them up.

**What this means for the redesign.**
1. **Landing pages and articles are the organic front doors** (about 54% of top-100 clicks), and they arrive on mobile. The deep-link screenplay is the main path, not an edge case.
2. **The homepage is a front door for direct traffic.** It has the second-highest GA4 landing sessions and the best engagement rate, but it is barely scrolled. That is strong evidence for the redesign's "one experience, not stacked sections" premise.
3. **There is demand for missing objects.** Varieties: the #2 organic page is a varieties article, yet varieties have no page and 42% data coverage. Estates: an estates article plus "coffee estate" queries, and estates have no page.
4. **The performance budget is tight.** Any WebGL or heavy media on mobile landing or article templates must not cost LCP.

**Prior art.** `../icb-quiz` (last commit 2025-06-20) is a paused "coffee personality quiz". It has 12 questions, 3 scoring axes and `/result/[persona]` pages, and was paused for lack of real coffee data. It writes to tables that no longer exist (its own `CLAUDE.md`). It is the nearest existing "Guide me" artefact, but it is also the compulsory quiz pattern that 01 lists as an anti-goal.

---

## 14. Motion, accessibility and component baseline

- **Motion.** `motion@^12.23` in about 20 files (mostly blog blocks, `HomeCollectionGrid`, `RoastScale`, `FieldGuidePillars`, `ProfileTasteProfile`); `Reveal` in 11 files; `lottie-web` (404, spinner, error); lazy hero video that is skipped under reduced motion; marquee; View Transitions theme toggle. **No page-level transitions, no shared-element transitions, no 3D.** **K**
- **Reduced motion.** Handled in `Reveal` (CSS `motion-reduce`), `useReducedMotion` call sites, `globals.css:275,285` and `effects.css:26,128`. **K**
- **Accessibility.** A skip link and `main#main-content` exist. Header search has a keyboard shortcut. Mobile nav has an `aria-label`. WCAG 2.1 AA is the stated target (PRODUCT.md). **No audit was run** (§17).
- **Primitives.** `PageShell`, `Section`, `Stack`, `Cluster`, `Rule`, `Prose`, `Decor`, `Reveal` and `RegionCard` (DESIGN.md §5). This is the layer a redesign should extend, not fork (05: no duplicated logic).

---

## 15. What already works (keep)

- **Expert faceting.** URL-shareable, instant, and backed by an MV.
- **Landing pages.** 42 indexable concept pages that already explain vocabulary, the closest existing thing to "the menu explains what the house cares about".
- **Regions hub.** Commissioned field-guide plates with mandatory provenance (DESIGN.md `RegionCard`). This is the most fully realised editorial-and-data object in the product.
- **Global search.** ⌘K, FTS plus trigram.
- **Personalised hero.** Segments with "continue where you left off".
- **Provenance in the data.** Region areas, `sensory_params.source/confidence` and similarity scores are all labelled where they come from.

## 16. Gaps (summary)

**Missing object pages:**
- Estates (15 now pass the gate; UI not built).
- Varieties (no data model).
- Flavour (data exists).
- Gear (planned).
- The 7 process enum values without a landing page.
- Regions beyond the 12 configured landing pages.

**Unsupported relationships:**
- Variety ↔ variety and variety as an entity.
- Article ↔ catalogue (queryable, both directions).
- Gear ↔ coffee.
- "Disliked".

**Journey breaks:**
- No anonymous guided path.
- Back does not undo filters.
- Static facet counts.
- No editorial adjacency on coffee or roaster detail.
- No search across Learn and glossary.
- No breadcrumbs on detail pages.
- A 404 with no search.
- Saved preferences never influence results.

## 17. Evidence gaps (needed before Phase 1 gate)

| Gap | Why it matters | How to close |
|---|---|---|
| ~~Search Console, GA4, CWV origin field data, Sanity schema~~ | Closed: §13a and §11 (icb-claude snapshots, studio-icb) | Re-run `icb-claude/content/scripts/fetch-search-data.mjs` before the Phase 4 SEO gate |
| Search, filter, sort and facet usage | Expert-path baseline (08 metrics) is unmeasurable | Add PostHog events (an implementation task, needs approval) |
| Per-template field Core Web Vitals | Origin-level data hides template differences | Roll up PostHog `$web_vitals` by path template |
| Number of articles embedding catalogue blocks | Sizes the no-schema-change editorial adjacency (§11) | Read-only GROQ count |
| ~~Live catalogue counts~~ | Closed: §10.0 (via `supabase db query --linked`). Still open: per-region coffee counts beyond the configured 12, altitude coverage, and whether the `/coffees` default view hides the 527 discontinued MV rows. | Read-only SQL; ask before running |
| `docs/regions-hub-audit.md` | Linked from `docs/README.md` but **missing** | Locate it, or fix the link |
| Live accessibility audit (axe, keyboard walk, both themes) | The WCAG claim is unverified | A Phase 0b task with a browser |
| User research with newcomers and experts | 08: "validate with newcomers and expert coffee users" | Not available in repo |

## 18. Documentation drift found

- **CLAUDE.md.**
  - Says `coffees/` has a "[slug] detail". `/coffees/[slug]` is a landing-page resolver, and detail is under `/roasters/.../coffees/...`.
  - Lists Fuse.js. Search is now the Supabase RPC.
- **ADR-006.** Prescribes an Apply button and Zustand. The live code is instant and uses URL state.
- **ADR-002.** `/learn?q=` search was not found in `src/app/(main)/learn/page.tsx` (**U**).
- **`discovery-pages.json`.** Referenced in `src/app/sitemap.ts:41`, ADR-013 and the regions handover, but the file does not exist.
- **`docs/README.md`.** Links a `regions-hub-audit.md` that does not exist.
- **`docs/regions-estates-handover.md` §4f.** "Blocked on content" is out of date: 33 of 186 estates have descriptions and 15 pass the gate (**L**).
- **Code comments.** `SearchCommand.tsx:62` still mentions Fuse. The header nav carries a dead `/explore` value.

None of these were edited (out of scope). They are listed for a separate cleanup task.

## 19. Decisions for the owner (Phase 0 gate)

*Revised after the §13a evidence. Answers will be logged in [07](07-decisions.md) once given.*

1. **North star (C5).** Is hospitality a behavioural layer on the "Coffee Field Guide" brand, or a replacement? This determines whether Phase 1 explores within DESIGN.md or alongside it.
2. **Depth and 3D (C4).** May Phase 2 keyframes show non-paper depth (3D or camera) as one of the two screenplays, on the understanding that adoption needs an ADR?
3. **Region and estate object pages (C2, C3).** Should screenplays treat `/coffees/<region>` as the region page? With 15 estates now passing the ADR-013 gate, should `/estates` ship independently of the redesign, or wait and launch in the new design?
4. **The "Guide me" data question.** Mood and occasion have no data model. Options:
   - Map guidance onto existing facets plus flavour families and `sensory_params` (no schema change).
   - Revive the `icb-quiz` persona model (note its conflict with the 01 anti-goal).
   - Add a new schema later.
5. **Editorial adjacency.** Options:
   - Start from a reverse lookup of existing article embeds (no schema change).
   - Add typed catalogue references in `studio-icb` later.
6. **History behaviour.** Should facet changes push history entries? This changes the expert path and affects analytics; it is an implementation decision for later, but it shapes the storyboard.
7. **Agent routing (C8).** Approve creating `AGENTS.md` and a one-line pointer in `CLAUDE.md`.
8. **First templates (07 OPEN).** The evidence points at deep-link landing and article pages on mobile (organic front doors) and at the homepage (13% scroll). Which goes first in the screenplays?
9. **Variety object.** It has the #2 organic page, but only 42% data coverage and no table. Should it be designed as a first-class object now, or deferred?
10. **Instrumentation.** May search, filter and facet events be added ahead of the redesign to get an expert-path baseline (TECH-007)?
