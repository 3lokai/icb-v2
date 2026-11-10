# Requirements Traceability — ICB Experience Redesign

**Status:** Phase 0 audit/traceability gate accepted on 2026-11-07 (see `07-decisions.md`), updated for the approved 2026-11-10 I direction in [20](20-direction.md). Older IDs remain as provenance; superseded wording is corrected or marked historical. Do not interpret proposed product UX as implemented.
**Companion:** [current-state-audit.md](current-state-audit.md). "Audit §" below points into that file.

## How to read this
- **Status** uses the 07 vocabulary.
  - **CONFIRMED**: traces to a CONFIRMED row in [07](07-decisions.md) or a production rule in force.
  - **PROPOSED**: recommended in the redesign docs, not yet accepted.
  - **OPEN**: an unresolved question.
  - No requirement is promoted beyond its source.
- **Planned experience moment** uses the illustrative arc in [03](archive/03-interaction-motion.md):
  - *Arrival → Invitation → Selection → Reorganise → Results → Coffee opens → Adjacent discovery*
  - plus *Deep-link landing* and *Return*.
  - These are placeholders until the Phase 1 screenplays assign real moments. Nothing is designed yet.
- **Current state** codes:
  - ✅ exists
  - ◐ partial
  - ❌ absent
- **Validation** is the test that proves the requirement at the relevant gate (08).

## Experience (UX)

