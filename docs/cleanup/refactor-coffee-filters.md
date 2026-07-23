# Refactor: Coffee Filter Components

**Goal:** edit safety + smaller interactive client bundle. **Type:** refactor,
behavior-preserving. **Risk:** medium — this is live, heavily-used, URL-driven UI.

## Why

The coffee directory filter UI is the largest interactive client surface in the
app and the hardest to edit safely:

- `src/components/coffees/CoffeeFacetedFilterBar.tsx` — **1023 LOC**
- `src/components/coffees/CoffeeFilterSidebar.tsx` — **684 LOC** (exports a
  function actually named `CoffeeFilterContent`)
- `src/components/coffees/MobileFilterDrawer.tsx`

There is a parallel roaster set (`RoasterFacetedFilterBar`,
`roasters/MobileFilterDrawer`) that likely shares shape — check for the same
clones there.

## Before you touch anything — trace the real flow

Filter state is **URL-driven**, not local state. The chain (per CLAUDE.md):

```
URL search params
  → parsed in src/lib/filters/coffee-url.ts
  → passed to fetchCoffees in src/lib/data/fetch-coffees.ts
  → facets come from the Supabase get_coffee_filter_meta RPC
  → listing served from the coffee_directory_mv materialized view
```

So the filter components are mostly **serialize/deserialize + present** on top of
that. Read `coffee-url.ts` first — that's where the contract lives. The bug risk
in this refactor is breaking the URL round-trip (shareable/bookmarkable filters).

## Consumers (don't break these)

- `src/components/coffees/CoffeeDirectory.tsx`
- `src/components/coffees/MobileFilterDrawer.tsx`
- roaster equivalents if you touch the shared pieces

## Suspected seams (verify before cutting)

The two files likely duplicate: facet group rendering, active-chip rendering,
clear/reset logic, and count badges — differing mainly in layout (top bar vs.
sidebar vs. mobile drawer). The plausible extraction:

- One presentational `FilterGroup` / `FilterChip` / `ActiveFilters` set shared by
  all three shells.
- One hook owning read-from-URL / write-to-URL (wrapping `coffee-url.ts`) so the
  three shells only differ in layout, not logic.

**Do not** invent a generic "filter framework." Extract only the blocks that are
literally duplicated between the existing files. Confirm duplication with
`npm run fallow -- dupes` before extracting.

## Client-JS angle

These are `"use client"` (they must be — URL writes + interactivity). Extraction
alone won't cut JS much. The real JS lever, if any: check whether the whole bar
needs to be client, or whether the *static scaffolding* (labels, non-interactive
chrome) can render server-side with only the interactive controls as client
islands. Lower priority than edit-safety here.

## Verify

- `npm run type-check && npm run lint`
- Manual smoke in `npm run dev` on `/coffees`: apply/clear each facet, reload the
  page (URL must restore filters), share the URL in a new tab, test the mobile
  drawer. The round-trip is the thing that breaks.
- `npm run fallow -- dupes` before/after — clone % should drop.
