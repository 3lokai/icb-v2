# 21 — Penpot Design Workspace: Active Concept I

**Status (updated 2026-11-11):** Identity decided — see the update section below. Workspace structured and quality-corrected on 2026-11-10. Original explorations and homepage preserved. Three full-screen visual alternatives exist but **no identity, component library or production change is approved**. This document maps Penpot; [20](20-direction.md) and [07](07-decisions.md) remain the product/decision sources of truth.

**Penpot:** Existing connected file **`New File 2`**, ID `d2ec9836-375a-810a-8008-ebd27eb28057`. The file title may be changed manually in Penpot to **`ICB — Experience Design Workspace`**; the plugin does not expose file renaming. Numbered names indicate the intended navigation order even though original page ordering remains at the top.

**Version saved before edits:** `PRE WORKSPACE CLEANUP — G/H/I and Homepage v2 intact — 2026-11-10`.  
**Version saved after organization:** `ICB Design Workspace · organized I v2, identity lab, working screens, archive · 2026-11-10`.  
**Latest QA/version checkpoint:** `ICB I · QA fixes + 3 full-screen identity comparisons · 2026-11-10`.  
**Validation:** `penpot.currentFile.validate()` returned zero errors after the correction pass (84 boards across 12 pages). The homepage's **two existing Penpot walkthrough flows** remain on page `02`, using click-through dissolves; these are not functional scroll effects.

## Page directory

| Page | Role | Board count | Status |
| --- | --- | ---: | --- |
| **00 · Direction & principles** | Approved product intent and separate design/QA gates | 2 | Brief and handoff, not UI approval |
| **01 · Visual identity laboratory** | Overview, token checklist, and **A/B/C on full desktop homepage + mobile coffee detail** | 8 | Three genuinely different visual candidates; none selected |
| **02 · Homepage — I v2 (active experience)** | Original I-v2 desktop D1–D3, mobile M1–M4, motion grammar | 8 | Current experience baseline, not final implementation |
| **03 · Discovery & directory** | Editable reference redraws: mobile results, filter sheet, estate-linked directory, desktop filters | 4 | Working references, not pixel-exact clones |
| **04 · Coffee detail & connected journeys** | Mobile coffee identity and attribute doorways, desktop coffee detail | 3 | Working references |
| **05 · Ratings & contributions** | Mobile independent reviews, quick-rating and follow-through; desktop reviews and rating | 4 | Working references |
| **06 · Personalization & AI Concierge** | Returning-user I example plus a data-trust/optional assistant brief | 2 | Original history illustrative; AI not implemented |
| **07 · Components & tokens** | Action/filter/card/rating examples and variant-state inventory | 2 | Inventory only, no component library approved |
| **08 · Motion & interactions** | Native-scroll-first rules and optional interaction/Three.js test queue | 2 | Motion proposal, not functional animation |
| **09 · Voice & copy** | Editorial register, source labels, naming, navigation/copy consistency | 2 | Working copy, not final |
| **10 · Roasters, regions, estates & editorial** | Cross-site template backlog to prevent homepage-only design system | 1 | Scope reminder |
| **90 · Archive — G/H/I explorations (originals)** | Complete original G/H/I boards, including source I screens | 46 | Preserved for historical reference |

**Reference redraw integrity (corrected 2026-11-10):** The plugin could not append clones across inactive pages, so pages 03–06 contain editable reconstructed boards. The first reconstruction lost visibility of **45 mixed-style text elements**, including the coffee's rating summary and its underlined attribute sentence; it also visually lost **74 uppercase transforms**. We restored the complete original text content, underlined attribute words and uppercase labels from page 90, and checked exports of mobile and desktop coffee detail. Some individual text-run **colour nuances** were flattened to reliable, readable colours; therefore these are **not pixel-identical rich-text duplicates**. The 46 originals on page 90 remain the faithful historical source. The GitHub `samples/` exports depict original boards, not every corrected workspace board.

## Active product decisions — source of truth

**Do not duplicate the product brief here.** [20 — Find, Rate, Buy](20-direction.md) is the active UX baseline; [17 — Independent Reviews & Monetization](17-review-intelligence-and-monetization.md) defines business purpose and trust; [07 — Decision Log](07-decisions.md) tracks CONFIRMED / PROPOSED / OPEN; [05 — Technical Guardrails](05-technical-guardrails.md) governs accessibility, SEO and implementation.

This document describes only **where those decisions are designed and tested in Penpot**, plus the fidelity and maintenance rules for its working artboards.

## Update 2026-11-11 — identity decided

- Page `01` has a new board, `Identity DECIDED · 2026-11-11 · Deep Roast + Gambetta/Ranade`, above the earlier boards: type roles, Deep Roast light and dark swatches with hex values, texture candidates and open items.
- The eight earlier boards on page `01` (Identity 00, Identity 02, A/B/C desktop and mobile) were **deleted** on the owner's instruction. They remain only in Penpot's version history (`ICB I · QA fixes + 3 full-screen identity comparisons · 2026-11-10`).
- Pages `00`–`10` were recoloured to the Deep Roast light tokens (ink, muted, hairline, primary, card, ground, accent, star). The low-contrast label greys were folded into the muted token. Page `90` (the 46 originals) was not touched.
- DM Mono labels on those pages were changed to DM Sans, and the annotation texts ("Scroll stage 01/02", "Packaging / roasters own their design") were removed from page `02`.
- Planning text on pages `00` and `07` now states the decided identity. The flavour-note overlap on the mobile directory boards (page `03`) was fixed.
- Gambetta and Ranade are Fontshare fonts and are not installed in Penpot; the decision board is set in DM Sans. Full renders of the decided identity are in [samples/](samples/) (`identity-deep-roast-*.jpg`) and live in the [playground](playground/index.html).
- Pages `02`–`06` are recoloured but still set in Fraunces/DM Sans, and have no texture. The playground is the identity source.
- The section below describes the state before this decision.

