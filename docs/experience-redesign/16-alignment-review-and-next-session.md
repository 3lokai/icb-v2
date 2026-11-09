# 16 — Alignment Review and Next-Session Source of Truth

**Status:** CONSOLIDATED REVIEW — 2026-11-09. Owner sign-off on this synthesis and on any implementation scope is still required.
**Branch:** `design/experience-redesign` in `3lokai/icb-v2`.
**Review scope:** Project documents `01`–`15`, audit, traceability, decision log, README, agent handoff, plus the user's subsequent homepage-neutrality and personalization decisions.
**Authority:** This document reconciles the latest conversation with earlier exploratory drafts. It **does not** silently turn a proposal into an approved production decision. Read `07-decisions.md` for explicit decision statuses and keep historical documents for rationale.

## One-paragraph north star

ICB is a **neutral, independent Indian specialty-coffee directory and knowledge platform** becoming a responsive world of connected coffee knowledge. Its emotional model is thoughtful, cultured, high-end hospitality—not a digital café, host avatar or sales pitch. **Refresh, not upgrade** means rethinking the visitor's relationship with the product: one coherent spatial/typographic/motion experience, not redesigned old homepage sections or another card-grid catalogue. People can enter through direct technical search, guided discovery or open-ended exploration, follow **real, explainable** connections between coffee subjects, and always know where they are and how to go back. Logged-in users see useful recognition based on actual saved context. An optional intelligent Concierge can explain and suggest user-approved actions without inventing catalogue facts or taking control.

## Confirmed principles (carry forward)

1. **Experience:** refined, intimate, intelligent, graceful, warm, slightly mysterious, approachable. Inspired by attentive hospitality in a cultured opera-building café; never literal café theatre. Motion, scroll, typography, composition and spatial behaviour form **one experience**, not independent animated sections.
2. **D / Living Coffee Atlas** is the preferred **prototype interaction model**, replacing the A/B style comparison as the active research direction. Graph-like, curiosity-led exploration is the goal; not an enormous rendered network of nodes.
3. **Independent and neutral:** the public/anonymous homepage **must not feature or endorse a specific branded coffee or roaster**. No paid influence on organic rankings, factual relationships, ratings or Concierge answers. Paid placement as a distinct, clearly disclosed business product is a *future proposal*, not approved.
4. **Personalized homepage for logged-in users:** may adapt entry points and recognition from accurate saved details/preferences, equipment and recent views; anonymous homepage is neutral and complete. No pretending that a saved cross-object trail or dynamic recommendation exists before it is built.
5. **Three simultaneous intentions:** direct technical `I know what I want`; optional `Help me choose`; open-ended `Follow a thread`. These are behaviours, not necessarily fixed three tiles/buttons or distinct site sections.
6. **Technical fidelity:** retain useful precise access by roast, process, brew method, region, roaster, price, species and emerging variety/flavour facets. Expert users must not go through a mood quiz, cinematic intro or mandatory chatbot.
7. **Graph:** every displayed edge has a type and a reason (`roasted by`, `grown at`, `located in`, `has variety`, `tastes of`, `compatible with`, etc.). Separate verified facts, interpreted/inferred properties and curated/editorial tangents. Don't claim two similar-note coffees necessarily taste the same.
8. **Navigational trust:** one focal subject, limited exposed relationships, grouped high-multiplicity attributes such as multiple flavours and brew methods, chronological trail, meaningful Back/Forward, one-tap search/filter escape, sharable URLs, mobile and reduced-motion parity. Visitor can return after five hops without losing context.
9. **Website's copy:** precise, inviting and distinctive; never a wall of theatrical copy, generic lifestyle slogans or AI-written filler. Label provenance quietly and correctly. Important homepage and editorial copy is authored; factual relationship copy is templated; AI answers are optional and grounded.
10. **Preserve SEO/product:** canonical coffees, roasters, discovery landings, articles and tools remain indexable server-rendered HTML with their existing URL semantics, metadata, JSON-LD and links. Mobile speed, accessibility, existing auth/consent, roaster neutrality and the catalogue's accuracy matter more than visual spectacle.
11. **Core stack:** Keep Next.js/React/TypeScript/Tailwind/Supabase/Sanity and existing query/URL architecture for experiments. Evaluate Motion first; Three.js/R3F or other choreography tools only after a targeted browser trial. No new graph database or framework migration by default.
12. **AI Concierge concept:** part of the wider design, including the main website, without a ubiquitous chatbot bubble, invented host persona, or forced prompts. Reuse ideas/services from `3lokai/icb-chatbot`, which is a **headless, Meta-first, not-yet-deployed starter** as inspected 2026-11-09. Website transport, structured validated actions, privacy and identity handling are *not implemented*.

