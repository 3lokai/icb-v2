# 15 — A Fresh ICB: Homepage Motion Screenplay + Concierge Action

**Status:** DESIGN PROPOSAL / creative reset for owner review — not a production implementation, theme decision, rebrand ADR or approval to change SEO routes.  
**Date:** 2026-11-09  
**Source:** `01-vision.md`, `07-decisions.md`, `12-signature-experiments-c-d.md`, `13-graph-navigation-and-homepage.md`, `14-concierge-homepage-and-voice.md`, and owner direction: **“It needs to be a refresh, not an upgrade.”**

## Decision to carry into every design review

**This must NOT feel like the existing ICB homepage with fresher fonts, a dark theme, prettier coffee cards, a longer hero or extra animation.** A refresh means a new visual grammar, a rethought visitor journey, a single authored spatial composition and a coherent way to move through knowledge. We keep ICB's product truth (catalogue, technical facets, URLs, trustworthy information), not its current page layout or visual conventions.

The homepage is not a graphic representation of the entire network, nor an AI chatbot landing page. It is a **threshold to an explorable coffee world**. Its signature is how a single environment continuously reorganizes around what the visitor is attending to.

### New expressive territory to test — 'The Locus'

A dark ink/mineral world, sculptural spatial aperture, carefully placed typography, restrained light and a single original graphic language for identity, place and relationship. No literal café, host avatar, cup flying through 3D space, stock coffee-shop photo, carousel, rows of listings, wall of dots, generic constellation web, glow-everywhere aesthetic or floating-card SaaS dashboard. This is a **proposed new art direction, not a production brand**.

**Core idea:** A singular, persistent 'locus' is the viewer's point of attention. It exists before any coffee is selected. Its layers shift and unfold to reveal one real coffee, then its verified relationships, then the next focus. This is an encounter with the same world, not four independently animated sections.

**Possible style language:** midnight ink/mineral `#0C171A`, warm alabaster `#EEE8DE`, patinated copper `#C8A77C`, muted green-gold `#A7B7A6`; large high-contrast editorial typography with crisp utilitarian labels. None of these tokens is approved. Typography must be tested separately; don't simply import DESIGN.md's old choices.

## Spatial rules

**Persistent:** one locus/ambient background, ICB identity, global Search/Filters, current focus context, accessible Back trail once navigation starts.

**Mutable:** one central focus, up to three proven relationship directions, one optional contextual editorial/concierge invitation, small selected object and provenance labels.

**Disappear when not relevant:** hero headline, earlier spotlight text, decorative guides; these do not reserve empty blocks and do not turn into cards below.

**UI principle:** **scroll changes vantage and awareness; deliberate click/keyboard choice changes graph focus and address/history.** Scroll alone must never silently navigate to a coffee/estate or insert history entries.

**Composition principle:** Mobile and desktop are intentionally art-directed differently, not automatic responsive crops. Mobile gets entry choices and direct filters immediately; the scene becomes progressively expressive below, without a mandatory WebGL frame.

## Four consecutive states of the SAME homepage world

These are storyboard states, not four sections or four mandatory steps. Keyframe (K) descriptions require explicit indication of which visuals persist, transform or exit. Frames 3 and 4 occur only after selecting a real object; they must not be triggered solely by scrolling.

### K0 / ARRIVAL — “This is a place worth entering”

**User action:** First load. No motion required to access anything.  
**Copy:** `Find a coffee. Follow what interests you.`  
**Supporting line:** `Explore India's specialty coffees, the people behind them, and everything that connects them.`  
**Navigation:** three equally legitimate actions, clearly visible: `Find precisely` (direct search, brew/process/roast and other facets), `Help me choose` (optional 1–3 grounded facet prompts), `Explore connections` (enter Atlas). A small `Ask ICB` utility near global search exists as a capability, not a fourth gate.

**Visual:** At left, unusually confident typography and deliberate negative space. At right, the single large locus is visible but intentionally unresolved: part lens, part spatial aperture, with one gentle material/light relationship. This is not a giant coffee bag card. The coffee *emerges* if someone explores.

**Motion:** slow ambient light on pointer/scroll only, respecting reduced motion. Entrance title stays readable as HTML; no loading theatre. `Search` works before expressive JavaScript.