## Next active work — visual identity (Phase 1)

**Now ready for review on page 01:** A · Editorial Heritage (warm paper/Fraunces), B · Contemporary Craft (mineral/sans), and C · The Collector's Index (dark/copper). Each is shown against the **full existing I-v2 desktop homepage and the real Mogra mobile coffee-detail composition**—packaging, Rate, Buy, rating summary and attribute doorway sentence included. The former simplistic card-only comparisons were retired. A, B and C are materially different in typography and atmosphere (warm editorial / mineral modern / near-black collector), not just button colours. The preview uses dated source imagery and Mogra 4.5/6 + anaerobic facts; unsupported Mogra variety details were removed. These are **design alternatives only**; none is an approved global theme, and the current production light/dark setting is unchanged. Next expand the selected candidate into the directory and rating pages after owner review.

**Compare:** typography hierarchy, ink/background/accents, brand recognition, logo usage, packaging frame, refined motifs, critical rating/star colours, component contrast, legibility, quality of editorial atmosphere, and mobile differentiation. Respect the fact that ICB users notice actual bags, labels and logos.

**Approval gate:** owner chooses one primary treatment or a documented combination. Ensure small copy/labels meet at least WCAG AA contrast, and establish tokens before building shared components. The current I-v2 homepage uses slightly different colours from source I; neither palette is authoritative yet. The existing light/dark production policy is not silently changed.

### Visual QA status

- Working coffee-detail copies on pages 04/05 now show the original rating data, underlined linked-facts sentence and uppercase labels. Several multi-colour text spans were simplified to one readable base colour; they are *not* literal clones.
- Three full-screen candidates have an internally consistent Buy/Rate treatment; this **colour-role rule is PROPOSED** and recorded in [07](07-decisions.md), not approved.
- Mogra example: **4.5 / 5 from six independent ratings; anaerobic process**; unsupported SLN 795 removed from associated sample panels. Dated prototype facts still require live revalidation at implementation.
- New identity homepage examples use an explicitly dated catalogue snapshot and internal → links; the original page 02 contains historical copy/motion placeholders awaiting the final copy and motion passes.
- Preliminary colour contrast checks on *candidate* background/muted/accent pairs meet 4.5:1, but complete component-level WCAG checks, especially over imagery and for interactive states, remain OPEN.

## Subsequent work

1. **Components (07):** establish real Penpot components/variants for search, facet chip/sheet, buttons, coffee imagery/cards, rating stars/reviews, provenance, attribute links and navigation. Test desktop/mobile parity and unreviewed/empty states.
2. **Motion (08):** a *native horizontal gallery* on both mobile and desktop, no vertical scroll hijack or trapped pinning. Then test whether select shared-element/CSS or targeted Three.js genuinely improves continuity, with reduced motion and slow mobile fallback. The original motion grammar board still contains a historical pinned-gallery idea; **native horizontal scrolling is now a PROPOSED implementation direction**, with final approval still OPEN.
3. **Copy and QA (09):** one clear label for each action, accurate displayed counts/dates/review rules, external vs internal link icon semantics, content-source attribution and consistent voice. Final copy refinement follows component/interaction tests, but accurate functional labels must be decided with components.
4. **Complete product scope (06,10):** logged-in homepage state, first-party optional AI guidance, roaster/estate/region pages, editorial integration and account flows. Do not conflate future design briefs with live features.

## Immediate product questions to carry into next phase

- **Gallery fairness:** distinguish genuinely chronological `Just Added` (no padding with older products) from a neutral `Browse the directory` visual selection intended to display varied roasters. A proposal is to diversify the initially visible set across roasters in the latter, but the exact selection method is still OPEN.
- **Interaction provenance:** buy outbound click vs confirmed purchase; personal `tried` vs seen/saved/wishlisted; community review vs roaster tasting notes vs ICB inference.
- **Design tokens:** final palette, typography, imagery treatment, motif and contrast rule. Test action roles: filled dark/Brown for external Buy, contrasting outlined Rate on coffee detail, filled on the rating form (PROPOSED, not approved).
- **Unbuilt areas:** other entity pages, actual personalization and AI integration.
- **No code/prod change authorized by this workspace refactor.** The user's next decision is visual identity, not implementation.

## Workspace housekeeping

- Keep page **02** the active homepage design baseline until a replacement is explicitly approved.
- Add candidate treatments and component iterations to their own pages; do not overwrite earlier accepted states.
- Maintain dated Penpot versions and update [07](07-decisions.md) / [20](20-direction.md) when the owner approves a material change.
- Page **90** holds original experiments; do not casually delete. Original page order was retained, so page 90 may appear first in the sidebar until manually reordered in Penpot.
- Exact file rename and page reordering require the Penpot UI; don't simulate unsupported API actions or claim they were done.

## Quick acceptance checklist for the next review

Can a new visitor understand the independent coffee directory and find **Browse** or **Rate** immediately? Can a mobile visitor use the real familiar filters? Is Rate/Buy both accessible and neutral on coffee detail? Are visual coffee packaging and rating provenance readable? Do the design-system candidates improve those journeys without making the interface more complex? Are visual/interaction changes represented in working screens rather than abstract style tiles?
