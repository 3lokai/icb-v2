# 14 — Atlas Concierge, Homepage Composition and Voice (Proposal)

**Status: PROPOSED — user/UX review required. No implementation approved.**
**Date:** 2026-11-07
**Scope:** Design follow-up to 12-signature-experiments-c-d.md and 13-graph-navigation-and-homepage.md. D remains preferred prototype direction. Does not supersede DESIGN.md or production theme behaviour.

## New input from product owner

- We can take time to design this carefully before implementing the new experience.
- Varieties / varietals are not enums, but their names are already normalized. Avoid describing them as totally uncontrolled strings or assuming no normalization. The repo uses `coffees.varieties text[]`, `normalizeVariety` and an alias/description map in `src/lib/coffee/variety-info.ts`, but the audit found no standalone canonical variety table/entity as of 2026-11-07. Distinguish **normalized values** from **first-class relational entities**; check live database and other ingestion normalization code before changing the model.
- The existing separate `3lokai/icb-chatbot` project should be considered part of the site redesign, not left solely for Meta messaging.
- The user is worried about sitewide copy and strongly rejects a homepage made of independent stacked sections.
- The graph should remain understandable without dumping dozens of links; visible focus, reversible path, selective directions and a good home entry are essential.

## 1. Product architecture — three complementary systems

**Atlas:** typed navigation between coffee, roaster, estate, region, variety, species, process, flavour groups, brew methods, articles and useful tools. Relationships grounded in catalogued attributes, inferred similarity or explicitly curated editorial mapping; never equate them.

**Concierge:** optional, context-aware conversational support that can explain the current object, query the catalogue, diagnose brewing problems, and propose an explicitly actionable navigation/filter change. Its job is to improve decisions and curiosity, not to take over the interface.

**Atmosphere:** one spatial visual environment, purposeful choreography and constrained editorial voice that make navigation feel seamless and premium. Essential content and controls remain HTML, not WebGL-only.

Avoid creating three competing modes/apps. These are layers of a single experience.

## 2. Chatbot integration — current reality and proposed evolution

Repo `3lokai/icb-chatbot`, README checked 2026-11-07. As written, it is a **not-yet-deployed headless starter** for WhatsApp Business, Instagram professional DM and Facebook Page Messenger, explicitly **without a web UI**. It uses published Sanity articles, authenticated ICB coffee API, headless brew tools and OpenRouter, with draft/auto sending controls. It currently relies on text-channel conversation history and channel-specific preference data. Directly adapting its existing Meta webhook server into a browser endpoint would need design, auth, rate limits, CORS/CSRF protection and security review.

**Proposal:** reuse the factual retrieval/tool layer and LLM orchestration, add a secure first-party web assistant transport and structured `Atlas` actions. Keep `icb-chatbot` as an independent backend/service initially; do not fork its intelligence into the Next.js frontend or expose provider secrets to browsers. Later assess a common shared package for pure catalogue/coffee-tool functions.

Potential tools / actions: search, explain-source, open-object, apply-filter, suggest-related-with-reasons, compare, diagnose-brew, open-article. A response can contain both grounded natural language and **explicit suggested actions**. A model may propose navigation but the client validates object IDs/routes and the user confirms a major focus change; don't allow arbitrary URLs, queries or invented coffees. LLM prose is optional; factual relationships and filters remain deterministic.

**Where it appears:**
- Global quiet `Ask ICB` affordance near search, not an always-glowing floating chat badge.
- `Help me discover` is the guided entry; can use two or three grounded facet prompts first, with open text optional.
- Contextual invitation from a current object (e.g. `Why this variety?`, `How could I brew this with my Switch?`, `Show alternatives from this estate`). Desktop: adjacent panel; mobile: accessible bottom sheet. In both cases Atlas remains visible/recoverable.
- User never has to chat or provide login to follow relationships.
- No unprompted interruptive popups and no anthropomorphic avatar. The "expert host" is behavioural, not a literal person.
- Treat inferred taste and stored preferences as user-adjustable, consent-scoped. Don't automatically merge Meta identities with web accounts.

**Learning design:** On-device / anonymous ephemeral context can include current object and reversible trail for that session; persistent personal taste profile only where appropriate consent/account handling permits. Questions to design: session retention, export/delete, provider privacy, tokens, abuse/rate limits, and cross-channel linking.

## Concierge and community evidence — review-first extension

ICB is building independent coffee intelligence, not just an AI-curated catalogue. The Concierge can explain review distributions, sample sizes, review methodology, sensory vocabulary and how to record a genuine tasting. It may suggest `Rate the coffee you tried` when that status is actually known, but must **never write or submit a review on a user's behalf, invent a review or nudge a positive score**. Keep users' own subjective notes distinct from roaster tasting copy and ICB inferred sensory parameters.

Any `What do people think?` answer must cite actual independent retrieved reviews and qualify low counts; if evidence is absent, say so. A conversational transcript is not a sellable first-party review. Aggregate insights and commercial AI uses require separate rights/privacy review. See [17](../17-review-intelligence-and-monetization.md).

## 3. Homepage architecture — ONE evolving stage, not stacked sections