**Accessibility:** K0 must be useful in 2 seconds; legible H1, useful nav labels, direct browse.

### K1 / NOTICE — “The world notices what I am interested in”

**Trigger:** User scrolls a little, **not** a graph navigation.  
**Textual transition:** Headline becomes smaller/quieter and can partially recede, without disappearing from semantic HTML. The foreground is now a specific real coffee (Baarbara Coffee Naturals is the known sample).  
**Factual microcopy:** `Natural · Light · SLN 795` and `Mango, dry coconut — roaster notes`, `from ₹600` (dated catalogue snapshot; recheck).  
**Visual persistence:** The original locus stays in exactly the same visual coordinate system. It gains one focal surface containing the coffee, not an unrelated second-stage card. The site's 'three entrances' rearrange into a compact utility rail instead of moving down into another section.  
**Invitation:** `Start with this coffee`, `See the catalogue`, or `Ask ICB`. If there is no suitable featured product, render a known editorial topic rather than fabricate one.

**Motion:** intentional camera/dolly or DOM transform; no high-frequency idle animation and no forced smooth-scroll engine. Scene starts from useful HTML.

### K2 / REVEAL — “Every coffee has directions worth following”

**Trigger:** User explicitly chooses `Start with this coffee` (click/Enter/tap).  
**Focus:** `COFFEE / Baarbara Naturals`. One source-image/identity persists visually.  
**Outbound relationships:** `Grown at: Baarbara Estate`, `Roasted by: Baarbara Coffee`, `Variety: SLN 795` (presently normalized display value/alias, not a fully canonical relational entity). These are **typed destinations**, not equal-size cards. `Flavours (2)` and `Brew methods (N)` may be grouped affordances; N comes from real data, never invented.

**Persistent trail:** `Home › Baarbara Naturals`. Browser Back works; changing focus is an explicit meaningful history event.  
**Motion:** The new relationships become visible as light / depth / labels *connected to the single focus*, rather than a new section containing three cards. The former headline yields space without moving scene to an entirely different design.

**Interaction quality:** focus can be changed via mouse, touch or keyboard. Relationship labels explain why they exist. No arbitrary network density.

### K3 / FOLLOW — “The next object becomes the world”

**Trigger:** User explicitly clicks `Baarbara Estate`.  
**Transition:** Exactly the same visual scene shifts focus; the coffee's physical/visual identity recedes into the trail. The estate is foregrounded through a *labelled regional illustration* or verified estate visual—not mistakenly represented stock imagery. All related information persists in semantic HTML.  
**Focus trail:** `Home › Baarbara Naturals › Baarbara Estate`.  
**Next directions:** e.g. regional context; `Coffee from this estate`; `Other roasters using this estate` with BrewClan example if independently supported. Unavailable variety pages or unshipped estate routes must not become fictional live URLs.

**Contextual prompt:** compact `Ask ICB about this estate` in a peripheral rail, **no modal opening automatically**.  
**Motion:** 450–700ms proposed focus translation, but real duration is subject to usability testing; reduced motion uses immediate state replacement and a visible focus announcement.

**Key outcome:** the visitor knows what they're looking at, where they came from, what connects next and how to reverse the change. The homepage hasn't been *scrolled through*; one world has become a new world.

## Concierge — one worked, consented, user-initiated exchange

This extends the existing `3lokai/icb-chatbot` headless starter. Its README currently describes a Meta-channel-focused, not-yet-deployed service with no web UI. The site integration is a **new proposed capability**; no web endpoint, session agent, client actions or cross-channel identity linking is assumed to exist.

**State A — Quiet affordance:** At K3 (estate focus), show a small `Ask ICB` affordance and one context-aware suggestion, without blocking exploration. Nothing auto-opens.

**State B — User asks:** `Show me natural coffees from this estate that work with V60.`

**State C — Deterministic resolution:** The assistant identifies the *current* estate from the verified Atlas context, maps `natural` to process and `V60` to the actual brew method ID, then calls the authoritative catalogue query or a validated server-side action. It returns real results or honestly says none. No invented count, prices or tasting notes.

