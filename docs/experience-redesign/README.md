# ICB Experience Redesign — Project Index

**Status:** Phase 1, experience screenplays (Phase 0 gate passed 2026-11-07, see [07](07-decisions.md)). No visual direction or implementation approved.  
**Host repository:** `3lokai/icb-v2` (keep production on `main`).  
**Proposed repo location:** `docs/experience-redesign/` plus separate experimental prototype area.  
**Ownership:** Human product owner approves direction. ChatGPT leads UX/experience architecture; Codex and Claude Code serve as research, design-tool and implementation agents.

## Why this project exists
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
| 10-screenplays.md | Phase 1: two experience screenplays (A: Annotated Guide; B: Sightline), rev 2 |
| 11-penpot-handoff.md | Phase 2: self-contained Penpot keyframe brief for Codex |

## Important repository context
Before working, read the existing root `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` and `docs/README.md`. These specify the **current** product and technical system. They remain authoritative for production until a new design is approved and a superseding ADR is accepted. This redesign set specifies an exploration, not permission to overwrite the present brand.

## Non-negotiable translation rules
- Keep the user's *specific* emotional description and technical requirements, not just abstract buzzwords.
- Mark information **CONFIRMED**, **PROPOSED**, **OPEN**, or **REJECTED**; never turn a brainstorm into a decided feature.
- When revising a design, explain which requirements it satisfies and which it risks.
- Before implementing features, reconcile against live code and schema; this documentation does not claim everything described is implemented.
- Any work involving routes, data, content, SEO or production behaviour needs explicit approval.
- Maintain a short `status` / next-step handoff in issue or PR descriptions rather than relying on long chat history.

## Current next action
1. ~~Commit these docs to a non-production redesign branch with review.~~ Done (`design/experience-redesign`).
2. ~~Read-only inventory of actual routes/features, content objects, code/design constraints and SEO baseline.~~ Done: [current-state-audit.md](current-state-audit.md), [requirements-traceability.md](requirements-traceability.md).
3. ~~Two experience screenplays~~ Done: [10-screenplays.md](10-screenplays.md) rev 2 (A: Annotated Guide; B: Sightline).
4. **Phase 2 keyframes built in Penpot**, awaiting design review: [11-penpot-handoff.md](11-penpot-handoff.md) (Phase 2 handoff section) and `keyframes/`.
5. Phase 3: a *small browser interaction prototype* on an isolated route/app for the candidate chosen at the Phase 2 gate.
6. Validate before any full-site redesign.