| ID | Requirement | Source | Object | Moment | Current state (audit §) | Validation | Status |
|---|---|---|---|---|---|---|---|
| UX-001 | Experience conveys thoughtful high-end hospitality as *behaviour*, not a literal café, host or avatar | 01; 07 | All | All | ❌ no such layer; brand reads as "field guide" (§2 C5) | Newcomer and expert sessions: comprehension and enjoyment interviews | CONFIRMED |
| UX-002 | Visually connected, intentional sections and motion; avoid **disconnected, repetitive blocks**, not sections themselves. Native scrolling remains familiar; horizontal gallery can scroll independently. | 07 (2026-11-10); 20 | Homepage | Arrival → discovery → community | ◐ current homepage has 14 discrete sections (§4.3); I-v2 boards propose coherent composition | Scroll prototype test for continuity without scroll hijack, mobile/reduced-motion parity | CONFIRMED (newer wording) |
| UX-003 | **Historical concept:** three separate named intent modes (Guide / Expert / Wander); optional guidance remains possible, but the approved I direction prioritizes Find and Rate with conventional filters and contextual attribute links, not three compulsory modes. | archive/02; 07 (2026-11-10); 20 | Coffee, Directory | Discovery | ◐ expert search available, contextual paths incomplete (§6) | Test an expert and newcomer reaching real coffees without learning modes | SUPERSEDED (specific three-mode model) |
| UX-004 | Expert can apply multiple technical facets (brew + process + roast + region + price) instantly | 02; 06; 07 | Coffee | Selection → Results | ✅ instant, URL-driven (§7) | 20-second expert task (08) | CONFIRMED |
| UX-005 | Filter state survives transitions and **browser Back** | 02; 08 metrics | Coffee | Results ↔ Coffee opens | ◐ survives in the URL; Back does not undo filters (`replaceState`) (§7) | Back/forward test across 3 filter changes and a detail visit | PROPOSED |
| UX-006 | Global search reachable everywhere, including inside expressive scenes | 02; 06 | All | All | ◐ ⌘K on every `(main)` page; coffees and roasters only (§4.2) | Keyboard and touch test from every template | CONFIRMED (search discoverability, 07) |
| UX-007 | Search spans editorial content (Learn, glossary, regions), not only the catalogue | 02 (Let me explore) | Article, Glossary, Region | Invitation | ❌ (§4.2) | Query test set: "natural process", "Chikmagalur", "bloom" | OPEN |
| UX-008 | Optional, progressive "Guide me" prompts; no compulsory quiz; technical attributes never hidden | 01 anti-goals; 02 | Coffee, Flavour | Selection | ◐ onboarding wizard only, signed-in only (§5) | Newcomer finds a plausible coffee without jargon; expert can skip in 1 action | CONFIRMED (2026-11-07: prompts map to existing facets and sensory data) |
| UX-009 | Suggestions explain "why this coffee" and separate known facts, inferred similarity and editorial picks | 02; 04 | Coffee | Results | ❌ similarity is computed but unlabelled (§9) | Copy review; users identify the source of each reason | PROPOSED |
| UX-010 | Coffee detail opens without breaking visual continuity | 03 arc | Coffee | Coffee opens | ❌ no page or shared-element transitions (§14) | Prototype review; no CLS regression | PROPOSED |
| UX-011 | Adjacent discovery (estate, region, process, article) grounded in **real** relationships, never a random carousel | 02; 06 | Coffee, Estate, Region, Article | Adjacent discovery | ◐ landing links and similar coffees; no editorial links (§9, §11) | Every adjacency in a storyboard cites its relation type and data source | CONFIRMED (core objects, 07); mechanism PROPOSED |
| UX-012 | Newcomer welcome is atmospheric but fast; never an unskippable intro | 01; 02 | — | Arrival | ◐ hero video is lazy and skipped under reduced motion (§14); homepage scroll 13% and quickback 23.4% (§13a) | LCP budget (TECH-004); homepage scroll and quickback against the §13a baseline | CONFIRMED (anti-goal) |
| UX-013 | Returning users go straight to saved context (gear, ratings, wishlist, last discovery); never forced through theatre | 02 | Personalization | Return | ◐ hero segments plus recently viewed; no last-filter memory (§5, §12) | Returning-user task: resume the previous search in 1 action | PROPOSED |
| UX-014 | ICB stays a neutral directory; outbound roaster discovery preserved | 01; PRODUCT.md | Coffee, Roaster | Coffee opens | ✅ `direct_buy_url` outbound, roaster links (§9) | Outbound click rate is not reduced against baseline | CONFIRMED |
| UX-015 | Compare coffees side by side | 02 (expert journey) | Coffee | Results | ❌ (§7) | Expert task: compare 3 coffees | PROPOSED |
| UX-016 | Can locate a specific coffee in 20s, discover in 5 min, wander for 40 min | 01 | All | All | ◐ 20s path likely met via ⌘K (unmeasured) | Timed task tests (08 acceptance metrics) | PROPOSED |
| UX-017 | Recovery states (404, empty results) keep the visitor in the experience | 02 navigation | All | Results | ◐ 404 has no search; empty state only offers "clear all" (§4.5) | Heuristic review | PROPOSED |

| UX-018 | Visual discovery centres real product imagery/packaging, with a consistent image-frame system and neutral exposure | 20; 07 (2026-11-10) | Home, Directory, Coffee | Browse → coffee | ◐ 1,657/1,678 image-backed coffees at audit; mixed photography styles | Diverse, non-sponsored visual examples; screenshot and mobile visual audit | CONFIRMED |
| UX-019 | Two core actions: find a coffee to buy externally, and rate one genuinely tasted; both available on coffee detail but not duplicated on every card | 20; 07 (2026-11-10); 17 | Coffee, Directory, Rate | Browse → Buy / Rate | ◐ Buy and quick rate already exist with uneven prominence (§9) | Mobile/direct-deep-link user task for each, no fake purchase claim | CONFIRMED |
| UX-020 | Homepage combines clear action entrances with genuine recent coffees, recent independent ratings, new roasters and editorial content; allow meaningful continuous sections | 20; 07 (2026-11-10) | Homepage | Landing → dynamic activity | ◐ live data feeds exist, presentation disjointed (§4.3) | Mobile + desktop mockups, honest recency, no promotion, one coherent flow | CONFIRMED |
| UX-021 | Horizontal gallery is native, escapable and accessible; optional animations may enhance but not gate content | 20, provisional motion policy | Homepage | New coffee gallery | ❌ I-v2 boards are static, no runtime gallery yet | Keyboard/touch scroll, reduced-motion, no vertical wheel hijack, mobile performance | PROPOSED implementation |

