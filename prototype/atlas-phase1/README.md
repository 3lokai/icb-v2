# ICB Living Coffee Atlas — browser prototypes

## Current creative direction — Phase 1C

**[Open the continuous Living Coffee Atlas prototype](./experience-v3-continuous.html)**

GT's feedback was that Phase 1B *still feels section after section*. Phase 1C replaces the multiple homepage bands with **one interactive scene**: six directly selectable orbit objects, a contextual evidence plate, a readable site index overlay and no featured roaster at anonymous arrival. Search, real directories, Learn, Tools, member destinations and review contribution remain reachable without scrolling through sections.

Read [21 — Continuous Atlas experience](../../docs/experience-redesign/21-continuous-atlas-experience.md) before implementing this concept. The older [Phase 1B prototype](./experience-v2.html) remains as a comparison, **not the recommended creative direction**.

**No production code, no database writes, no actual account login.** Data shown here is a verified but static snapshot, dated 9 Nov 2026.

---


**Status:** isolated design experiment — **not production, not a deployable feature**.

## Current experience preview — Phase 1B

**[Open Phase 1B: site hierarchy and contextual lenses](./experience-v2.html)**.

Phase 1B is the next experience experiment, alongside (not replacing) the original [Phase 1 focus prototype](./index.html).

This new browser preview adds existing ICB's **Explore / Learn / Tools / My Coffee** hierarchy, a neutral home with six contextual lenses, visible community evidence and objective recency paths, mobile section navigation, and direct links to the **real existing production routes**. It intentionally does not invent live `/explore`, `/estates`, or standalone review-activity pages.

The review and account experiences remain simulations, with no API writes or personal-account reads. The source was checked with Node syntax validation and desktop/mobile Chromium interaction tests.

See the [site IA review](../../docs/experience-redesign/19-homepage-and-information-architecture.md) and [Phase 1B design gate](../../docs/experience-redesign/20-phase1b-site-experience-review.md).

---

Open the original Phase 1 [index.html](./index.html) in a browser (or serve this directory via a local static file server). No environment variables, database credentials, build, dependencies, or account required.

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
