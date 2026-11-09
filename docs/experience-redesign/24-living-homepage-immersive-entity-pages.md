# 24 — Homepage is a living index; immersion belongs to entity pages

**Date:** 2026-11-09  
**Status:** Product/UX direction updated after owner feedback. Design documentation only; not approval for production code changes.  
**Supersedes the homepage-specific assumption** in [22](22-immersive-progressive-reveal.md) and [23](23-living-activity-and-contribution.md) that the homepage should deepen progressively into one chosen seller's coffee/estate. Retain their motion and review-acquisition findings for **entity templates**, not the homepage landing.

## Product correction

The homepage must display **breadth and momentum** — many new coffees, many roasters, recent independent reviews and the latest real educational material. It is *not* a presentation about one newly catalogued coffee, nor a default trip through one selected estate. The typical inflow is **8–30 coffees per week** (owner's operating estimate), with burstier ingestion weeks; one read-only production snapshot on 9 Nov 2026 found **58 active coffees added in the preceding seven days**, 103 in fourteen days, and 3 newly active roasters in fourteen days. Some clusters are bulk imports from one roaster. Data freshness and representativeness matter.

**Immersive spatial storytelling becomes the page-level interaction model once a real entity is selected.** The canonical existing coffee profile, roaster page, region landing, and later an explicitly launched estate profile can host a focussed, richly linked world.

> **Homepage = the front page of a living Indian coffee publication + directory.**
> **Entity pages = immersive deep dives into a subject and its relationships.**

## 1. Homepage Concept F as the foundation

Preserve its richer editorial identity (warm paper, typography, expressive photography, a readable content density, straightforward navigation), plus the useful functions the present site already has. Content on the homepage should be recognizably dynamic and plural, not just a decorative rotating hero.

### Above the first fold

- Neutral hospitality-led hero; no single branded coffee as the default recommendation.
- Prominent **Find a coffee** and **Rate one I've tried** (persistent header on desktop, compact but labeled action on mobile).
- Visible first evidence of movement: precise "updated as of" or "this week" labels, mixed activity signal and a clear downward continuation. Never imply newly listed equals newly roasted or just released by a seller.

### First two folds: the living front page

- A **changing editorial coffee shelf/mosaic** with 6–12 **distinct** current coffee identities discoverable in the initial continuation. The shelf accepts 8–30 normal weekly arrivals and burstier periods by showing a representative teaser plus a chronological **View all new coffees** link (`/coffees?sort=newest`). **Not a single featured coffee.**
- A **real-time-ish activity rail** within the *same visual composition* (cache-friendly, not a streaming websocket): newly listed roasters, most recent published community opinions, newly published Field Guide articles and catalogue refresh times.
- Events are labelled by type and provenance; a new 5/5 with one rating explicitly says `n=1`; new catalogue entries show date added and roaster. Editorial articles use actual Sanity publication dates and visible editorial identity.
- **Fairness / selection:** never choose only one roaster's ten products simply because a bulk scraper batch occurred. The editorial mosaic can apply a balanced display selection (e.g. max 2 from any roaster for its first page); the *full newest directory* remains chronological, accessible and unaltered. Never silently relabel editorially balanced selection as "the 12 newest."
- **Responsive density:** on phone, 2–4 distinct products plus a clear `See all` and recent roaster/review snippets within two folds; rest available with normal scrolling. Avoid infinite animated tickers.
- **Contextual review CTA:** for each exact coffee: `Tried this? Rate`; global search-to-rate action always visible. Ratings and missing-review states are transparent and voluntary; negative and positive feedback treated equally.

### Beyond first two folds, still one cohesive editorial publication

Use an *editorial grammar*, not repeated rectangular card rows:
- Compare browse lenses (brew, origin, process, flavour, reviews), with precise existing route links.
- Community voices as source-labelled independent submissions, without cherry-picked positivity.
- Learn and brew utilities featured for the current editorial subject, with durable `All articles` and `All tools` routes.
- Returning signed-in user: real saves/reviews/preferences, not false `tried` history.
- Clear site navigation, footer and canonical links for SEO. Do **not** turn the homepage into 6–10 forced full-viewport sticky scenes or scroll-lock the visitor.

A polished responsive editorial page **may have a real vertical reading rhythm**. Our objection to stacked sections was to *generic disconnected full-width modules*, not to normal vertical scrolling. Use interleaving, overlapping photography and editorial labels, shared timeline/context and direct jumps; let users skim or browse.

## 2. Immersive entity page families

| Canonical subject | Existing / planned URL | Spatial focus when opened |
|---|---|---|
| Coffee | **Existing** `/roasters/[slug]/coffees/[coffeeSlug]` | This bag/coffee is centre; documented estate, process, varieties, tasting descriptions, independent ratings, brew methods, adjacent coffees and optional recipe/tool. Primary CTA `Rate if tried` and canonical buying options remain legible. |
| Roaster | **Existing** `/roasters/[slug]` | Roaster is centre; actual active catalogue, newly added products, origin distribution, community reviews and links to individual coffee stories. No paid ranking implied. |
| Region | **Existing** `/regions` hub and current `/coffees/[region-slug]` discovery landing routes | Region is centre; ground available coffees/estates/roasters and variety/process data. Keep original filtered directory, SSR text and SEO semantics. Do not pretend a new `/regions/[slug]` detail route is shipped. |
| Estate | **Future, not yet shipped** | Estate is centre; canonically verified coffees from multiple roasters, traceable provenance and contrasting independent feedback. Only create a standalone estate URL after the eligibility/product gate. |

**Entity immersion is progressive enhancement:** semantic reading, filtering, reviews and canonical links work without scroll-driven animation; action-driven focus, URL/back and reduced-motion parity; no speculative WebGL dependency before mobile performance budget passes.

A freshly added product **enters** this world when clicked on the homepage. The homepage never preselects a seller and runs a forced estate tour.

## 3. Conversions and experiment definition

**Find → exact coffee → rating initiation → optional brew details → submit/identity check → published confirmation** is a universal action usable from homepage shelf, global rate CTA, directory card, coffee detail and relevant roaster/region/estate scenes. Keep the user's source and selected coffee across navigation and login; never manufacture a tasting event or review.

North-star: published independent coffee ratings per 1,000 qualified coffee-detail visitors, plus homepage rate CTA click → selected exact coffee → accepted/published contribution, contributor diversity across roasters, 30/90-day retention, false/abusive rate, and mobile SEO/performance.

Before integrating any live form, address the previously found review deletion/tombstone integrity risk, anonymous limit fail-open, merge and moderation safeguards.

## 4. Implementation direction & owner approval

Design **F — Coffee, Shared** as the homepage base, not D's literal spatial orbit front page. Revisit F's editorial first two folds to expose several actual new coffees at once, a mixed activity rail, date-labelled recency, new roasters, ratings, and article releases. Preserve neutral hero and global rate CTA.

Carry over **D's connected spatial exploration** into the canonical entity page templates. Prototype **coffee detail first**, then roaster, then existing region landing, with estate future gated. Derive cards and relationship components from these actual templates.

**Open decisions for GT:** amount of coffee-mosaic density on desktop and mobile, and whether mobile shows the full mixed feed or a short preview before `View all`. We can test these in F; neither requires rethinking the IA.

**Status boundary:** No production code, Supabase database, publishing, schema or auth modified in this design pass.
