# 13 — Living Coffee Atlas: Graph Navigation Contract and Homepage Foyer

**Status:** UX lead PROPOSAL for owner review, 2026-11-07. Not an accepted ADR, production specification, or request for implementation.
**Companion Penpot page:** `D · Homepage — a doorway to the atlas` in connected Penpot file `d3aee43a-8d21-8092-8008-e896e8d8af0c`.
**Basis:** owner prefers D to C, wants open-ended "chase the next node" exploration without being overwhelmed, wants visible context and reversible navigation, and cannot yet imagine the homepage. Source: Phase 0 audit, 12-signature-experiments-c-d.md and current discussion. Existing designs/pages untouched.

## North star

> **The atlas is not a giant graph; it is a series of meaningful encounters.**
>
> One subject is in focus. Show the visitor a few truthful directions it connects to. Let them choose, follow, remember, backtrack, browse directly and stop whenever they want.

The homepage is a **foyer**, not the full atlas or a forced introduction. The atlas starts when the visitor follows a path. Neither a node graph visualization nor a guided quiz is compulsory.

## 1. Graph objects vs catalogue properties

Treat catalogue data as a typed relationship graph, but distinguish **navigable entities** from **facets/collections** and **contextual content**.

| Object or relation | Current audit support | Proposed default treatment |
|---|---|---|
| Coffee | Canonical coffee details | Primary focus object |
| Roaster | Coffee `roaster_id`, canonical roaster routes | Prominent navigable entity |
| Estate | `coffee_estates`; 15 pass page gate but estate routes not yet shipped | Prominent only when verified; route launch decision open |
| Region | `coffee_regions`; canonical region topic pages live at `/coffees/<region-slug>`; `/regions` hub | Prominent navigable destination using existing canonical URL |
| Variety / varietal | Text only; audit says no normalised first-class variety entity | Secondary contextual field now; node/landing content only after normalization |
| Species | Structured coffee attribute | Technical facet/collection; promote when meaningful |
| Process | Structured coffee attribute with raw variants | Technical facet/collection; sometimes educational destination |
| Roast | Structured coffee attribute | Usually displayed as property/filter, not graph destination |
| Flavour notes/families | `coffee_flavor_notes` mapping to sensory taxonomy; multiple per coffee | One expandable group/hub ("Flavours · N"), not N equal-size orbiting nodes |
| Brew methods | `coffee_brew_methods`; multiple per coffee | One expandable group/hub ("Brews · N"), with direct filter/tool exits |
| Articles | Sanity spotlight links, weak reverse discovery | Only a linked editorial aside when grounded; do not fabricate |
| Tools | Existing separate tools and brew guidance | Contextual action, not a universal main graph node |
| Related coffees | Existing computed similarity RPC | Label reason and inference; a small capped shortlist |
| Taste profile | Preferences saved but unused for ranking today | A future attention-ranking input, only with clear controls/consent |

**Source distinction:** facts from 2026-11-07 audit. Treatment column is UX proposal. Some forms of node navigation require new relationship resolution, normalization, or pages.

## 2. Cognitive-load budget (first prototype)

- **One current focus.** Always a readable name and object type, with real photo or neutral visual when available.
- **Desktop: max 3 immediately prominent outbound directions**, plus at most 2 grouped "more ways" affordances.
- **Mobile: max 2 immediately prominent directions**, with a deliberate "See all connections" action.
- **Never render dozens/hundreds of neighbour nodes** at once; use collections with counts, pagination, sorting and search.
- For multiple flavours/brews: render **"Flavours (N)" / "Brew methods (N)"** as group doors. Inside the door, choose a note/method, then transition into a scoped result collection or a supported article/landing page. Keep the current context.
- A node's main outbound directions are selected based on **node type and available verified data**, not a global importance order. Coffee -> roaster/estate/region often strong; estate -> its region and coffees; roaster -> its coffee collection; flavour -> a faceted coffee collection; method -> suitable coffees and tools.
- Surprise is scarce: **no more than one editorial/contrast invitation at a time**, and only if its relationship can be explained accurately.
- De-duplicate equivalent or looping connections; visibly mark visited items or allow revisits, but do not let previous navigation disappear.

A coffee with multiple brew methods and six flavour notes should NOT have ten visible spokes.

## 3. A minimal navigator's mental model

Make navigation feel like changing focus, not teleporting between unrelated views.

1. **Current focus:** prominent type + name e.g. `COFFEE / Baarbara Naturals` or `ESTATE / Baarbara Estate`.
2. **Journey trail:** chronological path *taken* (not merely an entity hierarchy), e.g. `V60 › Baarbara Naturals › Baarbara Estate › BrewClan Naturals`.
3. **Back and forward:** browser Back/Forward must reverse focus changes; on-screen Back returns one transition. Permit jump to any visited breadcrumb. In mobile, show abbreviated trail with an expandable full-path history sheet.
4. **Global Escape:** one-tap Search/Filters at all times. Returning to Explore restores focus/trail without losing filters.
5. **Deep links:** visiting a canonical coffee/estate/region URL directly starts with that object in focus. The user need not have come through the homepage.
6. **Share:** every node's canonical URL and current user-facing filter state must be shareable; an optional "share this journey" feature can be a separate future decision.

