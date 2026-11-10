# 20 — The fixed direction: Find, rate, buy

**Status:** Design direction **CONFIRMED** by the owner on 2026-11-10. The exact visual system, components and motion are **not** final; they are the next three phases below. No production code or database change is approved.

**Penpot:** file `New File 2` (`d2ec9836-375a-810a-8008-ebd27eb28057`). A non-destructive workspace restructuring is planned; the original boards and examples stay as historic references.

The workspace is now organized into dedicated pages for direction, identity, homepage, directory, coffee detail, ratings, personalization, components, motion, copy and remaining templates. The former G/H/I exploration page is preserved as `90 · Archive`. **[21 — Penpot Design Workspace](21-penpot-design-workspace.md)** is the page-by-page map, preservation note and next-phase handoff.

| Page | What is active |
|---|---|
| `00 · Direction & principles` / `01 · Visual identity laboratory` | Creative baseline and three **exploratory** identity treatments for next review; none selected |
| `02 · Homepage — I v2 (active experience)` | Original I-v2 desktop/mobile boards and two Penpot walkthrough flows, preserved |
| `03`–`06` | Editable **reference redraws** of directory/coffee/review/returning-user boards. Refer to page `90` originals for precise visual fidelity |
| `07`–`10` | Components, motion, copy, and other entity-template work areas |
| `90 · Archive — G/H/I explorations (originals)` | All 46 original boards retained |

## The direction

> A confident, distinctive evolution of ICB that preserves familiar browsing conventions while fundamentally improving visual storytelling, discovery continuity, review contribution and purchase journeys.

Familiar functionality, delivered through an exceptional experience.

1. **Two actions.** A visitor rates a coffee, or finds one and buys it from the roaster. The coffee page supports both; directory cards carry neither button.
2. **Conventional filters, packaging at the centre.** Roast, process, brew method and flavour work as people expect. Coffee imagery is the largest thing on screen.
3. **Every attribute is a doorway.** Estate, roaster, region, process and flavour each open the coffees that share them, in the same directory. No visible graph.
4. **A homepage that is alive and neutral.** One continuous editorial scroll: actions first, then new coffees, recent ratings, new roasters, field guide. No paid positions. Top Rated lives in the directory as a sort, with sample sizes.
5. **Ask, never assume.** A Buy click does not prove a purchase. Returning visitors are asked "Have you tried it?".
6. **Two funnels, measured separately.** Review: coffee view → rating initiated → submitted → repeat contributor. Purchase intent: coffee view → Buy click → roaster site.

The reasons and dates for each are in [07-decisions.md](07-decisions.md).

## Samples

These are frozen Penpot reference exports, **not a live data feed**. Real catalogue assets and dated database values were used in the storyboards, but some example labels, product placement, review text, simulated rating states and returning-user history are illustrative. Specifically, the I-v2 `Just Added` rail contains older filler cards and is **not a production-ready chronological feed**. Recheck counts, coffee/roaster identities, review data, recency and prices against the live site before implementation. See [21](21-penpot-design-workspace.md).

### Homepage (v2)

| Desktop | |
|---|---|
| ![Arrival](samples/home-v2-desktop-1-arrival.png) | **Arrival.** Search, Browse and Rate beside real packaging. |
| ![New coffees](samples/home-v2-desktop-2-new-coffees.png) | **New coffees.** A sideways gallery of recent additions. |
| ![Community](samples/home-v2-desktop-3-community.png) | **Community.** Recent ratings, new roasters, field guide, Rate. |

| Mobile 1 | Mobile 2 | Mobile 3 | Mobile 4 |
|---|---|---|---|
| ![](samples/home-v2-mobile-1-arrival.png) | ![](samples/home-v2-mobile-2-new-coffees.png) | ![](samples/home-v2-mobile-3-community.png) | ![](samples/home-v2-mobile-4-field-guide.png) |

![Motion grammar](samples/home-v2-motion-grammar.png)

### Directory, coffee page, rating

| Mobile directory | Mobile coffee page | Mobile rating sheet |
|---|---|---|
| ![](samples/directory-mobile.png) | ![](samples/coffee-mobile.png) | ![](samples/rate-sheet-mobile.png) |

![Directory, desktop](samples/directory-desktop.png)
![Coffee page, desktop](samples/coffee-desktop.png)
![Reviews and rating in place, desktop](samples/reviews-rate-desktop.png)

The earlier one-screen desktop homepage is kept for comparison: [samples/home-v1-desktop.png](samples/home-v1-desktop.png).

## Next steps, in order

### 1. Typography, colour, iconography, motifs

Starting point, as drawn:

| | I boards | Homepage v2 |
|---|---|---|
| Type | Fraunces, DM Sans, DM Mono | same |
| Ink | `#1E1713` | `#271B16` |
| Muted text | `#6B5E53` | `#78695D`, labels `#978575` |
| Terracotta | `#B14E28` | `#AD5433` |
| Star gold | `#B07A1E` | `#AD7C33` |
| Brown (primary) | `#4A2E1F` | `#4A2E1F` |
| Ground | `#F4EDE1`, card `#FBF7F0` | `#F4EDE2` → `#F0E6D8` → `#EDE1D1` by stage |

