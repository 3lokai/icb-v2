# ICB Experience Redesign

**Status (2026-11-11):** **Find, Rate, Buy** experience and the **visual identity are locked for design**: Gambetta + Ranade, Deep Roast light/dark, texture/terrain motif and gradient rules ([22](22-visual-system.md)). **NEXT: audit the sitemap, information architecture, navigation and page-template coverage before building individual components.** Follow [23 — Next Design Phase](23-next-design-phase.md). Production remains unchanged pending an approved ADR.

**Branch:** `design/experience-redesign` in `3lokai/icb-v2`. Production stays on `main`.

## Read these

| File | What it is |
|---|---|
| [20-direction.md](20-direction.md) | **Start here.** The approved UX direction, reference screens, next phases and open behaviour rules. |
| [21-penpot-design-workspace.md](21-penpot-design-workspace.md) | **Current Penpot page map**, pre/post cleanup versions, editable references, identity-phase workbench and next steps. |
| [22-visual-system.md](22-visual-system.md) | **Locked visual system**: type, Deep Roast, grain, terrain motif, wash/scrims and ambient surfaces; implementation tokens/assets and verification. |
| [23-next-design-phase.md](23-next-design-phase.md) | **START HERE IN THE NEW CHAT:** current-vs-proposed sitemap and navigation, page-template inventory, approval gates, then component/copy sequence. |
| [07-decisions.md](07-decisions.md) | Decision log with statuses and dates. |
| [17-review-intelligence-and-monetization.md](17-review-intelligence-and-monetization.md) | Business north star: independent reviews and coffee intelligence. |
| [05-technical-guardrails.md](05-technical-guardrails.md) | Architecture, SEO, performance and accessibility constraints. |
| [current-state-audit.md](current-state-audit.md) | Evidence-backed inventory of the live site and traffic baseline. |
| [requirements-traceability.md](requirements-traceability.md) | Requirement IDs traced to source and status. |
| [playground/index.html](playground/index.html) | Exploration workbench (the decided system is in [22](22-visual-system.md)). Single-file HTML replica of the homepage, directory, coffee page and rating, with live controls for colour, type, motifs and texture. Open it in a browser; no build. |
| [samples/](samples/) | Exports of the Penpot boards, plus playground captures of the decided identity (`identity-deep-roast-*.jpg`). |
| [archive/](archive/) | Superseded exploration (directions A–F, Atlas, Concierge, earlier screenplays and handoffs). History only; do not build from it. |

## Rules that hold throughout

- ICB stays independent and neutral. No paid manipulation of reviews or organic rankings.
- Coffee discovery stays fast and precise. Existing SEO equity and canonical URLs are protected.
- Real information stays accessible without complex animation. Mobile is critical.
- Accessibility and performance are not traded for spectacle.
- Keep the Next.js, React, Supabase and Sanity architecture.
- Root `PRODUCT.md`, `DESIGN.md` and `CLAUDE.md` stay authoritative for production until an ADR in `docs/decisions/` supersedes them.
- Mark statements CONFIRMED, PROPOSED, OPEN or REJECTED. A brainstorm is not a decision.

## Penpot — working workspace (verified 2026-11-11)

- **File:** `New File 2` (`d2ec9836-375a-810a-8008-ebd27eb28057`); can be renamed in the Penpot UI to `ICB — Experience Design Workspace`.
- **00** Direction & principles, **01** Visual identity laboratory, **02** Homepage I v2, **03** Discovery, **04** Coffee detail, **05** Ratings, **06** Personalization & AI, **07** Components, **08** Motion, **09** Voice, **10** Other templates, **90** Original G/H/I archive.
- The **original 46 G/H/I boards** and eight original I-v2 homepage boards are retained; the working copies on pages 03–06 are editable reference redraws, not pixel-identical duplicate Penpot sources.
- Two homepage walkthroughs are storyboard click transitions, **not actual scrolling, native carousels or Three.js**.
- **Latest named Penpot version:** `ICB · Visual system locked + IA next-phase handoff · 2026-11-11` (rev 101, zero validation errors, 78 boards / 12 pages). `New File 1` remains earlier A–F design history.
- **Identity decided (2026-11-11):** page `01` has a board `Identity DECIDED · 2026-11-11` with the type roles and Deep Roast light/dark tokens. The A/B/C identity boards were deleted on the owner's instruction, and pages `00`–`10` were recoloured to Deep Roast (see [21](21-penpot-design-workspace.md)). Identity detail is now worked in the HTML playground, not Penpot. Colour roles for Rate/Buy, gallery behaviour and directory terminology are still **PROPOSED** in [07](07-decisions.md).
- **Actual fidelity:** pages 03–06 have the missing mixed-style content and uppercase labels restored; Penpot retains fallback Fraunces/DM Sans typography and no final textures. **[system/index.html](system/index.html) and [playground/index.html](playground/index.html) are the visual-render references.** See [21](21-penpot-design-workspace.md).
