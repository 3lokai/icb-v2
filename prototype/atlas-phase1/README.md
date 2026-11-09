# ICB Living Coffee Atlas — Phase 1 browser prototype

**Status:** isolated design experiment — **not production, not a deployable feature**.

Open [index.html](./index.html) in a browser (or serve this directory via a local static file server). No environment variables, database credentials, build, dependencies, or account required.

The interactive sample includes:

1. **Neutral public entrance:** no default roaster or coffee endorsement; guide, expert filter, and voluntary thread entry.
2. **Catalogue journey:** Baarbara Coffee Naturals → Baarbara Estate → BrewClan / Blue Tokai interpretations, preserving the explicit relationship type.
3. **Independent review evidence:** truthful empty states and dated small-sample aggregates; Grey Soul Mogra and Blue Tokai Amaltas supply rated examples.
4. **Contribution preview:** stars + optional brew method and notes; **no network request, no saving or publishing**.
5. **Returning-personalization preview:** illustrative switch explicitly labelled as such, with no account/session assumption.
6. **Search/filter sheet:** five real catalogue fixtures only, not the full directory.
7. **Keyboard and mobile:** native buttons, Esc-to-close, Ctrl/Cmd+K, Back/Forward state in HTTP previews; reduced-motion fallback.

## Data and visual accuracy

- Names, roaster slugs, coffee slugs, IDs and ratings checked against ICB Supabase on **2026-11-09**.
- All statistics are **snapshot values**, not live queries. **1,714 active coffees; 147 with >=1 current review; 16 with >=3.**
- **Baarbara Coffee Naturals**, **BrewClan Baarbara Naturals**: 0 current independent coffee ratings.
- **Blue Tokai Baarbara Estate**: 2 current ratings, mean 4.5.
- **Grey Soul Mogra**: 6 current ratings, mean 4.5.
- **Blue Tokai Amaltas Blend**: 11 current ratings, mean ~3.7.
- These are **community-submitted**, not purchase-verified or proof of distinct persons. Counts and averages may change.
- All coffee packs and the landscape are **stylized original CSS illustrations**, not actual product photos or estate documentary imagery.
- All three sample coffee-to-estate links have been **verified** in the ICB canonical mapping (`coffee_estates → estates → canon_estates`, canonical ID `3b403012-d145-4bb9-ba2c-c3256bf6d4dc`). This does not validate the wider Atlas graph, its other inference types, or readiness for production.

## Exclusions / safety

Never deploy this HTML as a live route without replacing fixture data with verified server data, source provenance, access control, review-integrity fixes and SEO review. This file has `noindex,nofollow` metadata; contains no secrets and makes no API write requests.

See [Phase 1 design contract](../../docs/experience-redesign/18-phase1-atlas-prototype-contract.md) for review decisions, test criteria and next integration gates.