## Important reality checks / source-supported caveats

- The Phase 0 audit (2026-11-07) records `coffees.varieties text[]` without a canonical variety table. The user correctly clarified that **variety names are normalized/alias-mapped** already (see `src/lib/coffee/variety-info.ts`). Distinguish **normalized field values** from **first-class relational variety nodes**. Varieties are not required to be enums; typed IDs/aliases or a later canonical table can support navigation. Audit other ingestion normalization before claiming its coverage.
- The audit shows `coffee_flavor_notes` mappings and `coffee_brew_methods` relations; both can have multiple values. **Group rather than explode** their outbound connections. Default proposal: <=3 main outbound directions on desktop, <=2 on mobile; this limit is **PROPOSED**, not yet user-tested.
- Existing region profile SEO URLs are mainly `/coffees/<region-slug>`, not `/regions/<slug>`. Estate profile routes are permitted for eligible estates but not currently shipped in the audited build. Do not invent `/estates/...` or variety pages as published destinations.
- Existing filter URLs are shareable, but filter changes use `replaceState`; deliberate graph focus navigation needs proper history semantics. Do not indiscriminately switch all filter edits to `pushState`.
- Existing saved user preferences do **not yet rank catalogue results**; recently viewed coffees exist, full cross-object Atlas trails do not. Distinguish temporary session focus from persistent taste/profile data, and follow current consent and identity-merge requirements.
- Audit numbers (e.g. ~646 V60 coffees, 119 Baarbara Estate coffee associations, ~14 expert-combination matches, ~66% organic mobile) are **dated snapshots**, not forever-current facts. Requery before live prototype claims.
- As of this review, the redesign branch is **documentation-only** relative to `main`: 18 Markdown files, 11 commits ahead, no application files changed. A real browser prototype is still pending.
- Penpot design work exists (A/B, C/D, new D foyer, motion storyboards), but Penpot MCP returned **no connected instance** in the 2026-11-09 session. A visual re-review requires the user to reconnect; don't claim the live Penpot artboards were checked in this review. Static exported storyboards and GitHub descriptions are not motion prototypes.

## Document drift and reconciliation

These are intentional changes in direction, **not reasons to erase historical explorations**:

| Older document/asset | What is outdated | Current interpretation |
| --- | --- | --- |
| `13-graph-navigation-and-homepage.md` homepage examples | Branded Baarbara coffee as homepage centre/featured object | **Superseded for neutral public homepage.** Use category/relationship/abstract world entry, not roaster-product placement. Real branded coffees can emerge AFTER visitor selection, on relevant deep links, or in clearly user-specific history. |
| `15-homepage-refresh-motion-screenplay.md` K1–K3 | Uses Baarbara as focal product in the staged homepage scene | **Example of a graph transition after explicit user action only; not a mandatory/promoted anonymous homepage object.** Rewrite the eventual homepage storyboard around a neutral starting focus. |
| `01-vision.md` existing-brand starting point | Older language suggests beginning from current paper/Fraunces/brush-smear style | Historical reference. **Refresh** requires genuine creative freedom. Existing `DESIGN.md` binds production until a superseding ADR, **not** pre-approval art direction exploration. |
| `README.md` / `09-agent-handoff.md` original Phase 1 wording | Still asks agents to redo Phase 0 audit / compare original A/B concepts | Historic only. Next phase is **alignment gate → focused Atlas interaction browser experiment**, subject to approval. |
| C / Curated Journal explorations | Attractive but dynamically authoring stories for the whole catalogue is high cost | Retain C as possible deliberate editorial/story format, not the default graph navigation architecture. |
| D artboards with dark tone | Looks promising but is not approved brand or proof of actual depth | Dark is an exploratory candidate; existing light/dark site support stays until an explicit decision. |
| Older variety warnings | “No table” sometimes read as “not normalized” | Corrected: names are normalized/aliased, not (yet) a canonical entity table. |

