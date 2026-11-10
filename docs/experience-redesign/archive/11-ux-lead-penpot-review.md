# 11 — UX Lead Penpot Revision and Handoff

**Status:** Exploratory Phase 2 review material. NOT APPROVED for implementation or rebrand.
**Date:** 2026-11-07
**Branch:** `design/experience-redesign`
**Penpot file:** `d3aee43a-8d21-8092-8008-e896e8d8af0c` (connected project; original boards preserved)
**Owner:** Product owner approves direction. UX lead designed new comparative keyframes.

## What changed in Penpot

Three **new pages** have been created alongside the previous eight pages. None of the original A/B boards was overwritten.

1. **`UX Lead · B — Living relationships`** — 8 mobile deep-link/discovery steps (B-R1–R8), 2 homepage/guided-entry steps (B-H1–H2), 1 desktop scene (B-D1), and 1 static/reduced-motion fallback (B-F1), plus annotations.
2. **`UX Lead · A — Living field guide`** — 6 mobile deep-link/return/expert steps (A-R1–R6), 2 homepage/guided-entry steps (A-H1–H2), and one desktop editorial fold-out (A-D1), plus annotations.
3. **`UX Lead · Motion choreography & review`** — a three-sequence, before/in-transit/settled motion score for choosing a preference, opening a coffee, and following its estate.

Selected controls are connected with Penpot **click-through dissolve interactions**. These permit review navigation; they do **not** implement the actual motion choreography or prove WebGL/3D.

## Creative rationale

The original A was readable but visually resembled a regular directory with margin-note cards. The revision turns the page itself into a guided editorial spread with persistent structural numbering, image/object continuity, purposeful contextual fold-outs and a compact navigation dock. The host is expressed by what the page *notices and reveals*, not verbose commentary.

The original B was mostly a dark-theme restyling and risked reproducing the rejected Taste Observatory through hundreds of clustered coffee shapes. The revision drops that flavour-particle-field concept. **One real coffee is now the visual anchor**, with distinct, typed navigable relationships to its estate, variety, region and a different roaster. The world changes its focus when one of those relationships is followed; light/depth describe attention rather than decoration. This is still an **exploratory spatial concept**, not a tested 3D implementation.

Both directions preserve the hospitality philosophy without depicting a literal café, stage or host avatar. Neither mandates a new production brand. The current DESIGN.md still governs production until an explicit ADR supersedes it.

## Real data and important caveats

The story reuses the 2026-11-07 audit/screenplay snapshot: V60 landing has 646 in-stock pour-over coffees; Baarbara Coffee's natural SLN 795 (“Naturals Roasted Coffee Beans”) lists mango, dry coconut and a ₹600 starting price; Baarbara Estate is associated with 119 catalogue coffees; BrewClan's same-estate Baarbara Naturals has ICB-inferred acidity 4/5; Naivo's Robusta Mosto Naturals shares a mango note and Baba Budangiri region in the source storyboard; the expert combo yields 14 coffees. These figures are dated **design reference data**, not live rendering claims.

- **No invented estate photography.** The reused artwork is a commissioned region illustration, labelled as such in shape names and annotations.
- **`/estates/baarbara-estate` is a proposed route**, not deployed. Estate ship timing remains OPEN in 07.
- **`pref=fruity` shown in some conceptual browser-address mockups is illustrative, NOT a current production parameter.** The flavour-family and sensory rank parameters remain proposed; do not copy mock URL text into implementation.
- Editorial links to varieties / coffee articles need a verified relationship or editorial mapping; do not silently assert them as existing backend relations.
- User-specific inferred recommendation data and "since last visit" claims are not assumed. Returning state uses the existing recently-viewed capability.
- Roaster-stated, ICB-inferred and editorial claims must remain clearly differentiated. The UI labels this subtly, with optional extra detail, not massive disclaimer panels.

## Specific UX changes to preserve

- **Compact mobile utility control:** roughly 70px in its resting form rather than the earlier 121px permanent bar. Search and filters are always accessible in one action; show hard filters/soft preferences in expanded states.
- **Expert autonomy:** direct filtering remains an equally important path. Expert views are dense and bright/quiet; the host and rendered scene step aside. Four hard facets are illustrated with the audit's 14-result combination.
- **Serendipity without interruption:** the side story is a visible, contextual invitation in the reading flow—not a timed pop-up or forced modal. A genuine contrast between coffees motivates the tangent.
- **No content-only canvas:** essential copy, links, controls and structured data stay in server-rendered HTML. Spatial layers enhance, never replace, semantics.
- **Return context:** original coffee/selection stays recoverable; no repetitive welcome for returning visitors.
- **Reduced motion/low power:** the B-F1 frame shows a complete static semantic equivalent, not a degraded product.

## Three transitions to test in a browser

See `UX Lead · Motion choreography & review`:
1. **Notice → Reorganise** (proposed ~420ms): a guided soft preference changes ranking/attention while the V60 hard filter and catalogue remain intact.
2. **Select → Reveal** (~600ms): the *same actual photo* persists and scales from selected coffee into a contextual field of typed relationships.
3. **Follow → Refocus** (~680ms): the original coffee recedes into navigable history; the estate comes forward and presents the actual BrewClan interpretation.

Penpot's simple dissolve connections are not these effects. Phase 3 must prove real scroll/interaction continuity, stable DOM, and acceptable mobile performance. Native scrolling, reduced-motion alternatives, and stopping rendering at rest are non-negotiable.

## Review gate — do not start a production rewrite

The human owner and UX lead should compare **A against B**, evaluate whether the B relational spatial model genuinely improves comprehension, and pick **one interaction to prototype in a browser**. The primary candidate is B-R2 → B-R3 → B-R4, with direct expert access and full reduced-motion parity. Also validate one actual mobile search-to-filter task and ensure no accidental loss of URLs/metadata/canonical schema.

Questions still OPEN: final identity, whether WebGL is worth it, family-level facet semantics (hard vs soft), browser history push policy, editorial reverse links, estates ship timing, and whether the eventual component system should absorb the visuals.

**Instructions to Codex/Claude Code:** Use these newly created Penpot pages as the visual review source, not the old concept pages. Read `01-vision.md`, `10-screenplays.md`, this handoff and the audit before planning implementation. Do not present the new mockups as shipped product. Do not modify production routes, brand tokens, schema or indexing merely because these keyframes exist.