## Information architecture and objects (IA)

| ID | Requirement | Source | Object | Moment | Current state | Validation | Status |
|---|---|---|---|---|---|---|---|
| IA-001 | Clear, indexable entity pages stay beneath the discovery layer | 02 | All | Deep-link landing | ✅ coffee, roaster, landing and article pages (§3) | Route inventory diff before and after | CONFIRMED |
| IA-002 | Region object page = `/coffees/<region-slug>`; `/regions` hub only | ADR-013 | Region | Adjacent discovery | ✅ 12 regions configured; 49 India regions exist (§10.0) | Owner decision (audit §19.3) | CONFIRMED (ADR-013); expansion OPEN |
| IA-003 | Estate pages only for estates passing the ADR-013 gate | ADR-013; 02 | Estate | Adjacent discovery | ❌ UI absent; 15 estates qualify (§10.0) | Gate query in `generateStaticParams`; no thin pages | CONFIRMED (gate); timing OPEN |
| IA-004 | Normalized/alias-mapped variety values can serve as contextual links/facets; whether variety receives a dedicated canonical entity page remains open. No requirement to turn values into enums. | 20; owner clarification; archive/14 | Variety | Coffee detail → directory | ◐ `coffees.varieties text[]`, normalized labels/aliases; no first-class variety table at audit | Validate normalization/canonical destinations and missing coverage; retain SEO | PROPOSED links / OPEN pages |
| IA-005 | Flavour notes as discovery entry points | 02 | Flavour | Selection, Adjacent discovery | ◐ facet at descriptor level; 15 families and 344 nodes unused as pages (§10) | Coverage check; family-level facet prototype | PROPOSED |
| IA-006 | Factual coffee attributes act as **contextual links into familiar directory results**, not a visible graph; explain provenance and do not fabricate unsupported links. | 20; 07 (2026-11-10) | Coffee, Directory | Follow a coffee | ◐ typed data supported for many fields; linking gaps in estate/flavour (§9–10) | Every active label links to a real validated destination or is displayed non-clickably | CONFIRMED UX / OPEN URLs for absent entities |
| IA-007 | Editorial is interleaved with the catalogue, not a disconnected blog | 02 | Article ↔ Coffee/Roaster/Region | Adjacent discovery | ◐ one-way spotlight and collection embeds; reverse GROQ lookup possible without schema change (§11) | Count articles with embeds; owner decision on typed references (audit §19) | OPEN |
| IA-008 | Tools connect back to coffees (brew guidance ↔ coffee) | 02 | Tool, Brew method | Adjacent discovery | ◐ generic `/coffees` CTA only (§4, §7) | Handoff carries brew-method filter | PROPOSED |
| IA-009 | Breadcrumbs and browser semantics never obscured by editorial journeys | 02 navigation | All | All | ◐ visible on landing and some learn pages; not on coffee or roaster detail (§4.4) | Template checklist | CONFIRMED (principle) |
| IA-010 | Explore / Discover / Wander are intent modes, not mandatory nav labels | 02 | — | — | n/a (nav is Explore / Learn / Tools today) | Nav card-sort with users | OPEN (labels, 07) |
| IA-011 | Gear is peripheral, not the centre | 02 | Gear | Return | ✅ no gear route; tables exist (§10) | — | PROPOSED |

## SEO