**State D — Suggested action:** Assistant responds with a short factual summary plus `View matching coffees` and `Not now`. The client validates entity/filter parameters and presents what will change. A **user tap** activates the action; the LLM does not silently manipulate state/history.

**State E — Atlas update:** Atlas focus transitions into an actual coffee-result collection for the estate with the active process/brew method facets. The trail becomes `... › Baarbara Estate › Coffees (Natural · V60)`; URL shareability and browser Back are maintained. Show result count from actual query, not mock data. Assistant recedes to a compact affordance.

**Constraints:** Site visitor must not be forced into chat. Don't pipe private identity, saved taste data or Meta-channel conversation into OpenRouter without consent/privacy review. Reuse the factual backend instead of embedding freeform LLM strings into routes. Prioritize structured responses/actions, provider rate limit and session controls. AI is a companion for interpretation and requests, not the graph's source of truth.

## Copywriting — a new voice, not upgraded marketing

- **Arrival:** intriguing, immediately comprehensible, no 'revolutionize your coffee journey' cliches.
- **Discovery:** use concise typed relationship language (`Grown at`, `Roasted by`, `Also from this estate`).
- **Evidence:** `Mango, dry coconut · roaster notes`; `Acidity 4/5 · ICB estimate` with details on demand.
- **Concierge:** articulate and helpful, not breathlessly enthusiastic, flirty or anthropomorphized.
- **Serendipity:** one precise reason to look elsewhere, not generic 'you may also like'.
- Avoid pretending a personalized experience exists without an actual taste profile or visit-history signal.
- Editorial voice is authored and maintained for hero and featured stories, template-driven for factual relations; LLM explanation is on demand.

A rewrite should be sitewide: navigation, empty states, labels, guided choices, relation explanations, errors, trust/source disclosure and direct filters. SEO body copy remains descriptive, factually valid and not dependent on animations.

## Responsive motion / technical contract

- **Desktop:** visual stage may be fixed / sticky during a limited scroll range, with a separate semantic DOM layout. Scroll controls presentation, clicks control graph focus. Do not trap wheel/touch.
- **Mobile:** entry actions and search visible without scene. Nonessential 3D is behind a device/performance/reduced-motion gate; default to static composited content until validated.
- **Performance:** existing mobile lab LCP 5–8s is already concerning; no JS-heavy stage on initial LCP. Use Next.js/React/Tailwind/Motion first and attempt deeper spatial scene in small isolated experiment only if necessary.
- **Reduced motion / no JS:** complete HTML content and navigable typed links; no experience gate, no hidden essential facts.
- **History:** `pushState` / Next navigation for deliberate focus changes; rapid filter typing stays `replaceState` until a deliberate committed state. Preserve canonical URLs and SEO data.
- **Theme:** Current ICB supports light/dark. Whether the refreshed Atlas consolidates to one art-directed theme is OPEN; no theme deprecation without user approval.

## What to test before cards/buttons/component kit

1. Can an unfamiliar user tell within five seconds that ICB is about Indian specialty coffee and discovery, not just an art project?
2. Can they choose direct brew/process/roast filtering in one action?
3. Do four keyframes feel like one continuous scene when animated (not stacked hero+section+section)?
4. At K2/K3, can they identify current object type, relation meaning and journey trail at a glance?
5. Does browser Back (and on-screen Back) reliably restore the prior focus/filter state?
6. Does a user recognize the assistant's suggestion is optional and consciously approve the proposed navigation?
7. Does a lower-end mobile device retain meaningful functionality with no animation and no WebGL?

## The artifact and approval gate

- **Next artboard:** four **consecutive states of the SAME composition** + a three-frame contextual Concierge action sequence. This supersedes the earlier simple three-entry homepage board as the creative experiment, **not** existing production site tokens.
- **Next build:** a contained browser behaviour prototype using real catalogue data and reversible state, only after owner chooses among this art direction and any alternatives.
- **Do NOT** build a full component library, new AI platform, schema migrations, a homepage redesign PR or production rollout from this document alone.

**Owner review prompt:** Does the refreshed ICB feel like entering a single responsive world with real coffee knowledge and welcoming autonomy, or does it still feel like a homepage with expensive motion? Reject it if it's the latter.
