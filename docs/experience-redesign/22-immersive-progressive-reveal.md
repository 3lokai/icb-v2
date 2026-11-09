# 22 — Phase 1D: Immersion through progressive coffee intelligence

**Date:** 9 November 2026  
**Status:** ACTIVE CREATIVE DIRECTION FOR OWNER REVIEW, not implementation approval.  
**Prototype:** [experience-v4-immersive.html](../../prototype/atlas-phase1/experience-v4-immersive.html).  
**Supersedes:** Phase 1B's stacked homepage and Phase 1C's mostly-static one-screen orbit. The earlier versions remain available for comparison.
**Approval context:** User said Phase 1C was acceptable but had drifted from the main brief: the homepage must be immersive and show ICB's depth of detail after the first one or two folds.

## The critical correction

**“Not stacked sections” does not mean “one static screen with six buttons.”**

The new homepage is an **entrance to a world that becomes richer as you travel**. There is *one* persistent spatial scene; scrolling changes vantage, visual scale, subject, and type of contextual detail. The user learns something new in each beat. The site-wide navigation remains available without forcing this journey.

The metaphor remains thoughtful hospitality in a cultured institution: restrained at arrival, revealing layers of knowledge as the guest explores. No literal café environment, sales showroom, fake personal history, or pay-to-play homepage spotlight.

## What this prototype demonstrates

| Position in journey | Experience | ICB evidence revealed |
| --- | --- | --- |
| Fold 1 / initial | Quiet typographic entry; ambient constellation of coffee concepts; clear search and “look closer” invitation | No branded hero coffee or implicit endorsement |
| Fold 2 / first descent | The camera advances through a network of method, process, origin, review, and knowledge relationships | Dated snapshot: 1,714 active coffees, 147 with at least one current submitted coffee review; direct catalogue paths |
| Fold 3 / estate lens | View travels from the general graph to one verified origin and three interpretations, arranged as spatial objects | Baarbara Estate links to Baarbara Coffee Naturals, BrewClan Baarbara Naturals and Blue Tokai Baarbara Estate, via `coffee_estates → estates → canon_estates`; process and roaster differences |
| Fold 4 / community layer | Same estate thread becomes a desk of submitted review evidence: two unrated examples, one low-sample rated example | The Blue Tokai record has 4.5/5 from 2 current submitted ratings; the others have 0. No invented tasting quotes or fake consensus |
| Fold 5 / applied knowledge | Scene shifts into contextual reading and tools rather than a standalone horizontal section | Existing `/learn`, `/tools/coffee-compass` and real destinations |
| Fold 6 / contribution | An unfilled tasting-journal object invites genuine review after someone has tried a coffee | Non-persistent rating preview and existing `/dashboard/my-reviews` path; no personal history inferred or created |

This is **not** six separate blocks stacked in the viewport: one sticky full-viewport environment changes its focus as the page naturally scrolls. The native scrollbar still works. An accessible, explicit chapter rail and “Scroll deeper” buttons allow precise navigation.

## How immersion must work in production

1. **Purposeful reveal:** scale from general → precise. Don't show a 1,700-item graph; expose a few legible verified connections while retaining search/facet off-ramps. Every reveal answers an actual coffee question.
2. **Camera as context:** scroll can affect the visual vantage, parallax, spatial depth and editorial emphasis, but never silently select/endorse a seller or modify permanent route state. Clicking a real coffee is explicit.
3. **Factual precision:** type every connection (direct catalogue fact, roaster claim, editorial relationship, independent review, model inference). A shared estate is *not* taste similarity.
4. **Reviews as revelation:** no price-centric funnel. Distinguish zero reviews, thin evidence and richer community testimony. Preserve the user's ability to rate a coffee after a real tasting; never falsely claim purchase verification.
5. **No fake personalization:** the logged-in journey must be based on saved/recent/actually reviewed items and respect user control and consent. This static experiment intentionally shows a blank journal.
6. **Existing product depth, not a new marketing brochure:** keep the functioning /coffees filters, roaster pages, 42 search-optimized landings, articles, tools and private dashboard. Rich visual treatments do not replace SEO-meaningful HTML.
7. **Performance:** CSS/SVG and native browser rendering prove the UX concept; final use of R3F/Three.js/GSAP/Lenis remains undecided. Experiment with added depth only if it delivers meaningful benefit under mobile lab budgets. Prefer progressive enhancement.

## Interaction acceptance

- [x] First fold neutrally introduces the atlas without featuring a brand.
- [x] At roughly one fold of scrolling, the relationship structure and actual catalogue/review coverage appear.
- [x] After roughly two folds, visitors encounter a verified real origin and multiple distinct real coffees.
- [x] The next beat confronts the visitor with independent review evidence, including absent and very small samples.
- [x] Learn and Tools are not discarded; they become context after discovery and remain one-action destinations.
- [x] Viewport is visually persistent; no consecutive homepage marketing sections.
- [x] User can click a coffee to inspect exact identity, review counts and canonical live destination.
- [x] Simulated rating supports stars, optional method/notes, but has **no network write**.
- [x] Desktop 1440×900, mobile 390×844 and compact mobile 320×740: all six story positions visible; test script checks no browser errors or horizontal overflow and exercises search → coffee → rating preview.
- [x] Reduced-motion rules and direct chapter navigation exist; complete assistive-technology validation is still open.
- [ ] Owner review: immersion, pacing, fidelity of information density and aesthetic quality.
- [ ] Validate genuine production deep-link experience (especially /coffees/v60) independently of the home.
- [ ] Establish which effects actually require 3D, after prototype comparison and performance instrumentation.
- [ ] Full keyboard/screen-reader checks and focus trap for overlays.
- [ ] Product truth: review deletion/identity/abuse integrity, methodology, privacy and SEO gates before any publication.

## Not production-ready

The prototype is an isolated static HTML illustration with original CSS product silhouettes, stylized topography, illustrative scroll-camera movement and frozen 9 November catalogue/review data. Some site links open the actual published ICB site in a separate tab. There is no live API, login, user profile, database write or new live route. This is an **experience artifact**, not a working site feature. The bag silhouettes are not real packaging; numbers and roaster names are identified as dated catalogue facts.

## Next design gate

**Ask GT to experience all six beats, especially the transition from the first to third fold.** The next iteration should deepen the spatial choreography *if the story works*: camera continuity, map/estate geography, review evidence materiality, and how a coffee detail becomes an actual page experience. Only then finalize page-template and component contracts.

This preserves ICB's mission: discovery → voluntary authentic reviews → trustworthy independent authority → appropriately consented and permitted intelligence, not immersive spectacle for its own sake.
