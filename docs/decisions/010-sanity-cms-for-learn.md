# ADR-010: Sanity CMS for the Learn Section

**Date:** 2026-02-21  
**Status:** Accepted — supersedes ADR-001, ADR-004, ADR-008, ADR-009  
**Participants:** Project Lead

## Context
`/learn` was first built on file-based MDX (Contentlayer, then Velite) with ImageKit for images
and no admin UI. Recorded here after the fact so the older ADRs aren't mistaken for current
behaviour.

## Decision
`/learn` content (articles, categories, authors, series, glossary) lives in **Sanity**.

- GROQ queries: `src/lib/sanity/queries.ts`; client: `src/lib/sanity/client.ts`.
- Images: `@sanity/image-url` via `src/lib/sanity/image.ts` — not ImageKit, not Velite.
- No MDX/Velite pipeline remains in the repo.

## Consequences
- Editors get a hosted studio; no redeploy to publish.
- ADR-002 (search on the main `/learn` page) and ADR-005 (URL structure) still describe
  intent, but were written for the MDX build — check the routes before relying on them.
