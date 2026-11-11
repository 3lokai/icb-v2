# 21 — Penpot Workspace: Active Concept I

**Current status (2026-11-11):** Visual identity **CONFIRMED** and its exploration phase closed. The Penpot file preserves the approved Find/Rate/Buy experience and summarizes the identity, but is **not yet a final-fidelity component library**. **Next: information architecture, sitemap and template coverage**, per [23](23-next-design-phase.md).

**File:** `New File 2` · ID `d2ec9836-375a-810a-8008-ebd27eb28057`. Rename to `ICB — Experience Design Workspace` manually if desired; this Penpot plugin does not expose file rename or page reordering. Page `90` can still appear first in the sidebar.

**Latest named version saved:** `ICB · Visual system locked + IA next-phase handoff · 2026-11-11` (file revision 101, verified with zero Penpot validation errors).

Prior recoverable versions: `ICB I · QA fixes + 3 full-screen identity comparisons · 2026-11-10`; `ICB Design Workspace · organized I v2, identity lab, working screens, archive · 2026-11-10`; and `PRE WORKSPACE CLEANUP — G/H/I and Homepage v2 intact — 2026-11-10`.

## Current page map (78 boards / 12 pages)

| Page | Boards | Actual purpose |
|---|---:|---|
| `00 · Direction & principles` | 2 | Experience promise; **next-phase sitemap/IA → components → motion → final copy/QA gates** |
| `01 · Visual identity laboratory` | 2 | **Identity DECIDED** (Gambetta/Ranade, Deep Roast); **Visual system LOCKED** (texture/motif/gradient decisions) |
| `02 · Homepage — I v2 (active experience)` | 8 | Three desktop and four mobile homepage storyboards, plus historical motion grammar; two existing storyboard clickthrough flows |
| `03 · Discovery & directory` | 4 | Mobile browse/filters/estate entry and desktop directory, editable references |
| `04 · Coffee detail & connected journeys` | 3 | Mobile packaging/Rate/Buy, linked attribute doorways, desktop coffee detail |
| `05 · Ratings & contributions` | 4 | Mobile evidence, quick rating and follow-through; desktop independent reviews |
| `06 · Personalization & AI Concierge` | 2 | Returning user reference and a future-facing data-trust/assistant brief |
| `07 · Components & tokens` | 2 | Inventory and variant-state plan; **not** reusable production-ready components |
| `08 · Motion & interactions` | 2 | Proposed native-scroll grammar and experiments queue |
| `09 · Voice & copy` | 2 | Editorial register, source-label and accuracy briefs; not final copy |
| `10 · Roasters, regions, estates & editorial` | 1 | Cross-template coverage backlog, not finished entity designs |
| `90 · Archive — G/H/I explorations (originals)` | 46 | Intact original experiments; preserve |

## What is actually represented

- **Confirmed brand character:** "Quiet authority in the typography and information design; warmth in the colour and voice; curiosity and liveliness in the imagery, interactions and graphic details."
- **Confirmed identity:** Gambetta headings and Gambetta Italic accents; Ranade body/UI; Deep Roast light/dark; subtle paper grain, restrained framing, organic terrain contours; espresso editorial wash; bottom/conditional side scrim; selective Light + Contour ambient; separate Roasted Weave, Estate Contour and Laid Paper feature textures. See the authoritative [22 — Visual System](22-visual-system.md) and [system/](system/) assets.
- **Page 01 is a decision summary, not the exact browser render.** Gambetta/Ranade are not installed in the connected Penpot environment. Current Penpot boards use **Fraunces/DM Sans fallback**; storyboards `02–06` have been recoloured to Deep Roast but have **not** been rebuilt with final fonts, grain, scrims, gradients or motifs. Judge actual visual identity in the committed [HTML playground](playground/index.html) and [system demonstration](system/index.html).
- The old A/B/C identity boards were **deleted**, not selected. They remain recoverable in the named Nov 10 version. Do not use them for new design decisions.
- **Reference redraw limitations:** pages `03–06` were reconstructed as editable copies; the original missing 45 mixed-style text elements and 74 uppercase labels were restored. Some multicolour rich-text nuances were flattened, so they are not pixel-identical to the originals on page `90`. Coffee-detail prototypes show Mogra 4.5/5 from six independent ratings and anaerobic processing; still revalidate live data at implementation.
- Two homepage transitions on page `02` are **storyboard clickthroughs**, not functioning sideways scrolling or a 3D scene. The original pinned-gallery motion board is historical, **not** approval to hijack vertical scrolling.
- Original `90` and the eight `02` homepage source boards are intact. Historic images and labels may differ from the locked visual system, and earlier dated screenshots are not live catalogue data.

## Work here next — after IA sign-off

1. **Start outside Penpot:** audit current `src/app` routes, SEO/canonicals, navigation, breadcrumbs, search coverage and entity templates. Produce a current-vs-proposed sitemap and template matrix, then seek owner approval. See [23 Phase A](23-next-design-phase.md).
2. **Then** design content hierarchies, packaging/image treatment and iconography; build real component variants on page `07` for core directory, coffee detail, rating and navigation scenarios. Every variant must cover mobile/desktop, light/dark and meaningful missing/empty/low-evidence states.
3. Use `08` for interaction and motion tests only once functional component contracts exist; `09` for ongoing terminology and final copy QA. Use `10` to ensure roasters, regions, estates, editorial and tools do not become second-class templates.
4. Copy terminology belongs in IA/component decisions **from day one**; final tone polishing follows prototype tests. Document sourced versus inferred data and keep Buy clicks distinct from confirmed purchases.
5. Preserve existing flows and original boards, save named versions at material approvals, and update [07](07-decisions.md) on new decisions.

## Open, not part of the locked identity

Navigation/search structure, gallery behaviour/selection fairness, exact Buy/Rate hierarchy, type scale and accessibility states, sidebar/chart/destructive/focus UI tokens, icon semantics and half-stars, dark-mode product plates, mapping feature textures to specific sections, optional estates/varieties/gear page timing and future personalization. Track these through [23](23-next-design-phase.md); do not claim the visual-system phase solves them.

**Production guardrail:** no production code, canonical route, design-token migration or database change follows solely from these Penpot decisions. The production `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` and existing ADRs remain binding pending an explicit superseding ADR.
