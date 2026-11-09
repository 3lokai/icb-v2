# ICB Experience Redesign — Project Index

**Status (2026-11-09):** Phase 0 audit complete; Phase 1 screenplays and Phase 2 exploratory Penpot concepts completed. **Preferred interaction concept: D — Living Coffee Atlas.** Now at the **alignment/reconciliation gate before any code**. No production redesign, visual identity, data-schema change, or implementation plan has received blanket approval. Read **[16 — Alignment Review](16-alignment-review-and-next-session.md) and [17 — Review Intelligence & Monetization](17-review-intelligence-and-monetization.md) together FIRST**.  
**Host repository:** `3lokai/icb-v2` (keep production on `main`).  
**Proposed repo location:** `docs/experience-redesign/` plus separate experimental prototype area.  
**Ownership:** Human product owner approves direction. ChatGPT leads UX/experience architecture; Codex and Claude Code serve as research, design-tool and implementation agents.

## Why this project exists
**Business north star (owner-confirmed 2026-11-09):** ICB must become India's independent authority on coffee ratings/reviews and coffee intelligence. Discovery attracts visitors; authentic voluntary contributions build proprietary, credible evidence; appropriate aggregate data products, APIs and research may generate revenue without changing ratings or organic recommendations. See [17](17-review-intelligence-and-monetization.md).

The goal is **not** a more expensive-looking landing page or a rebrand by default. It is a coherent, graceful, personal experience of Indian specialty coffee discovery. The governing metaphor is being expertly and thoughtfully hosted in a cultured high-end coffee establishment *inside an opera building, not a mall*. This is a description of the **quality of care, depth, mystery and serendipity**, not an instruction to draw a café or create an avatar.

Start with [01-vision.md](01-vision.md). Then read the documents in order:

| File | Purpose |
|---|---|
| 01-vision.md | Emotional and creative north star; exclusions and origins of brief |
| 02-experience-architecture.md | Core entities, intent modes, journeys, semantic relationships |
| 03-interaction-motion.md | Interaction grammar, motion/3D choreography, accessibility |
| 04-personalization.md | Taste profile, learning, privacy, recommender behaviour |
| 05-technical-guardrails.md | Live code architecture, SEO, performance, compatibility constraints |
| 06-design-brief.md | Penpot-first design work and what an agent must actually deliver |
| 07-decisions.md | Decision statuses, supersession rules, rejected concepts |
| 08-delivery-plan.md | Stages, quality gates, roles and milestones |
| 09-agent-handoff.md | Repeatable Codex/Claude instruction and session protocol |
| current-state-audit.md | Phase 0: evidence-backed inventory, gaps, conflicts, traffic baseline |
| requirements-traceability.md | Phase 0: requirement IDs → source, object, moment, validation, status |
| 10-screenplays.md | Phase 1: two experience screenplays (A: Annotated Guide; B: House Lights) |
| 11-ux-lead-penpot-review.md | Review of A/B designs and revisions |
| 12-signature-experiments-c-d.md | C/D alternatives; D spatial model selected for next experiment |
| 13-graph-navigation-and-homepage.md | Graph navigation rules and EARLIER featured-product homepage proposal (now superseded for anonymous homepage) |
| 14-concierge-homepage-and-voice.md | Optional website Concierge, sitewide voice, continuous homepage |
| 15-homepage-refresh-motion-screenplay.md | Creative reset; K0–K3 continuity, but branded starting product EXAMPLE is superseded by neutrality decision |
| **16-alignment-review-and-next-session.md** | **Current synthesis of Atlas/UX decisions and next-chat alignment gate** |
| **17-review-intelligence-and-monetization.md** | **Owner-confirmed business north star: independent coffee reviews, ratings, proprietary intelligence and ethical revenue; contribution UX and success metrics** |

## Important repository context
Before working, read the existing root `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` and `docs/README.md`. These specify the **current** product and technical system. They remain authoritative for production until a new design is approved and a superseding ADR is accepted. This redesign set specifies an exploration, not permission to overwrite the present brand.

## Non-negotiable translation rules
- Keep the user's *specific* emotional description and technical requirements, not just abstract buzzwords.
- Mark information **CONFIRMED**, **PROPOSED**, **OPEN**, or **REJECTED**; never turn a brainstorm into a decided feature.
- When revising a design, explain which requirements it satisfies and which it risks.
- Before implementing features, reconcile against live code and schema; this documentation does not claim everything described is implemented.
- Any work involving routes, data, content, SEO or production behaviour needs explicit approval.
- Maintain a short `status` / next-step handoff in issue or PR descriptions rather than relying on long chat history.

## Current next action (2026-11-09)

1. **Review [16 — Alignment Review](16-alignment-review-and-next-session.md), [17 — Review Intelligence & Monetization](17-review-intelligence-and-monetization.md)** and [07 — Decision Log](07-decisions.md) with the product owner in a fresh ChatGPT chat; verify the neutral anonymous home, personalized logged-in home, true graph/facet semantics and motion/Concierge boundaries.
2. Confirm any findings from the Phase 0 audit against current code when they materially constrain prototype scope; reconnect Penpot if visual re-inspection is required.
3. **Only after explicit owner approval**, commission a small isolated, noindex browser prototype (focus → typed connection → Back/Forward → filter escape → real coffee's independent review evidence → voluntary quick rating and optional tasting detail). Do not turn the Atlas into an experience with no contribution journey. Keep production pages and `main` untouched.
4. Move to shared primitives, visual identity/ADR, AI channel integration and controlled rollout only after interaction/performance gates.

**Historical note:** `09-agent-handoff.md`'s old “initial read-only audit” prompt is complete and should NOT be sent again. `10`–`15` contain exploratory, sometimes superseded design options; the latest neutral-homepage/refresh decisions are synthesized in `16`.