A homepage can be longer than one screen without using discrete cards/sections. Keep **one persistent visual anchor and one coherent spatial world**. The scroll reveals aspects of this world; it does not automatically select new nodes or move the user's canonical focus. User clicks change focus and actual navigable destinations.

### Continuous sequence (not independent webpage sections)

**Arrival:** a calm, concise welcome and visible direct search/filters. The focal object exists in the shared environment at rest, visually subordinate to the visitor's choice. Three equal-privilege actions: `I know what I want`, `Help me discover`, `Follow a thread`. AI concierge is a quiet fourth *capability*, not a compulsory fourth destination.

**Notice:** as the visitor scrolls a little, typography recedes and the featured coffee naturally becomes more legible; one or two true typed relationships emerge. The SAME physical/visual anchor remains; don't swap in another rectangular feature block.

**Invitation:** one factual but intriguing connection is visible and click-responsive. Hover/touch focus reveals why it exists; selection transfers Atlas focus. Unselected connections remain possible. No mandatory camera tour or auto-opened chatbot.

**Wander:** the same environment may reveal further potential dimensions such as source place, variety or flavours, but never exposes a big field of all catalogue nodes. A subtle concierge prompt can appear near an object only when invited.

**Departure / continuation:** rather than more thematic sections for Tools, Articles, Ratings, etc., the atlas becomes the navigation surface to those objects, while the persistent practical global nav carries direct routes. Any footer is quiet utility, not a giant catalogue of marketing tiles.

On mobile, prioritise direct intent entrances, then show the scene teaser as a scroll continuation; avoid WebGL as a prerequisite for LCP. Performance, reduced-motion and no-JS alternatives retain meaningful semantic copy and actions.

**Returning visitor:** replace the generic welcome with last-viewed context where supported; do not pretend a cross-object journey is saved unless the feature exists.

**Rule:** scroll changes vantage/awareness; click or explicit selection changes **focus**. This resolves tension between scrollytelling and reversible graph navigation.

## 4. Copy — sitewide voice system (not LLM-generated filler)

The UX's luxury/hospitality metaphor is a **tone benchmark**, not a command to write flowery prose everywhere. The right copy varies by function.

| Register | Purpose | Example direction |
| --- | --- | --- |
| Arrival | One warm, distinctive invitation | `Find a coffee. Follow what interests you.` |
| Navigation | Transparent, immediate action | `Explore this estate`, `See coffees with mango notes`, `Back to Baarbara Naturals` |
| Data | Precise, neutral, sourced | `Light roast · Natural process · SLN 795`; `Mango, dry coconut — roaster notes` |
| Concierge | Intelligent, helpful, economical | `Want coffees from this estate, or something with similar notes?` |
| Serendipity | A brief grounded reason to wander | `Another roaster uses beans from this estate. Their listed notes are quite different.` |
| Provenance | Meaningful, not apologetic | `Acidity: 4/5 · ICB estimate` (expand for method/confidence) |

Avoid generic `Every bean has a story`, automatic syrupy marketing copy, fabricated tasting certainty, "mysterious" lines on every object and generic "You might also like" labels with no evidence.

**Content strategy:** one carefully authored homepage headline and a small maintained bank of editorial micro-introductions, plus deterministic labelled relationship copy based on fact/source; optional AI explanations on demand. No requirement to produce thousands of bespoke stories or expensive real-time LLM text just to traverse a data graph. Establish a copy QA process across catalogue, articles, direct filters, errors and empty states.

### Alternative homepage lines to test — not a decision

1. `Find a coffee. Follow what interests you.` — clear and actionable.
2. `A coffee can take you places.` — emotional, already in exploratory Penpot board.
3. `Start with coffee. See where it leads.` — especially consistent with the atlas metaphor.

Judge each against a first-time user's ability to understand what ICB *is* within seconds; the headline must not replace a literal descriptive line about Indian specialty coffee.

## 5. What to design before individual cards/buttons

1. A state model with focus object, source confidence, visited trail, outbound grouped relations, filters, selected object, user-supplied preferences, assistant panel state and back/forward behaviour.
2. The homepage stage's **four consecutive keyframes**, showing what remains visually persistent and how scroll changes awareness without automatically moving focus.
3. An in-context assistant exchange that demonstrably leads to a real filter/action and can be declined.
4. Two no-AI paths: expert direct filtering and graph exploration; both must remain first-class.
5. A scoped browser prototype of focus, trail, source labels, assistant action confirmation and reduced-motion behaviour.
6. Only THEN a component system (node objects, relation group affordances, breadcrumb trail, guide panel, filtering overlay, provenance, visual tokens).

These are proposed priorities; obtain owner review before committing technology, rebrand or production changes.

## 6. Questions requiring deliberate decisions

- Does `Ask ICB` launch as an on-site Q&A first or should it be able to manipulate Atlas navigation immediately?
- Where is the boundary between deterministic guided facet prompts and LLM conversation?
- What constitutes a fully traversable variety node given existing normalized string values but no separate canon variety table?
- Do mobile and desktop use one dark atmospheric theme with bright utility mode, or preserve user's existing theme choice?
- How is cross-object session history saved and cleared, and what is public / anonymous / account-scoped?
- Which single homepage headline is the most legible description of the product and the most compelling invitation?

**No production route, schema, tokens or meta-channel operations should change as a consequence of this proposal.**
