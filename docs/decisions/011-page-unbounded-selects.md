# ADR-011: Page Every Unbounded Supabase Select Through `fetchAllRows`

**Date:** 2026-09-18  
**Status:** Accepted  
**Participants:** Project Lead

## Context
PostgREST caps an unbounded `select` at **1000 rows** and returns no error. It silently
truncated every chart on the site, was fixed locally in `fetch-chart-data.ts`, and then
resurfaced in `fetch-roasters.ts` (summed `coffee_count` read exactly 1000 of 1989; 10 roasters
showed 0 coffees). `.in()` returns rows in arbitrary order, so *which* rows go missing shifts
between queries. Full record: [`completed/ponytail-audit-handover.md`](../completed/ponytail-audit-handover.md).

## Decision
- Any query that can exceed 1000 rows goes through the shared
  `fetchAllRows(buildQuery, label, orderColumn)` in `src/lib/data/fetch-all-rows.ts`.
  Don't write a local pager.
- It **throws** on error — a failed stats query should fail loudly, not render zeros.
- A `ponytail:` comment that names a ceiling ("92 roasters, revisit past ~200") is a
  precondition. When touching that code, check the data hasn't outgrown it — that's how
  `DEFAULT_LIMIT = 100` in `roaster-url.ts` silently dropped 14 roasters.

## Consequences
- An extra round trip per 1000 rows. Acceptable at current scale (~2000 coffees).
- Prefer an aggregating RPC (e.g. `get_region_coffee_counts`) when you only need counts.
