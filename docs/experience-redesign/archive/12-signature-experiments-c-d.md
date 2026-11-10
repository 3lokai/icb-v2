# 12 — C/D Signature Experience Experiments

**Status:** Phase 2 exploration; human review required. **Not a production implementation, not a brand decision.**  
**Created:** 2026-11-07 by UX lead directly in the existing connected Penpot design file.  
**Source:** `01-vision.md`, `07-decisions.md`, `10-screenplays.md`, `11-ux-lead-penpot-review.md`, current-state audit and the user's explicit feedback that A and B had converged.

## Why these experiments exist

The A/B designs converged because the same journey was rendered as two visual skins. C and D are **different interaction models**. The experiment begins **at the signature coffee-to-estate connection**, not a homepage or a full navigation redesign.

The original Penpot pages (A/B) and the subsequent UX Lead A/B revisions remain unchanged. Two additional pages have been created in the same Penpot file:

### C — Curated Journal: continuous reading

Penpot page: **`C · Curated Journal — continuous reading`**

**What is distinctive:** Coffee discovery is an uninterrupted editorial document. The visitor follows a tasting note into geography, another roaster, and an unexpected contrast by scrolling and reading. The web page itself is the narrative; there is no room, camera, constellation, separate cards connected by lines, or required "Guide me" quiz.

**Artboards (6):**
- `C / THE ONE CONTINUOUS STORY · 390 × 3600` — one complete mobile scrollytelling composition covering the same real Baarbara → Baarbara Estate → BrewClan → Naivo detour.
- `C / DESKTOP 01`, `02`, `03` — same persistent Baarbara product image in a sticky reading rail, with changing, full-size chapter content.
- `C / SCROLL GRAMMAR` — visual/interaction contract.
- `C / UTILITY` — technical discovery is always available without consuming the narrative.

**Interaction contract:**
1. The identity/selected coffee remains visibly in context (sticky on desktop).
2. Scrolling reveals the *next meaningful relationship* in the same semantic document; source text and navigation remain accessible without JavaScript.
3. The link to another roaster or a Robusta is an editorial choice, not a recommendation forced by a timer.
4. Search and filters have a compact `fixedWhenScrolling` affordance on mobile; the Penpot board demonstrates a shortcut to a practical filter page. Production would need to preserve reading position.
5. Motion in browser should use scroll progress as a **non-blocking accent**, never hijack native scroll. Avoid building multiple independent sections with entrance animations.

**Visual differentiation:** Instrument Serif + Geist; contemporary museum-journal composition; off-white, midnight blue-green, terracotta/red marginal emphasis; a continuous chapter sequence, not the original Field Guide's margin-note card UX. These are **exploratory tokens** only.

### D — Living Coffee Atlas: spatial object exploration

Penpot page: **`D · Living Coffee Atlas — spatial exploration`**

**What is distinctive:** Not a page sequence and not a spatial field of hundreds of clustered coffees. The selected coffee is the focal object; selecting a real relationship **changes the point of view and the object occupying the foreground**. Its predecessor remains in the navigable trail. Depth is tied to focus/semantic relationships, not decorative particles.

**Artboards (11):**
- `ACT 01` — Baarbara coffee is in focus with labelled estate, variety and region relations.
- `ACT 01.5` — *intermediate* camera-focus keyframe; the same product image recedes while a sourced region illustration grows as the estate becomes the target.
- `ACT 02` — estate becomes the main scene, with a distinct BrewClan relation.
- `ACT 03` — BrewClan's same-estate coffee occupies the foreground; its inferred sensory measurement is labelled.
- `ACT 04` — a real Naivo Robusta from a different estate with mango/Baba Budangiri shared attributes is an optional, explicitly justified tangent.
- `MOBILE 01`, `02`, `02.5`, `03` — mobile object → estate → other roaster → surprise progression.
- `MOBILE 04` — lights-up expert mode with direct filters.
- `UTILITY DESKTOP` — untheatrical, dense technical faceting and a 14-result audit example.