## Next-phase scope — review before code

**No production homepage rewrite yet. No broad component library yet. No cross-channel assistant deployment.**

Recommended **review gate** in the new ChatGPT chat:
1. Re-read this document, `07-decisions.md`, Phase 0 audit, `12`–`15`, and root docs/ADRs as needed. Independently challenge unsupported assumptions, especially relationship coverage and personalization.
2. Confirm that the **anonymous homepage** begins neutrally with a cohesive abstract coffee-knowledge environment; branded items only appear after deliberate exploration, deep linking, or real personalized history. Explore the homepage's four consecutive states as one visual composition, not stacked homepage sections.
3. Define the minimal focus/edge/trail/history/URL state contract and grouped flavours/brew methods; specify exact edge resolution and what is missing in existing schema.
4. Agree on the first **isolated, non-indexed browser experiment**; keep all production routes/styles untouched.
5. Then give Codex/Claude an explicit task brief with acceptance tests and a stop condition. No implementation until the product owner approves the scope.

## Proposed small browser proof (when approved)

- **Path A / neutral:** enter from a neutral category such as Pour-over or Origin, follow to a sourced real coffee, then an estate (where the route/data gate allows), another roaster's coffee, and a flavour group/collection. Persistent typed focus and reversible trail.
- **Path B / deep-link:** arrive at a canonical coffee detail directly and activate the Atlas without first visiting Home.
- **Path C / expert:** skip the spatial world, set real hard facets and return to exploratory context without loss.
- **Personalization:** prototype with *existing* logged-in data only; explicitly label simulated state if any persistent cross-object history is absent. No invisible learning yet.
- **Concierge:** first evaluate one explicit `Ask ICB` exchange with a validated suggested action. Integrate actual OpenRouter service later, only after auth/privacy/rate-limit review.

**Success:** A visitor can accurately identify the current object, why related directions exist, how to backtrack, how to use exact filters, and what is fact vs estimate, with readable no-motion/low-powered mobile alternatives. Subjective delight matters, but not in place of task success.

## Decisions still OPEN (not automatically blockers for PR 1)

Final visual theme; exact graph-node priorities and relation caps; URL semantics for unsurfaced entities; variety entity model; estate launch timing; editorial ↔ catalogue indexing; whether filter changes create history; flavour-family facet URL parameter; AI web assistant transport/consent; persistent cross-object trail/taste-learning; which homepage headline wins; sponsor inventory/ethics. Set one owner and an acceptance test for each rather than forcing all before a prototype.

## Agent rules

- Work in existing `icb-v2`, on `design/experience-redesign` or a dedicated child worktree/branch. Do not merge to `main` from exploration without explicit approval.
- The owner makes product decisions. ChatGPT reviews UX and alignment. Codex may implement a bounded proof; Claude may audit/review independently. No parallel edits to the same files.
- Distinguish **CONFIRMED**, **PROPOSED**, **OPEN**, **REJECTED**. Older documents remain valuable evidence; latest explicit owner decisions prevail on conflicts.
- Always begin with the current audit and real database/schema/code constraints, not speculative new ontology. For data relationships, state the source and whether it's factual, inferred or editorial.
- Do not edit production routes, global CSS/tokens, DB schema, auth/consent, search indexation or Meta/assistant infrastructure during the read-only alignment review.
- End each session with a concise summary: decisions made, docs/code changed, data checks, tests, open issues and next action.

**Next owner gate:** review the alignment summary and choose whether to authorize the graph/state specification as the first coding-phase task.
