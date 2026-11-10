# 21 — Penpot Design Workspace: Active Concept I

**Status:** Workspace set up on 2026-11-10. Original explorations and current homepage preserved. Visual identity treatments, components, motion and copy have NOT been approved as production-ready; this is a structured space for decisions and future design work.

**Penpot:** Existing connected file **`New File 2`**, ID `d2ec9836-375a-810a-8008-ebd27eb28057`. The file title may be changed manually in Penpot to **`ICB — Experience Design Workspace`**; the plugin does not expose file renaming. Numbered names indicate the intended navigation order even though original page ordering remains at the top.

**Version saved before edits:** `PRE WORKSPACE CLEANUP — G/H/I and Homepage v2 intact — 2026-11-10`.  
**Version saved after edits:** `ICB Design Workspace · organized I v2, identity lab, working screens, archive · 2026-11-10`.  
**Validation:** `penpot.currentFile.validate()` returned zero errors in the completed workspace. The homepage's **two existing Penpot walkthrough flows** remain on page `02`, using click-through dissolves; these are not functional scroll effects.

## Page directory

| Page | Role | Board count | Status |
| --- | --- | ---: | --- |
| **00 · Direction & principles** | Approved product intent and separate design/QA gates | 2 | Brief and handoff, not UI approval |
| **01 · Visual identity laboratory** | Three **exploratory** treatments of the *same* coffee context plus token checklist | 2 | Visual concepts NOT selected |
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

**Why there are reference redraws on pages 03–06:** The Penpot plugin could not append a cloned board across inactive pages. Screens were reconstructed as editable working references from the original boards, including existing image fills. **Rich-text spans and some mixed-style details may differ** from the originals. Do not treat these copies as pixel-identical, as final copy, or as an authoritative rendered design; the **46 original I/G/H boards on page 90** remain the faithful source. Check exports and original screens when judging typography or copy. The GitHub `samples/` exports are visual references to the earlier boards, not exports of every new workspace board.

## Active product/UX baseline

- **Find, Rate, Buy**; conventional filters and search remain intuitive and fast.
- Coffee packaging imagery is central to the experience, but the homepage's public selection is **neutral**: no paid placement or branded editorial endorsement.
- All credible independent reviews and rating sample sizes remain clearly distinguished from roaster product claims and ICB estimates.
- Every factual coffee attribute can become a contextual path to related directory results when source and route support it; no visible network graph is required.
- The homepage may use **cohesive sections** without heavy visual separations; new coffees, independent ratings, new roasters and articles keep it alive.
- Logged-in personalization is useful, but view/buy-click are NOT proof of purchase or tasting.
- Optional website AI Concierge is a **later capability**, not a required homepage widget.
- Existing SEO, mobile performance, consent, production design rules and independent rating integrity remain non-negotiable.
- Data monetization pathways (aggregated intelligence, licensed API/data, research) are **future product hypotheses** and cannot influence ratings or organic rank.
- The anonymous rating cap is **three distinct entities** before login under current production behaviour.

**Sources of truth:** [20 — Current direction](20-direction.md), [07 — Decision Log](07-decisions.md), [17 — Reviews and Monetization](17-review-intelligence-and-monetization.md), [05 — Technical Guardrails](05-technical-guardrails.md) and root product/technical documentation. Past visual experiments are in the Penpot archive and [archive/](archive/).

## Next active work — visual identity (Phase 1)

Use **the same exact interaction, content, screen sizes and Rate/Buy/filters** for three distinct visual treatments. Begin with page `01`; it provides *comparison scaffolding*, not completed identity designs. Apply three candidate treatments to **at least two actual screens** from the current direction (ideally Homepage D1 and Mobile Coffee Detail), then test with directory and rating contexts.

**Compare:** typography hierarchy, ink/background/accents, brand recognition, logo usage, packaging frame, refined motifs, critical rating/star colours, component contrast, legibility, quality of editorial atmosphere, and mobile differentiation. Respect the fact that ICB users notice actual bags, labels and logos.

**Approval gate:** owner chooses one primary treatment or a documented combination. Ensure small copy/labels meet at least WCAG AA contrast, and establish tokens before building shared components. The current I-v2 homepage uses slightly different colours from source I; neither palette is authoritative yet. The existing light/dark production policy is not silently changed.

## Subsequent work

1. **Components (07):** establish real Penpot components/variants for search, facet chip/sheet, buttons, coffee imagery/cards, rating stars/reviews, provenance, attribute links and navigation. Test desktop/mobile parity and unreviewed/empty states.
2. **Motion (08):** a *native horizontal gallery* on both mobile and desktop, no vertical scroll hijack or trapped pinning. Then test whether select shared-element/CSS or targeted Three.js genuinely improves continuity, with reduced motion and slow mobile fallback. The existing motion grammar board still contains a historical pinned-gallery idea; **newer documented native-scroll rule takes precedence**.
3. **Copy and QA (09):** one clear label for each action, accurate displayed counts/dates/review rules, external vs internal link icon semantics, content-source attribution and consistent voice. Final copy refinement follows component/interaction tests, but accurate functional labels must be decided with components.
4. **Complete product scope (06,10):** logged-in homepage state, first-party optional AI guidance, roaster/estate/region pages, editorial integration and account flows. Do not conflate future design briefs with live features.

## Immediate product questions to carry into next phase

- **Gallery fairness:** distinguish genuinely chronological `Just Added` (no padding with older products) from a `Catalogue` editorial selection intended to display varied roasters. A proposal is to diversify the initially visible set across roasters in the latter, but the exact selection method is still OPEN.
- **Interaction provenance:** buy outbound click vs confirmed purchase; personal `tried` vs seen/saved/wishlisted; community review vs roaster tasting notes vs ICB inference.
- **Design tokens:** final palette, typography, imagery treatment, motif and contrast rule.
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