**Interaction contract:**
1. Explicit clicks/selection, rather than scrolling, drive the focus/camera transformation; there is no compulsory intro.
2. A transitional frame is provided between coffee and estate (nominally ~660ms); actual motion, continuity and timing require a browser prototype.
3. On desktop, labelled relationship destinations advance the viewpoint. Penpot click-through links connect ACT 01 → 01.5 → 02 → 03 → 04; back and immediate expert exit are included. The Penpot transition uses **dissolve as placeholder**, not a working camera.
4. On mobile, the same progression is preserved with a large single focus, compact relation labels, and a short fixed search/filter dock.
5. Native DOM remains accessible and indexable. A low-power/reduced-motion version uses semantic HTML without essential data in WebGL. Heavy visuals must load after LCP and stop rendering when inactive.
6. On direct expert intent, switch immediately to a calm, high-contrast, compact catalogue. No visual scene blocks filter edits.

**Visual differentiation:** true subject/focus scale change, skewed depth planes, spatial floor cues, navigation trails, staged focus shifts, cool editorial lighting with warm relationship lines. The selected coffee gives way to the estate image (labelled **region illustration, not actual estate photography**). D's interactions must be *truly spatial* in the browser, not just dark-mode cards.

## Shared source data (2026-11-07 snapshot, not live counts)

From Claude's Phase 0 research and 10 screenplay: V60: 646 in-stock coffees. Baarbara Coffee's Naturals Roasted Coffee Beans: natural, light, SLN 795, mango and dry coconut, from ₹600, Baba Budangiri, grown at Baarbara Estate. Baarbara Estate: 119 public coffees. BrewClan's Baarbara Naturals: berry and citrus, acidity 4/5 **ICB-inferred**. Naivo's Ratnagiri Estate Robusta Mosto Naturals: shared mango note and Baba Budangiri region but **different estate and species**, from ₹670. The example expert filter set returns 14. All facts must be rechecked against live data before implementation; any proposed editorial relation needs a grounded link.

**Known open data/implementation points:** `/estates/<slug>` ship timing; flavour family preference URL support; true origin/variety metadata relationships; history semantics; saved last filters; mobile LCP and WebGL cost; accessible keyboard/non-motion navigation.

## Evaluation: do they still converge?

Do not pick by colours. Test these exact questions:

| Requirement | C | D |
| --- | --- | --- |
| How does a visitor discover the estate? | Continuous story revealed as they read | Directly selects the "grown at" relation; the viewpoint follows |
| What preserves context? | Sticky product/reading position in one document | Spatial trail and previous focal object |
| What causes motion? | Native scroll; typography/composition respond quietly | Explicit focus selection; camera/object planes transform |
| What creates serendipity? | An adjacent paragraph with a factual contrast | A reachable, off-axis related object |
| What happens for an expert? | Leave story for technical catalogue immediately | Bring lights up to 2D technical catalogue immediately |
| Most serious risk | Beautiful but still passive; readers may ignore/tire of narrative | Novelty without comprehension, motion/performance risk on mobile |

## Review gate / next action

**Compare the two actual Penpot pages before implementation.** Neither is approved. The visual keyframes and Penpot dissolves are **not a real animation prototype**; the important difference must survive a small **browser interaction study** using real state changes:

- C prototype: one continuous scroll experience with sticky original coffee and contextual reading transition, while preserving native scroll and meaningful links.
- D prototype: single coffee → estate focus transition with background/foreground persistence; real clicks; explicit reduced-motion fallback and direct expert escape.
- Use the existing Next.js/React/Tailwind/Motion stack first. Test R3F/Three.js only for D if a CSS/Motion spatial prototype cannot achieve convincing depth.
- Success criteria: apparent hospitality, coherent transition, comprehension of "grown at", <20s expert access, and mobile performance/reduced-motion validity.
- No production routes, metadata, schema, tokens, indexing or buying links change until explicit approval.

**Note for Codex / Claude Code:** Open the **two Penpot pages named C and D**, not the earlier A/B pages. They are intentionally incomparable as full homepages but comparable on the same signature knowledge journey. Do not re-merge their interaction models into a single dark/light catalogue.