To settle here:
- One palette. The two sets above have drifted apart.
- Small-text contrast. Labels in `#978575` are about 3:1 and small terracotta text about 4–4.4:1 on these grounds; the minimum is 4.5:1.
- Whether the ground changes per scroll stage.
- Icon rules, including what `↗` means. It marks leaving for the roaster's site in the I boards and is used on internal links in v2.
- Star rendering, including a half star (4.5 currently shows five full stars).
- Motifs: the large soft circles, the mono eyebrow labels and the staggered packaging cards in v2 are the candidates.
- One image frame for mixed source imagery (pack shots, lifestyle photos, info cards).

### 2. Components

Buttons, cards, chips, filters, search, rating stars and sheet, review item, doorway strips, navigation. To settle here:
- One wording each for the Rate action, the search placeholder and the ratings link.
- One name for the collection (record, catalogue, directory and collection are all in use).
- Desktop and mobile versions of the same component carrying the same information (ways in, recently rated).
- Tap-target sizes on mobile.
- Remove annotation text from designs ("Scroll stage 01", "Packaging / roasters own their design").

### 3. Motion

Starts from the motion grammar board: static at first paint, one native sideways-scrolling gallery, reduced motion as an immediate state change, all content in the DOM, no WebGL on initial mobile load by default. **Working choice for the next prototype:** a normal horizontal rail on desktop and mobile; no vertical scroll hijack or pinned scroll-to-sideways mapping. Scroll-linked transforms/Three.js remain optional experimental enhancement behind performance/accessibility gates, not the base interaction.

### 4. Final copy and cross-template polish

Establish a concise, authoritative editorial voice and the factual/provenance vocabulary in parallel with visual identity; **finalize** CTAs, error/empty states, route labels, microcopy and consistency after component and interaction testing. Fix annotation text, contrast, screen-reader labels and mobile touch targets before any implementation handoff; don't assume these resolve solely by choosing a font.

## Open rules to decide before they are built

These are behaviour and content rules, not styling, so the phases above will not settle them on their own.

1. **Gallery behaviour — PROVISIONAL RESOLUTION:** native horizontally scrollable row on desktop and mobile. No pinning that converts vertical scroll into horizontal movement. Optional passive scroll-linked motion may be prototyped separately and must remain skippable/reduced-motion safe.
2. **Separate editorial selection from chronology — PROPOSED, needs owner test:** a neutral *Explore the catalogue* visual rail may rotate authentic coffees using a documented independent selection rule (e.g. diversify the first visible set across roasters), and must never claim those coffees were just added. A separate *Just added* feed is genuinely chronological, with actual dates/coffee counts and no older filler, even if several coffees came from one roaster. If too many consecutive new arrivals share a roaster, group honestly by roaster or widen a clearly disclosed recent window; do not silently fabricate recency. No sponsored placement or paid rank. Final policy and balance of diversity vs chronology are still OPEN.
3. **Copy accuracy — OPEN final system QA:** the catalogue totals are a dated verified snapshot, not automatically live numbers; anonymous rating supports **three distinct entities** before login; roasters are listed independently, not necessarily 'joining'; distinguish roaster claims, ICB inferences and drinkers' words. Treat gallery cards, ratings, reviews and prices in Penpot as dated examples, not a live production feed.
4. **Desktop/mobile parity — OPEN:** align navigation labels, search text, the quick Rate CTA, ratings links, facet entry points, actual data shown and the meaning of ↗ (reserve external-link signifier for leaving ICB).

## Deferred without being abandoned

The chosen I direction does **not** cancel the owner-approved vision for logged-in personalization, a contextual website AI Concierge (`3lokai/icb-chatbot`), or ethical monetization of aggregated coffee intelligence. These are later delivery phases, but need design homes and clear data/trust guardrails **now**:

- **Returning experience:** existing homepage hero segments/recent views and saved ratings/gear; don't equate view or outbound Buy clicks with an actual tasting. A personalized I homepage remains to be drawn and validated.
- **AI Concierge:** optional first-party guidance for choosing, brewing, interpreting reviews, and proposing explicit, validated filters/links. Never author fake independent reviews or alter organic ranking. No mandatory chatbot bubble; website integration isn't implemented.
- **Business flywheel:** credible distinct reviewers and coffee review coverage, quality/context, return-to-rate, purchase-intent click measurement (not assumed sales), representative aggregate insights, licensed data/API and industry research. [17](17-review-intelligence-and-monetization.md) remains binding.
- **Entity coverage:** roaster, region, estate, articles, tools, account and other site templates still need to share the identity and rating/discovery principles. Do not claim the homepage is the whole site.
- **Copy/content:** provenance labels, FAQ, negative/empty states and neutral editorial policy belong to the system, not a late cosmetic pass.

## Not drawn yet

- Desktop: directory reached through a doorway, returning-visitor homepage.
- Homepage v2 for a returning visitor.
- Roaster, region and estate pages, search results, account.
