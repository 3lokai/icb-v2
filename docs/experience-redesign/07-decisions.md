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
| REJECTED | Build a literal sexy barista avatar, café interior or forced cinematic tour. | Contradicts metaphor and practical UX. |
| REJECTED | Ask AI to make another set of three static brand moodboards as the first deliverable. | Failed prior approach. |

## Change-management rule
Do not modify `PRODUCT.md`, `DESIGN.md`, global tokens, main app routes or database because of this document alone. When a direction is selected, create an ADR in `docs/decisions/` noting what older rules are superseded and why. Update `README.md` phase/status and log approvals in PR/issue discussions.