**History policy to prototype:** significant focus changes use `pushState` (or Next navigation) to establish reliable Back behaviour; rapid facet adjustments can continue using `replaceState` until committed. Never silently break existing canonicals/robots. Decide detail-to-atlas URL semantics in the prototype, especially for unshipped estate/variety pages.

## 4. Relationship prioritization (proposal)

Prioritize candidates with a deterministic set of rules rather than requiring an LLM:

- Valid, directly supported relationship first.
- Sufficient data completeness to make the destination useful.
- Diversity: avoid three adjacent nodes that all represent the same category.
- Relevance to the *current* focus and, later, user-saved preferences.
- Optional curiosity/contrast with an accurate "why this?" description.
- Do not treat inferred similarity as provenance.
- Preserve user overrides: show all actual known connections in a lightweight collection drawer, even if not prominent.
- Offer a factual alternative when a relationship is absent; **never manufacture an estate/variety connection to fill the layout**.

A relationship resolver can operate over the existing Supabase schema and canonical URLs. A dedicated graph database is *not* a prerequisite, but the schema and data coverage should be audited before claiming all node types are equal.

## 5. Homepage: the foyer to the atlas

The homepage is **not** a collection of thousands of floating nodes. It is a calm invitation into the experience.

**Above the fold, desktop (Penpot `HOME D-H1`):**
- Quiet premium masthead with visible full search.
- One memorable line: "A coffee can take you places."
- 3 clear, equally legitimate doors:
  1. `I know what I want` — immediately opens existing technical search/facets.
  2. `Help me discover` — optional progressive prompts, grounded in actual attributes.
  3. `Follow a thread` — begins open-ended relational exploration, with no quiz or theatrical gate.
- **One real, rotating curated starting object**, not a dense graph: Baarbara Naturals is the demonstration; show only 2–3 proven connections (estate, roaster, variety when source normalization allows) and a straightforward "Explore this coffee" action.
- Copy and calls to action server-rendered; ambient visual depth is layered, late-loading and optional.

**Above fold + continuing mobile composition (Penpot `HOME D-H2`):**
- Headline and the 3 doors before the showcased thread.
- No 3D dependency for meaningful navigation.
- A compact related-object preview further down, with clear direct filter access.

**Returning visitors (Penpot `HOME D-H3`):**
- Replace theatrical intro with **"Pick up where you left off"** and actual recently viewed context.
- Provide `Continue`, `Start somewhere new`, and `Filters`.
- Demo uses a sample V60 -> Baarbara Coffee -> estate trail; the full cross-object path is NOT necessarily saved by the current app. Implement this state only after inspecting/reusing current `coffee_views` and defining the new trail storage, consent and lifecycle rules.

**Featured object's editorial policy:** start with a small deterministic human-curated rotation, not AI-generated copy or client-side randomization of the LCP. No fabricated "today's pick" endorsement unless actually curated. Only source-supported relations.

## 6. Interaction sequence to prototype BEFORE component library

Prototype these states using **existing Next.js/React/Tailwind/Motion**, without changing production routes or adopting R3F yet:

1. Home newcomer: three doors; direct expert path works with no welcome delay.
2. Enter from real coffee detail or the selected home coffee; focus displays current coffee and <=3 prominent doors.
3. Coffee → Estate; the coffee visibly recedes into navigable history.
4. Estate → another same-estate coffee/roaster; update history and preserve the trail.
5. Coffee → Flavours (N) group → one flavour hub/list (real multiple values).
6. Back twice, then direct Search/Filters; resume context.
7. Returning state with real data only; test keyboard, screen reader, no-motion and touch.

**Acceptance criteria:**
- A visitor can say **where they are, how they got there, and how to get back** at every focus.
- The visitor understands why each visible connection exists.
- Max visible relationships respected on mobile/desktop.
- Search and filters reachable in one action; no 3D blocking.
- Browser Back/Forward works; direct refresh/deep link does not require past journey state.
- Technical filters remain URL-driven and accurate; estimates vs catalogued facts distinguished.
- Motion never hides server-rendered content; mobile performance benchmarked against Phase 0.
- Only after this interaction model works: specify the node presentation, action controls, path rail, drawers, states, typographic system and motion tokens as **components**.

## 7. Open decisions to review with the owner

- Default visible connection priorities per focus type (coffee, roaster, estate, region, flavour, etc.).
- How many "free" relationships are shown on mobile vs desktop; initial proposal 2 / 3.
- Whether varieties need first-class normalized records and pages before graph promotion.
- The URL/history semantics when walking between existing deep links and internal graph views.
- Home curated selection update cadence and returning-user state storage.
- Whether to retain both theme modes; D currently uses atmospheric dark with bright expert/utility view, but this is exploratory, not approved.
- Whether spatial camera movement is compelling enough to justify any WebGL after a CSS/Motion prototype.

**Reminder:** UI primitives follow the interaction model. Avoid building a generic graph library or component kit before these behaviours are validated.
