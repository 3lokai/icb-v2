# ICB Experience Redesign

**Status (2026-11-10):** Core experience direction confirmed — **Find, Rate, Buy**. Penpot now has **three full-screen visual identity alternatives** applied to the same homepage and mobile coffee-detail context; **none selected**. Next decision: identity/token direction, then components, motion and final copy/QA. No production code or database change is approved.

**Branch:** `design/experience-redesign` in `3lokai/icb-v2`. Production stays on `main`.

## Read these

| File | What it is |
|---|---|
| [20-direction.md](20-direction.md) | **Start here.** The approved UX direction, reference screens, next phases and open behaviour rules. |
| [21-penpot-design-workspace.md](21-penpot-design-workspace.md) | **Current Penpot page map**, pre/post cleanup versions, editable references, identity-phase workbench and next steps. |
| [07-decisions.md](07-decisions.md) | Decision log with statuses and dates. |
| [17-review-intelligence-and-monetization.md](17-review-intelligence-and-monetization.md) | Business north star: independent reviews and coffee intelligence. |
| [05-technical-guardrails.md](05-technical-guardrails.md) | Architecture, SEO, performance and accessibility constraints. |
| [current-state-audit.md](current-state-audit.md) | Evidence-backed inventory of the live site and traffic baseline. |
| [requirements-traceability.md](requirements-traceability.md) | Requirement IDs traced to source and status. |
| [samples/](samples/) | Exports of the current Penpot boards. |
| [archive/](archive/) | Superseded exploration (directions A–F, Atlas, Concierge, earlier screenplays and handoffs). History only; do not build from it. |

## Rules that hold throughout

- ICB stays independent and neutral. No paid manipulation of reviews or organic rankings.
- Coffee discovery stays fast and precise. Existing SEO equity and canonical URLs are protected.
- Real information stays accessible without complex animation. Mobile is critical.
- Accessibility and performance are not traded for spectacle.
- Keep the Next.js, React, Supabase and Sanity architecture.
- Root `PRODUCT.md`, `DESIGN.md` and `CLAUDE.md` stay authoritative for production until an ADR in `docs/decisions/` supersedes them.
- Mark statements CONFIRMED, PROPOSED, OPEN or REJECTED. A brainstorm is not a decision.

## Penpot — working workspace (2026-11-10)

- **File:** `New File 2` (`d2ec9836-375a-810a-8008-ebd27eb28057`); can be renamed in the Penpot UI to `ICB — Experience Design Workspace`.
- **00** Direction & principles, **01** Visual identity laboratory, **02** Homepage I v2, **03** Discovery, **04** Coffee detail, **05** Ratings, **06** Personalization & AI, **07** Components, **08** Motion, **09** Voice, **10** Other templates, **90** Original G/H/I archive.
- The **original 46 G/H/I boards** and eight original I-v2 homepage boards are retained; the working copies on pages 03–06 are editable reference redraws, not pixel-identical duplicate Penpot sources.
- Two homepage walkthroughs are storyboard click transitions, **not actual scrolling, native carousels or Three.js**.
- Saved versions exist before and after workspace cleanup. `New File 1` is the earlier A–F Penpot design history.
- **Next design decision:** compare **A · Editorial Heritage**, **B · Contemporary Craft** and **C · The Collector’s Index** on full desktop homepage and mobile Mogra coffee-detail boards in page `01`; choose identity tokens before making components/variants. Colour roles for Rate/Buy, gallery behaviour and directory terminology are **PROPOSED** in [07](07-decisions.md), not final production rules.
- **Workspace QA:** pages 03–06 now have the missing coffee sentence/review information, 45 formerly invisible mixed-style texts and 74 uppercase labels restored; see [21](21-penpot-design-workspace.md).

