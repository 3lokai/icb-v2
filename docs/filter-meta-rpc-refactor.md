# Eliminate per-facet `coffee_summary` queries from the filter sidebar

## Context

We moved coffee-detail and roaster-detail pages to RPCs to cut Supabase Data IO
(see [detail-page-rpc-refactor.md](./detail-page-rpc-refactor.md)).
`pg_stat_statements` still shows `coffee_summary` queried individually — 5–6 single-column
queries (`status`, `process`, `roast_level`, `roaster_id`) at ~246 calls each. That signature
is the **coffee directory filter sidebar**: `fetchCoffeeFilterMeta()` fires 11 queries on every
cache miss (revalidate 300s) and aggregates counts in JavaScript.

A server-side RPC that does this in one round-trip — `get_coffee_filter_meta` — **already exists**
(`supabase/migrations/20260105000000_*` and follow-ups). The *filtered* variant
(`fetch-coffee-filter-meta-filtered.ts`) already calls it and feeds the same UI. The unfiltered
path simply never adopted it. So this is a code change only — **no new migration**.

## Offenders (confirmed via `grep -rn '.from("coffee_summary")'`)

Only one file matches the reported per-facet pattern:

- **`src/lib/data/fetch-coffee-filter-meta.ts`** — `_fetchCoffeeFilterMetaImpl()` runs:
  - 5 × `coffee_summary` single-column queries (lines 310, 354, 394, 434, 514)
  - 4 × full junction-table pulls: `coffee_flavor_notes`, `coffee_regions`, `coffee_estates`,
    `coffee_brew_methods` (lines 55–306) — these have **no status filter at all**
  - 1 × roasters head-count
  - All counted in JS, then assembled into `CoffeeFilterMeta`.

The other `coffee_summary` sites are **not** offenders and are left untouched:
`fetch-public-directory-totals.ts` (single head-count), `fetch-coffee-by-slug.ts:104` (detail
fallback — excluded per instructions), `build-search-index.ts` (single bulk Fuse-index query).

No per-coffee N+1 on `coffee_summary` exists — the "batch card lists with `.in()`" task has no target.

## Fix

Replace the ~530-line `_fetchCoffeeFilterMetaImpl` with a one-line delegation to the existing RPC,
keeping the same `unstable_cache` wrapper, key, revalidate, and tags. Pass
`status: PUBLIC_COFFEE_STATUSES` so the RPC scopes to public coffees (the MV — and thus the RPC's
default `p_statuses IS NULL` — includes all statuses; see verification note below).

`src/lib/data/fetch-coffee-filter-meta.ts` becomes:

```ts
import { unstable_cache } from "next/cache";
import { fetchCoffeeFilterMetaWithFilters } from "./fetch-coffee-filter-meta-filtered";
import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";

/**
 * Unfiltered coffee filter meta (initial directory sidebar render).
 * Delegates to the get_coffee_filter_meta RPC so all facet counts are aggregated
 * server-side in one round-trip instead of pulling full junction/summary tables to count in JS.
 */
export const fetchCoffeeFilterMeta = unstable_cache(
  () => fetchCoffeeFilterMetaWithFilters({ status: PUBLIC_COFFEE_STATUSES }),
  ["coffee-filter-meta"],
  { revalidate: 300, tags: ["coffees", "coffee-filter-meta"] }
);
```

That deletes all 11 queries and every now-unused import/helper in the file.

**Net effect:** 11 PostgREST queries (incl. 5 `coffee_summary` per-facet + 4 full junction pulls)
→ **1 RPC call** per cache miss. Sole caller is `src/app/(main)/coffees/page.tsx:256`, which is
unaffected (same `CoffeeFilterMeta` shape — proven by the filtered variant already feeding the same UI).

## Behavior change to confirm (counts will shift slightly — for the better)

The current JS counts the **flavor / region / estate / brew** facets across *all* coffees with **no
status filter**, so it includes drafts/archived. The RPC scopes them to public coffees. This makes
the counts *more correct* (the directory only lists public coffees) but the displayed numbers for
those four facets will drop to match. `status`/`process`/`roast_level`/`roaster`/`species`/`totals`
already matched public scope and are unchanged.

## Verification

1. `npm run type-check` and `npm run lint` (zero-warning policy).
2. Load `/coffees` (SSR, no filters) and confirm the filter sidebar renders with sensible counts;
   spot-check a few facets against the live filtered counts (apply then clear one filter — initial
   and cleared states should now agree, where before they could diverge).
3. After deploy, re-check `pg_stat_statements`: the 5 single-column `coffee_summary` queries and the
   4 junction-table full pulls should disappear; `get_coffee_filter_meta` call count rises instead.
4. Optional parity check before merge: log `fetchCoffeeFilterMetaWithFilters({status: PUBLIC_COFFEE_STATUSES})`
   output and eyeball against the old JS output for one snapshot.
