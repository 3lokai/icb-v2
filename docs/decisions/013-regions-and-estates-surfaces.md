# ADR-013: Regions Hub Only; Estates Pages Gated by Query

**Date:** 2026-09-11  
**Status:** Accepted  
**Participants:** Project Lead

## Context
`canon_regions` gained a tier + `parent_id` hierarchy with sourced area figures, and
`canon_estates` holds 187 estates, most without content. Working detail and the live data:
[`regions-estates-handover.md`](../regions-estates-handover.md).

## Decision
- **Regions:** a `/regions` **hub only**, no `/regions/<slug>` — `/coffees/<slug>` already
  carries the region profile. `/regions` gets a sitemap entry but is **not** a discovery page
  (not in `discovery-pages.json`).
- **Region page slugs are not canon slugs.** The bridge is `filter.region_slugs[]`, one way
  (`coorg` → `kodagu-coorg`). Don't rename page slugs.
- **Coffee counts roll up `parent_id`** via `get_region_coffee_counts()` (recursive CTE,
  `COUNT(DISTINCT)`), public statuses only. Summing the filter-meta facet double-counts.
- **Estates:** `/estates` and `/estates/<slug>`, generated from a query, not a config list:
  `country = 'India' and description is not null and coffee_count >= 3`. **Never ship all 187**
  — the gate keeps thin doorway pages out.
- Region/estate browse surfaces are **India-only**.
- **Never render an area figure without `area_source` and `area_as_of`.** Sources disagree by up
  to 65%.
- Canon migrations live in **this repo's** `supabase/migrations/`, not the ops workspace,
  because this repo owns the migration ledger.

## Consequences
- Estate pages grow with enrichment and need no code change per page.
- Still open: bespoke vs templated region copy past the first 9, and whether `/estates` needs
  an index at launch.
