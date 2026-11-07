# 07 — Decision Log, Status and Supersession

Use status keywords: **CONFIRMED** (user-approved principle), **PROPOSED** (recommended, not accepted), **OPEN** (question), **REJECTED** (explicitly declined).

| Status | Decision or proposal | Evidence / rationale |
| --- | --- | --- |
| CONFIRMED | ICB redesign must communicate thoughtful high-end hospitality; the luxury café is a metaphor, not a 3D scene to recreate. | Explicit user description and approvals. |
| CONFIRMED | Cohesive UX integrating scroll, 3D, motion, typography and visual design matters more than isolated animations. | FluxTheory discussion. |
| CONFIRMED | Technical experts retain direct filter/search paths by brew method, process, roast etc.; approachable to newcomers. | Explicit user constraint. |
| CONFIRMED | Core objects include coffees, roasters, regions, estates, varieties, flavours, articles, tools and personalization. | Explicit user inventory. |
| CONFIRMED | Search discoverability and existing SEO equity must be protected. | Explicit user concern. |
| CONFIRMED | The moodboards Contour Atlas, Taste Observatory, Coffee Correspondence were not liked and are not approved directions. | User rejection. |
| PROPOSED | Keep `icb-v2` as home, use a redesign folder/branch and isolated browser experiments. | Minimizes drift and retains integration context. |
| PROPOSED | Keep Next.js/React/Tailwind/Supabase/Sanity, add selective 3D/motion. | Existing app supports desired behaviour; no proven framework blocker. |
| PROPOSED | Three intent paths (guide, expert, wander) instead of one scripted funnel. | Makes hospitality coexist with agency and speed. |
| PROPOSED | Personal taste profile uses explicit saves, adjustable inferences, explainable recommendations and optional serendipity. | Product vision; requires privacy and schema review. |
| OPEN | Exact visual language, any eventual rebrand, typography/colors, scene metaphors, navigation labels. | Must emerge from experience exploration. |
| OPEN | Whether Lenis, GSAP, R3F, or other motion tools produce materially better outcomes after prototype. | Validate before committing. |
| OPEN | Exact personalization data schema, consent, merge behaviour and release timing. | Needs technical audit and user approval. |
| OPEN | Which page templates are redesigned first, and which are intentionally low-motion. | Depends on route/traffic analysis. |
| CONFIRMED (2026-11-07) | Phase 0 gate passed. Audit and traceability accepted (`current-state-audit.md`, `requirements-traceability.md`). | Owner review after the Phase 0 audit. |
| CONFIRMED (2026-11-07) | **North star: explore both.** Phase 1 produces two substantially different creative implementations: **A** evolves the Coffee Field Guide identity; **B** is free to reconsider typography, colour, materials, spatial depth, interaction and motion. Neither must keep the brush-smear, paper layering or current typography if those undermine the experience. | Owner decision 1. |
| CONFIRMED (2026-11-07) | **DESIGN.md is the baseline record of the current identity, not an immutable creative constraint for this exploration.** It stays binding on production until a superseding ADR is accepted. | Owner clarification. |
| CONFIRMED (2026-11-07) | **Hospitality is the experiential philosophy**: intimate, cultured, intelligent, attentive, sophisticated, occasionally surprising. It is not a literal café interface. | Owner clarification. |
| CONFIRMED (2026-11-07) | **Depth/3D:** one screenplay may be fully spatial/3D. Engineering constraints must not prematurely eliminate creative options; trade-offs are documented instead. Adoption requires performance validation and explicit approval. | Owner decision 2. Audit §13a: origin LCP 2.2s, mobile lab LCP 5–8s. |
| CONFIRMED (2026-11-07) | **Guide me = progressive, optional prompts mapped to existing facets and sensory data** (flavour families, `sensory_params`). No compulsory quiz; no persona funnel. | Owner decision 3. Audit §10.0, §13a (`icb-quiz` prior art not adopted). |
| CONFIRMED (2026-11-07) | **First focus: mobile deep-link landing first, homepage second.** | Owner decision 4. Audit §13a: landing + articles ≈ 54% of top-100 organic clicks, 66% mobile. Resolves the "which templates first" OPEN item for screenplay focus only. |
| CONFIRMED (2026-11-07) | **Guardrails:** no production rebrand yet; no framework migration; no changes to public URLs, SEO structures or coffee data; serious technical discovery and direct filter access retained; mobile and reduced-motion alternatives mandatory; no static moodboards or conventional stacked sections; no frontend implementation in Phase 1. | Owner guardrails. |
| OPEN | Ship `/estates` now (15 estates pass ADR-013) or launch with the redesign? | Audit §10.0, §19.3. |
| OPEN | Editorial adjacency: reverse lookup of existing article embeds first, or typed catalogue references in `studio-icb`? | Audit §11, §19.5. |
| OPEN | Variety as a first-class object (strong search demand, 42% data coverage, no table)? | Audit §13a, §19.9. |
| OPEN | Facet changes push browser history; `AGENTS.md`/`CLAUDE.md` pointer; search/filter event instrumentation. | Audit §19.6, §19.7, §19.10. |
| REJECTED | Build a literal sexy barista avatar, café interior or forced cinematic tour. | Contradicts metaphor and practical UX. |
| REJECTED | Ask AI to make another set of three static brand moodboards as the first deliverable. | Failed prior approach. |

| CONFIRMED (2026-11-07, post C/D review) | **D — Living Coffee Atlas is the preferred signature interaction direction for the next browser prototype.** The draw is curiosity-driven node chasing: selecting one real coffee relationship may lead to estates, regions, varieties, species, roasters, flavours or surprising neighbours. It does not mean a production visual identity or a full WebGL implementation has been approved. | Explicit owner response to C/D Penpot experiments; see `12-signature-experiments-c-d.md`. |
| PROPOSED | Build D's focus graph using typed, verified source-data relationships first; separate direct facts, inferences, editorial links and taste similarity. AI may help explain but must not fabricate relationships or be required for navigation. | Makes open-ended exploration reliable, SEO-compatible and testable; relationship coverage/normalization still needs an audit. |
| PROPOSED | Retain C's continuous editorial approach for intentionally curated articles, research and special features, **not** as the universal discovery architecture requiring dynamic story generation for every coffee. | Owner flagged the authoring/logic cost of programmatic storylines. |
| OPEN | Final theme policy: owner likes D's current atmosphere, notes production has both light and dark modes, and is open to choosing only one. Test readability, contrast, low-power and expert mode before deciding; existing theme options must not be removed yet. | Owner feedback; not a final brand/theme choice. |

## Change-management rule
Do not modify `PRODUCT.md`, `DESIGN.md`, global tokens, main app routes or database because of this document alone. When a direction is selected, create an ADR in `docs/decisions/` noting what older rules are superseded and why. Update `README.md` phase/status and log approvals in PR/issue discussions.
