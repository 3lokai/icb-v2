# 23 — Living signals → real review contributions

**Date:** 9 November 2026  
**Status:** Phase 1E experience proposal for owner review. **Design-only**: no production route, database, tracking, authentication or submission changes.
**Prototype:** [Phase 1E — Living Activity](../../prototype/atlas-phase1/experience-v5-living-activity.html)  
**Preceding immersive exploration:** [Phase 1D](22-immersive-progressive-reveal.md).  
**Penpot:** `D · Phase 1E — Living activity & rate conversion`, four native frames.
**Owner correction:** the existing site has most information already; its modules feel disconnected, and the immersive redesign needs to demonstrate genuine freshness **and** clearly invite visitors to rate coffees they actually tried.

## 1. Audit: the existing website is not lacking content

Read-only inspection of live public pages (9 Nov 2026; web crawlers can lag), current `main` component code and read-only production database confirms the site currently provides:

- **Homepage:** a segmented visitor hero, global coffee/roaster search, quick method/process/roast facets, a recent-additions ticker, Top Rated, recent signed-in community reviews, new arrivals, coffee collection tiles, 42 SEO-discovery links, reviewer profiles, roaster ecosystem, Sanity articles, curated voices, editorial FAQ and CTA.
- **Directories:** `/coffees` has working sort/filter URL state and per-card ratings / “Rate it” affordances. `/roasters` has roaster profiles and product collections. Canonical coffee detail is **`/roasters/[slug]/coffees/[coffeeSlug]`**, with a rating form already present.
- **Field Guide:** `/learn` had 91 articles in the recently indexed public page, grouped into five pillars, with the latest indexed article “What the Coffee Bloom Does and How Long to Bloom” dated **26 Oct 2026**.
- **Tools:** ratio calculator, expert recipes, Coffee Compass and grind converter, each already operational as its own page.
- **Personal area:** user profile, wishlist, reviews, preferences, privacy; returning-visitor homepage segmentation based on existing profile/recent coffee state.

### Where the connections break

1. **Separate homepage bands**, each with unrelated visual context, repeated entry choices and its own CTA. The visitor cannot see **new roaster → new coffee → review status → relevant brewing help → contribution** as one journey.
2. The “All ratings / add yours” anchor from `FreshFromCommunitySection.tsx` routes to **`/coffees?sort=rating_desc`**, not to a search-to-rate flow. A user who has a coffee in mind must separately find it, open its profile and initiate the rating.
3. The card-level “Tried this? Rate it” functionality exists, but it only helps if the user happens upon the *correct* coffee card. **A clear global “I tried a coffee” action is missing.**
4. `fetchRecentAdditions()` already supplies last-14-day coffees and roasters; `NewArrivalsSection` supplies newest product cards; `fetchFeaturedReviews` supplies a short, curated review/comment sample; `EducationSectionServer` supplies recent Sanity articles. **No current data pipeline needs to be invented** to demonstrate the living directory.
5. The latest arrivals can be dominated by multiple coffees from one newly ingested roaster (observed 7 Nov examples from Zupreme). A representative-looking “latest” display needs **explicit chronology and fair diversity display rules**, not hidden seller preference.
6. Existing Top Rated sorts by community average; many products have very small samples. A top-rated heading alone can imply stronger consensus than the evidence justifies.
7. Search scope is limited to coffees and roasters, not articles, tools, regions or estates. Keep the direct catalogue search for rating; cross-entity search is a separate feature.
8. Review integrity remains a P0 launch blocker (status/delete revision resurrection, anonymous-cap fail-open, identity merging and moderation), identified in alignment review; no production write was made here.

**Diagnosis:** ICB does not need more content sections. It needs **shared context, clear purpose, visible recency and a dependable contribution journey**.

## 2. Actual observed freshness (read-only production, 9 Nov 2026)

| Signal | Grounded reading | Presentation caution |
| --- | --- | --- |
| Active coffees | **1,714** | Inventory count, not number of independently rated coffees |
| Active roasters | **122** | Catalogue present; “active” is a DB flag |
| Active coffees added 2–9 Nov | **58** | By `coffees.created_at`; “newly catalogued”, not necessarily a new product release |
| Active coffees added 26 Oct–9 Nov | **103** | By `coffees.created_at`, this is not the site's cached public materialized-view tally |
| New active roasters 26 Oct–9 Nov | **3** | Ko Ho, Navees Farm & Roastery, True Tribe; all show 6 Nov creation |
| Current coffee-review records dated since 2 Nov | **14** | From `latest_reviews_per_identity`; deduped currently active identity/entity records with dates, not 14 verified buyers |
| Current coffee-review records dated since 10 Oct | **33** | Same definition; does not establish 33 new unique contributors |
| Coffee listings with any current review | **147** of 1,714 | Sparse; avoid an authoritative aggregate community verdict |
| Recent article | **“What the Coffee Bloom Does and How Long to Bloom,” 26 Oct** | Most recent indexed article in the public Field Guide crawl; don't call it published “this week” |

Source evidence verified:
- Monsoon Coffee Co **Jalebi**: coffee catalogued 7 Nov, **0 current reviews**.
- **Ko Ho Coffee Co**: active roaster added 6 Nov.
- True Tribe **Madhumala**: currently one rating with score 5, dated 9 Nov. One review does *not* imply consensus.
- Hunkal Estate **Tiger Reserve Coffee Beans**: one current 4-star entry dated 7 Nov.
- Zupreme **Red Wine Barrel Aged**: catalogued 7 Nov, zero current ratings.
- The prototype's other Baarbara shared-estate examples were previously verified using `coffee_estates → estates → canon_estates`.

