# 09 — Codex / Claude Code Session Handoff

> **STATUS UPDATE — 2026-11-09:** The “Initial task” and “First agent message” below are **historical Phase 0 instructions, already completed**. Do **not** restart the original audit, revert to A/B exploration or begin coding from this file. For the current new-chat alignment gate, read **[16 — Alignment Review](16-alignment-review-and-next-session.md)**, then **[07 — Decision Log](07-decisions.md)** and the linked audit/design history. The public homepage must remain neutral (no featured branded coffee); logged-in personalization is approved in principle; D is the preferred graph interaction prototype. No application changes until the owner approves a bounded scope.


> **BUSINESS NORTH STAR UPDATE — 2026-11-09:** Read [17 — Independent Reviews, Coffee Intelligence & Monetization](17-review-intelligence-and-monetization.md) **before** any next-phase task. ICB is not primarily a decorative discovery graph: the redesign must cultivate genuine independent coffee ratings/reviews and a trustworthy first-party intelligence base that can support paid aggregate research/API/B2B data products. Integrate an honest, quick review path into coffee focus and returning-member flows; preserve neutrality, authenticity, consent and current review rules. Independent review acquisition/coverage is a first-class KPI. The new-chat handoff is [16](16-alignment-review-and-next-session.md) **plus [17](17-review-intelligence-and-monetization.md)**; do not restart Phase 0 or begin production coding without approved scope.

## Agent role
You are collaborating on **ICB Experience Redesign**, an approved *exploration* and **not** an authorization to edit production. Read the project documents before proposing designs or code. Your job is to preserve the nuanced hospitality metaphor, direct technical discovery and SEO/information architecture together.

## Mandatory reading order
1. `docs/experience-redesign/README.md`
2. `docs/experience-redesign/01-vision.md` through `08-delivery-plan.md`
3. Existing root `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` and relevant docs ADRs
4. Relevant implementation paths after current task has been identified

If redesign intent conflicts with production style rules, **flag the conflict**. The redesign set is an exploration; production brand guidelines stay in force until an ADR is accepted.

## Initial task — READ ONLY
- Audit current routes, main user journeys and navigation, component patterns, filter system, discovery landing pages, SEO/metadata and entry points for users.
- Map existing features to the proposed objects and three intent paths.
- Flag missing object pages or unsupported relationships, and evidence gaps.
- Produce `current-state-audit.md` in the redesign folder with accurate paths and evidence.
- Produce a `requirements-traceability.md`: requirement, source intent, affected object, planned experience moment, validation, approval status.
- **Do not edit application code, global CSS, database schema, production pages or existing product/design docs.**

## Deliverable standards for every phase
- Provide a short explanation of goals, files reviewed and important architectural constraints.
- Show 2–3 real alternatives only where materially different, not decorative variants.
- Keep known vs inferred data distinct.
- Use concrete examples from ICB; never fabricate a current coffee field or stock value.
- Attach Penpot and/or PR links, keyframe exports and screenshots; update decision status and traceability.
- Stop at the current approved gate and summarize what the human must decide.

## Suggested project-level instruction routing
Create or update root `AGENTS.md` so Codex reads this project entry point; add a short pointer to these docs in existing `CLAUDE.md` so Claude receives the same source of truth. **Do not duplicate the long redesign specification into either agent config file**, as duplicated instructions drift. Confirm how the active agents actually load those files.

## First agent message to send
> We are starting the ICB Experience Redesign discovery phase. Read `docs/experience-redesign/README.md` and every linked specification, then read existing `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md`, and relevant ADRs. Reconcile and explicitly report conflicts between exploration and production rules. Audit the current product, routes, discovery filters, SEO and content entities **read-only**. Deliver an evidence-backed current-state inventory, gaps, and a requirements traceability table. Do not modify application code, CSS, routes, data, branding or Penpot yet. Stop after the audit and report any unresolved requirements.