| ID | Requirement | Source | Object | Moment | Current state | Validation | Status |
|---|---|---|---|---|---|---|---|
| SEO-001 | Preserve existing public URLs and slug meanings | 05; 07 | All | Deep-link landing | ✅ baseline in audit §3, §13 | Crawl diff of every sitemap URL before and after | CONFIRMED |
| SEO-002 | Preserve 301 redirect chains (legacy and alias slugs) | 05 | Landing | — | ✅ ~25 in `next.config.ts` (§13) | Redirect test suite, one hop each | CONFIRMED |
| SEO-003 | Preserve canonicals, including filtered → bare canonical with noindex and `?page=N` self-canonical | 05 | Coffee, Roaster lists | Results | ✅ bespoke logic in two `page.tsx` files (§13) | Metadata snapshot per template | CONFIRMED |
| SEO-004 | Preserve JSON-LD per template (Product, LocalBusiness, CollectionPage, FAQPage, BreadcrumbList, BlogPosting, HowTo) | 05 | All | — | ✅ (§13) | Rich-results test per template | CONFIRMED |
| SEO-005 | Exactly one h1 per template; landing h1, FAQ and related links are config-owned | 05 | Landing, Coffee, Roaster, Article | — | ✅ via shared components (§13) | DOM heading audit | CONFIRMED |
| SEO-006 | No essential copy, fields, links or taxonomy inside WebGL-only rendering | 03; 05 | All | All | ✅ (no WebGL today) | JS-disabled render shows the same content | CONFIRMED |
| SEO-007 | Preview and staging stay `noindex` | 05 | — | — | ✅ `VERCEL_ENV !== "production"` (§13) | Header check on the preview URL | CONFIRMED |
| SEO-008 | Shareable filtered URLs keep working | 05 | Coffee | Results | ✅ (§7) | URL round-trip test | CONFIRMED |
| SEO-009 | Search Console baseline captured per template before any change | 05; 08 | All | — | ✅ baseline in audit §13a (snapshot 2026-11-02) | Re-run `icb-claude` fetch before Phase 4; compare per template | CONFIRMED |
| SEO-011 | Mobile deep-link landing (landing pages and articles carry ~54% of top-100 organic clicks; 66% of clicks are mobile) is the primary entry design target | Audit §13a | Landing, Article | Deep-link landing | ✅ server-rendered today | Mobile keyframes for the deep-link path | CONFIRMED (2026-11-07: first focus) |
| SEO-010 | Decide whether any multi-facet combination earns an indexable page | Audit §8 | Landing | Deep-link landing | ❌ single-dimension only | Search-demand research | OPEN |

## Technical, performance and accessibility (TECH / A11Y)

| ID | Requirement | Source | Object | Moment | Current state | Validation | Status |
|---|---|---|---|---|---|---|---|
| TECH-001 | Keep Next.js / React / Tailwind / Supabase / Sanity; no framework migration or SPA rebuild | 05; 07 | — | — | ✅ | Architecture review | PROPOSED |
| TECH-002 | Reuse the existing filter and data layer (`coffee-url.ts`, `fetch-coffees.ts`, MV); no duplicate catalogue or filter logic | 05 | Coffee | Selection → Results | ✅ single implementation (§7) | Code review: no second parser | CONFIRMED (CLAUDE.md conventions) |
| TECH-003 | 3D only where it materially changes the experience; client-only, lazy, with a static fallback; no idle 60fps loop | 03; 05 | — | Arrival, Reorganise | n/a (no 3D, §14) | Phase 3 prototype: GPU and CPU idle profile | PROPOSED |
| TECH-004 | Core Web Vitals p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (mobile included) | 05 | All | All | ◐ origin field: LCP 2,205ms, INP 163ms, CLS 0 (≈300ms LCP headroom); mobile lab LCP 5.2–8.2s (§13a) | Per-template PostHog `$web_vitals` rollup; no regression per template | CONFIRMED (target) |
| TECH-007 | Instrument search, filter, sort and facet events so the expert path can be measured | 08 metrics; audit §13a | Coffee | Selection → Results | ❌ no events | PostHog event presence | PROPOSED |
| TECH-005 | Motion tooling (GSAP / R3F / Lenis) adopted only after the prototype proves benefit | 05; 07 | — | — | n/a (`motion` only) | Phase 3 A/B against a `motion`-only build | OPEN |
| TECH-006 | No schema changes without a separate explicit decision | 05 | — | — | — | Migration review | CONFIRMED |
| A11Y-001 | WCAG 2.1 AA, keyboard, visible focus, light/dark parity | PRODUCT.md; 05 | All | All | ◐ stated, not audited (§14, §17) | axe plus a manual keyboard walk in both themes | CONFIRMED |
| A11Y-002 | Every animation has a `prefers-reduced-motion` static or crossfade alternative | PRODUCT.md; DESIGN.md; 03 | All | All | ✅ in current motion (§14) | Reduced-motion walkthrough of each storyboard | CONFIRMED |
| A11Y-003 | No scroll hijacking; native scroll by default | 01; 03 | — | All | ✅ | Prototype review | CONFIRMED (anti-goal) |
| A11Y-004 | Mobile is an equal design target, not a shrunken desktop scene | 03 | All | All | ◐ mobile filter sheet exists; no mobile storyboard yet | Mobile keyframes required in Phase 2 | CONFIRMED |

