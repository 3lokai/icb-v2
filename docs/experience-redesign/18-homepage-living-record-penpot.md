# 18 — Homepage E: The Living Record · One Continuous Scroll

**Status:** New Penpot homepage **design proposal** ready for owner review, 2026-11-09. Not implementation authorization, not a live data view, and not a finished animated browser prototype.

**Penpot:** Connected file `d3aee43a-8d21-8092-8008-e896e8d8af0c` (currently titled `New File 1`); page `E · Homepage — The Living Record (single scroll)`, page ID `c461c933-f942-8017-8008-eb923fb8afad`.

**Saved Penpot version:** `E / The Living Record — full homepage narrative, desktop + mobile · 09 Nov 2026` (revision 109). Validation: **0 errors**, text overflow audit: **0**.

**Artboards:**
- `DESKTOP / one continuous homepage · 1440 × 8240`, ID `c461c933-f942-8017-8008-eb92403f36e7`.
- `MOBILE / one continuous homepage · 390 × 8340`, ID `c461c933-f942-8017-8008-eb942811596f`.

**Penpot flows:** `Homepage / Desktop · one scrolling story`, `Homepage / Mobile · one scrolling story`. These are design/presentation flows, **not** a working website, live search, data binding or implemented scroll-trigger animations.

## Why this is a different homepage

This responds to the two explicit owner critiques of Phase 1D:
1. **Depth in the first impression:** the current ICB homepage has recent coffees, ratings, top rated, new roasters, articles and rich entry points; the earlier immersive design felt empty and documentation-like.
2. **A clear job for the visitor:** ICB needs to acquire authentic independent coffee ratings, tasting context and recurring contributors as the basis for trustworthy coffee intelligence and eventual ethical B2B monetization.

The refreshed homepage must be a *living, neutral coffee record with a reason to contribute*—not a static catalogue, a cinematic museum or a promoted coffee/roaster showcase.

## The single continuous narrative

The desktop and mobile boards are **one long vertically flowing page each**. They are not six detached screenshots or a forced scrollytelling slideshow. Chapters may change emphasis, but a single restrained connection thread, spatial composition and consistent editorial voice carry users along the page.

| Scroll moment | What the visitor understands | Concrete content + primary action |
| --- | --- | --- |
| 0. **Arrive** | ICB is the independent record of Indian specialty coffee, and the visitor has a role in it | Headline `India's coffee, in the making.`; clear `Find a coffee` and `Rate one I've tried`; audited catalogue/roaster counts; an immediate chronological activity teaser including new listing and community rating |
| 1. **It's alive** | The database is changing and people contribute | Activity stream with a newly added coffee, newly listed roaster, a community rating with **n=1** caveat, and fresh editorial reading, with dates and neutral discovery affordances |
| 2. **Follow a connection** | Each object is a way into real relationships; navigate without getting lost | Methods, flavours, origins, processing and varieties as direct entrances; one spatial semantic focus, few destinations, meaningful back trail; optional `Ask ICB about this connection` |
| 3. **Trust the evidence** | A seller description, an ICB estimate and a drinker's rating are different kinds of information | Honest independent-review evidence including n=1, n=2 and zero review states; CTA to community favourites with sample-size/methodology caveat; never invent consensus |
| 4. **Add your voice** | Independent contributions are the point of this platform | First search for a coffee genuinely tried → 1–5 rating → optional brew method and tasting notes → user-authored saving; the form in Penpot is illustrative and publishes nothing |
| 5. **Come back** | A member can resume their own real coffee world, not an invented profile | Saved coffees, personally marked tried-but-unrated, declared tastes and gear. In the actual app, these would **replace/adapt the arrival state for logged-in users**, not become a generic public homepage upsell section |
| 6. **Keep learning** | Atlas links naturally to deep knowledge and tools | Field Guide articles, brewing compass/calculators, roaster directory. More connected entry points, not siloed feature advertisements |
| 7. **Return to purpose** | Every genuine review improves the independent record | Closing `Find your coffee. Add your voice.`, dual find/rate CTAs, understated trust footer |

## First-impression density and neutrality

- Real activity **previews within first fold**: the design includes catalogue breadth, roaster breadth, latest catalogue addition and recent independent rating. The feed continues into more detailed dated update windows, not disconnected grids.
- No brand is **chosen to occupy the hero as an endorsement**. Brands may appear in chronological/catalogue activity lists with objective rules, equal editorial treatment and dates, not as paid product spotlights.
- **Top-rated coffees** get a clear entry point, but a true ranked list belongs behind transparent review-count thresholds and methods; do not make a 5/5 rating from one review a recommendation.
- Site neutral direct navigation (coffees, roasters, origins, articles, tools), search and rating remain visible without requiring scroll through a story.
- Main editorial headline and two explicit tasks are legible on mobile, while real data previews appear in the first screen/early scroll.

## Exactness and data status

**Not live:** prototype figures `1,688 public coffees` and `122 active roasters` come from the 2026-11-07 Phase 0 audit. Example names/dates `Jalebi`, `Madhumala`, `Ko Ho Coffee Co.`, `The Coffee Bloom` are reused from the prior Phase 1E Penpot design as **illustrative snapshot content** and have not been independently revalidated at implementation time. Review-value cards showing 5/5 with one opinion, 4.5/5 with two, and no reviews explain *evidence conditions*, not product rankings or paid placements. The design labels dated/snapshot nature of content.

Implementation must replace examples with real database/Sanity queries, correct timestamps, independent review entity type, moderation/visibility state, sample size, current stock/status and deterministic sorting. Never hardcode old totals into a shipping homepage. Show no-result/empty states honestly.

## Interaction and coding handoff (proposed, not built)

- Top-level `Find a coffee` opens fast existing search/facet flow. `Rate one I've tried` opens coffee search/selection then reuses the existing review system; do not copy the demo form into a competing API.
- Respect existing anonymous 3-entity rating cap, login merge, review edit/auth rules, anti-abuse moderation, consent and privacy; no automatic publishing or AI-written reviews.
- Graph lenses only navigate to supported data relationships and valid canonical destinations. Back/Forward and filter state must work.
- The `Ask ICB` contextual affordance can explain sources or propose user-approved actions, but no generic intrusive chat widget.
- Registered-user adaptation should use **real** tried/logged, wishlist, review, gear and explicit preference data, never infer consumption from clicks.
- Preserve SEO pages and accessible, useful DOM; use animated transitions/scene continuity carefully rather than scroll-hijacking. A reduced-motion mobile alternative should show the complete story and controls.
- Track contribution metrics: coffee-view → rating started → published review (with unique contributors, sample coverage, optional context, recency, fraud/moderation). Review is the business KPI, not scroll depth.

## Review criteria

1. Within five seconds, can a newcomer grasp the size/activity of ICB and how to find or rate a coffee?
2. Does activity feel like a living directory rather than a featured paid listing?
3. Does the Atlas carry them into actual usable connections rather than a documentation presentation?
4. Is independent evidence distinct from seller notes, ICB estimates and small-sample speculation?
5. Does the quick rating invitation feel helpful and voluntary rather than coercive?
6. Does signed-in personalization use *real* context and give a reason to return?
7. Are mobile design, search, performance, SEO, privacy and motion accessibility equally considered?

**Next gate:** owner reviews this Penpot page, identifies changes to composition/copy/density, then authorizes an isolated browser experience experiment. No production homepage change is approved by the existence of the Penpot file.