**The prototype is frozen at this snapshot.** Production should fetch its own streams using existing cached queries/RPCs, attach a real as-of timestamp, handle low activity honestly and not manufacture recency.

## 3. Phase 1E — a visitor can tell what to do

### At the first fold

A calm, neutral entrance still has a meaningful primary action:

> **★ Rate a coffee you tried**  
> Secondary: **See what's new**

A short line provides factual proof of activity (date-scoped counts), with an explicit drill-down. No default paid/featured roaster, no compulsory account signup and no fake visitor tasting history.

### After one scroll

The **same continuous camera and field** reveals four distinctly typed activity nodes, each sourced and dated:

- **New coffee:** one chronologically sourced new coffee, its roaster, verified catalogue detail, and “Tried it? Rate it” inside its context.
- **New roaster:** newly listed roaster and a link to its actual catalogue.
- **Recent independent opinion:** a selected *current* rating event and a route to the exact coffee. Never silently select only positive sentiment for promotion.
- **Field Guide:** most recent indexed article, with true publication date, presented as editorial rather than community opinion.

Nodes are related by a provenance-aware scene composition; they do not imply that the article, roaster and rating are causally or commercially connected. These are **different events in a living index**, not ranked endorsements or staged partner promotions.

### Anytime, from anywhere

A persistent **Rate a coffee** action opens **coffee search first**. Choose an actual coffee; then select 1–5 stars. Brew method and written impressions are **optional**. The action stays available while scrolling, and a real canonical detail link remains reachable. The demo preview never writes or increments a counter.

We should strongly distinguish **friction removal** from **rating inflation**. Avoid pressure on visitors who never tasted a coffee and never promise rewards for 5-star scores.

## 4. Connected journeys we must preserve

**Arrival → contribution:** Home → “Rate a coffee” → search whole coffee catalogue → exact coffee → one-star-input action → optional context → identity/privacy/anonymous-limit handling → publish → success state with canonical coffee review and optional personal journal return.

**Activity → discovery → contribution:** New roaster → its actual coffees → real coffee detail → review evidence → “Have you brewed this?” → optional rating. No all-site homepage detour required.

**Knowledge → product → review:** Field Guide article (e.g. bloom) → source-backed brew method and actual coffee directory filter → visitor finds a brewed coffee → contributes independently. Articles retain SSR and SEO canonical routes.

**Returning user:** Personalized “continue here” using **real** recent views, explicit saved preferences and actual submitted reviews only. Do not equate wishes or page views with tasted history; `user_coffees` is currently empty.

## 5. What must be revised before implementation

**Component contracts, not visual-card reskins:**
1. `RecentActivityEvent`: `type` (coffee|roaster|review|article), `id`, `canonicalHref`, `occurredAt`, `source`, `title`, optional `entity`, meaningful fallback. It must not blend seller claims with independent reviews.
2. `RateEntry`: actionable global route starting in coffee search, not a predetermined product.
3. `ReviewEvidence`: current deduped ratings, count, recency, source and user-controlled edit/report (once integrity is fixed).
4. `AtlasFocus`: a route-aware selected object with native Back, shareability, reduced-motion/keyboard parity.
5. `WhatChanged`: a compact activity narrative, not an infinite marquee dominated by one seller.

### Minimum telemetry for an experiment

Use privacy/consent-compliant, dedupable events:
`home_impression`, `activity_seen` (with `activity_type`), `rate_entry_clicked` (`source`), `rate_search_started`, `rate_coffee_selected`, `rating_started`, `rating_client_submitted`, `rating_server_accepted`, `review_published`, `contribution_returned`. Reconcile with existing PostHog `rating_started`, `rating_form_submitted` and server `review_submitted` instead of blindly duplicating them.

**North-star experiment metric:** valid published independent coffee ratings per **1,000 qualified coffee-detail visitors**. Secondary: homepage visit → rating-start and server-accepted rates, unique contributors, coverage across less-reviewed roasters, 30/90-day repeat contributors, invalid/abusive review rate, plus mobile page performance. Compare cohort and source; don't infer conversion from unrelated 90-day event totals.

### Production gates

- Correct review edit/delete/tombstone semantics and anon-limit fail-open.
- Confirm account/anonymous handoff with return to exact coffee.
- Preserve accurate review counts, negative feedback, community provenance, user privacy.
- Keep all canonical routes, indexable deep-link content, structured data, current search/facet URLs and accessibility.
- Mobile p75 LCP <=2.5s, INP <=200ms, CLS <=0.1 on real route rollout; isolate heavier motion behind progressive enhancement.
- Publish no personal identity or raw review data commercially without legal/privacy rights analysis.

## 6. Review outcome sought from GT

The current **Phase 1E** prototype is meant to answer two questions before we design the full templates and component library:

1. **Does the immersive Atlas finally look alive?** The first scroll reveals genuinely new catalogue additions, recent reviews, a new roaster and a recently published article—not four isolated, generic feature sections.
2. **Do you immediately know how to rate a coffee you've tried?** Test the fixed Rate action and choose a specific coffee from the small sample, select stars and preview success.

If both succeed, the next design work is the **mobile canonical coffee detail + organic discovery landing**, which inherit the same review-entry and activity-context mechanisms. Only then start the reusable component contracts.

**Creative intent:** The moment of awe is the depth and evolving knowledge, not animation alone. The next valuable action is an independent rating, not scrolling to the end of a showcase.