## Personalization and trust (PERS)

| ID | Requirement | Source | Object | Moment | Current state | Validation | Status |
|---|---|---|---|---|---|---|---|
| PERS-001 | Explicit filters are hard constraints; personalization never silently overrides them | 04 | Coffee | Results | n/a (no personalised ranking today, §12) | Ranking unit test when built | PROPOSED |
| PERS-002 | Users can inspect, edit and reset saved tastes; session intent separate from long-lived preference | 04 | Personalization | Return | ◐ preferences form exists; unused for ranking; no reset of inferred data (§12) | Settings walkthrough | PROPOSED |
| PERS-003 | Logged-out users get a complete experience | 04 | All | All | ✅ (wishlist and preferences are signed-in only, but core browsing is open) | Anonymous task completion | CONFIRMED |
| PERS-004 | Respect the anonymous identity, 3-free-ratings gate and anon→account merge | 04; `docs/auth.md` | Review | Return | ✅ active (§2 C9, §12) | Regression on `src/app/actions/reviews.ts` gate | CONFIRMED (production) |
| PERS-005 | Consent via `src/lib/consent.ts` (ADR-012); no hidden behavioural surveillance | 04; ADR-012 | — | — | ✅ | `scripts/check-consent-attribution.mts` | CONFIRMED |
| PERS-006 | "Disliked" / "show me something different" signal | 04 | Personalization | Results | ❌ no field (§10) | Schema decision | OPEN |
| PERS-007 | Serendipity: adjacent, unexpected choices, not an echo chamber | 04 | Coffee | Adjacent discovery | ◐ similar coffees is pure similarity (§9) | Diversity metric on suggestions | PROPOSED |
| PERS-008 | What is stored anonymously, for how long, and what merges on signup | 04 | Personalization | Return | ◐ known for views and reviews (§12) | Product decision | OPEN |

## Brand (BRAND)

| ID | Requirement | Source | Object | Moment | Current state | Validation | Status |
|---|---|---|---|---|---|---|---|
| BRAND-001 | Start from the current brand (Fraunces + DM Sans, cream / roasted brown / terracotta, brush-smear); no rebrand by default | 01; PRODUCT.md; DESIGN.md | All | All | ✅ in force on production | Production: any deviation needs an ADR. Exploration: Concept A evolves it, Concept B may depart from it (07, 2026-11-07) | CONFIRMED (production); exploration unconstrained |
| BRAND-002 | Depth language: paper layers (production) vs 3D or camera depth (exploration) | DESIGN.md vs 03 | All | Arrival, Reorganise | Resolved for exploration (audit §2 C4) | One screenplay may be fully spatial/3D; adoption needs performance validation and approval | CONFIRMED (2026-11-07) |
| BRAND-003 | North star: "Coffee Field Guide" vs "hospitality" | DESIGN.md vs 01 | All | All | Resolved for exploration (audit §2 C5) | Hospitality = experiential philosophy; explore both an evolved Field Guide (A) and a free identity (B) | CONFIRMED (2026-11-07) |
| BRAND-004 | One accent, One Smear Rule, no second emphasis language | DESIGN.md | All | All | ✅ in force on production | Binding on production only; Concept B may drop it | CONFIRMED (production) |
| BRAND-005 | Rejected: literal café or avatar, forced cinematic tour, another round of static moodboards | 01; 07 | — | — | — | Review gate | REJECTED (do not build) |

