# 08 — Delivery Workflow and Approval Gates

## Work location
**Single existing repo:** `3lokai/icb-v2`. Do not start `icb-v3` or move the production application. Create a new branch such as `design/experience-redesign` for docs, storyboards and experiments; protect `main`. A Git worktree or separate local clone of the branch is a good way to let agents explore without colliding with active site work. A Penpot project is a design artifact, not a second source code repository.

## Phase 0 — Knowledge transfer (no application changes)
- Read existing repo/product/design/ADR docs and these files.
- Audit code, routes, objects, live navigation and Search Console baseline.
- Produce a gap list: current state vs intended UX, including requirements traceability.
- Set requirements IDs (e.g. UX-001, TECH-001) and map each to a screen/interaction test.
**Gate:** owner approves brief and non-negotiables.

## Phase 1 — Experience screenplay
- Write two alternative 60–90-second newcomer journeys with decision points, not a fixed video script.
- Include a 20-second expert path and organic-search deep-link path.
- Define a contiguous motion metaphor/grammar and all the meaningful responses.
**Gate:** choose which behaviour is worth prototyping, not which moodboard looks nicest.

## Phase 2 — Penpot exploration
- 5–7 annotated keyframes for each candidate; no full design system or all pages yet.
- Include search, direct filters, a real coffee detail, adjacent editorial discovery, mobile, reduced motion.
- Review content evidence and art direction against existing brand.
**Gate:** approve experience architecture and one prototype candidate.

## Phase 3 — Browser prototype
- Build isolated interactive route/app, optionally with R3F/GSAP/Lenis if proven useful.
- Realistic ICB content, functional search/filter controls or faithfully mocked results with source labelled.
- Test keyboard, scrolling, browser back, low-power mobile, loading and frame stability.
**Gate:** UX feel and performance pass; otherwise revise before scale-up.

## Phase 4 — Design system and templates
- Resolve visual/brand changes formally. Create components and tokens.
- Stage coffee discovery and detail first, then roasters, origins, varieties, learn, tools, personalized dashboard.
- Reuse original API/data/filter layer. Create before/after route SEO checklist.
**Gate:** template acceptance and technical regression checks.

## Phase 5 — Controlled rollout
- Keep route identity/canonical semantics. Use staging noindex; QA structured data, links, search and analytics.
- Compare SEO/performance and user outcomes before extending to rest of site.
- Prefer feature flags and incremental route releases over a full site switch.

## Agent collaboration protocol
- **ChatGPT:** UX/product decision framing and review, requirements and design critique.
- **Codex:** repo inventory, Penpot MCP interactions, motion proof and code implementation when approved.
- **Claude Code:** independent UX/architecture critique and implementation tasks with written acceptance criteria.
- One task owner per Git branch/worktree; avoid parallel edits to the same screens/files.
- At the end of every agent session, write a short handoff: files touched, decisions surfaced, tests, unresolved questions, next step.
- Agents should ask for or infer from README which phase is active. They must not silently advance phases.

## Acceptance metrics (define baselines, not invented improvements)
Completion of a search-to-coffee task, successful use of technical filters, user comprehension of connections, ability to return/back without losing context, task speed, enjoyment of exploratory path, Core Web Vitals and SEO/crawl parity. Validate with newcomers and expert coffee users rather than relying only on visual taste.
