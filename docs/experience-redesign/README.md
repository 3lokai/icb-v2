# ICB Experience Redesign

**Status (2026-11-10):** Design direction fixed — **Find, rate, buy**. Next: typography, colour, iconography and motifs; then components; then motion. No production code or database change is approved.

**Branch:** `design/experience-redesign` in `3lokai/icb-v2`. Production stays on `main`.

## Read these

| File | What it is |
|---|---|
| [20-direction.md](20-direction.md) | **Start here.** The fixed direction, sample screens, next steps and open rules. |
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

## Penpot

- `New File 2` — current work (I journey and Homepage v2). Details in [20-direction.md](20-direction.md).
- `New File 1` — earlier directions A–F. Design history; leave intact.