## Change log
- 2026-11-07: initial draft from the Phase 0 audit (Claude Code).
- 2026-11-07: owner decisions 1–4 and guardrails recorded (07); BRAND-001…004, UX-008 and SEO-011 statuses updated.
- 2026-11-10: reconciled UX-002, UX-003, IA-004 and IA-006 with approved I (Find, Rate, Buy); added UX-018…021. Historical Phase 0 checks still apply.

## Business mission, independent reviews and monetization (owner update 2026-11-09)

IDs below extend the Phase 0 requirement inventory; validate current DB/events and exact technical locations before implementation. [17 — Review Intelligence & Monetization](17-review-intelligence-and-monetization.md) is the complete companion brief.

| ID | Requirement | Source | Existing evidence (2026-11-07 audit) | How to validate | Status |
| --- | --- | --- | --- | --- | --- |
| BIZ-001 | Redesign serves independent coffee-review authority and trustworthy intelligence, not discovery alone | Owner 2026-11-09; 17 | 397 review rows in audited DB, scope/coverage unknown; 118 reviews in separate 90-day analytics | Owner confirmation of product north star and metric definitions | CONFIRMED (mission) |
| BIZ-002 | Coffee focus/detail exposes genuine review summary, sample size, and fast neutral review path after tasting | 17 | Quick rating and review form already present on detail, gate and CTA exist | Prototype: visitor reaches a coffee and contributes a genuine rating without coercion; verify storage | PROPOSED (UX) |
| BIZ-003 | Optional tasting context increases data quality without gating quick rating | 17; 04 | Review schema, collection quality and moderation need code review | Inspect review model and usability test optional notes/brew context, no AI review generation | PROPOSED |
| BIZ-004 | Returning member can rate actually tried-but-unrated coffees; saved/viewed is not tried | 17; 04 | `user_coffees`, wishlists, `coffee_views` exist but histories differ | Test accurate state and no consumption inferred from clicks | PROPOSED |
| BIZ-005 | Publish representative review coverage and independent contributor metrics | 17; audit §10 / §13a | 397 review rows, 183 start events, 102 submit events, 110 abandon events reported under differing scopes | Read-only counts by coffee vs roaster, unique contributors, recency, moderation, review coverage, deduped event cohorts | PROPOSED metric / OPEN baseline |
| BIZ-006 | Monetization does not influence organic rank, review sentiment/removal, factual edges or AI answers | Owner 2026-11-09; 17 | Independent directory model; commercial policies not yet implemented | Commercial policy review and separation/disclosure of paid inventory | CONFIRMED principle |
| BIZ-007 | Explore aggregated roaster intelligence, permitted data APIs and research reports as revenue tracks | Owner 2026-11-09; 17 | API infrastructure present; commercial demand, rights and feasibility unverified | Buyer interviews, paid pilots, rights/privacy/sample-size review | PROPOSED products |
| BIZ-008 | Anonymous contribution, review authenticity, moderation, identity/consent and privacy preserve first-party trust | 17; ADR-012; existing auth/merge | 3-entity cap, review merge and consent exist; moderation specifics need audit | Audit duplicate/abuse detection, moderation, erasure and data rights | CONFIRMED trust / OPEN implementation |
