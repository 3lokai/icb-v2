# Detail-page RPC refactor — collapse coffee/roaster detail fetches into single Postgres RPCs

> **Status:** Planned, not yet implemented. This is a self-contained handoff doc — start a fresh chat and execute from here.

## Context / why

Coffee and roaster **detail pages** are the root cause of Supabase disk-I/O exhaustion (statement/connection timeouts across the site). Data is normalized and the Supabase JS client does one table per round-trip, so each page fans out:

- `fetchCoffeeByRoasterAndSlug` → `buildCoffeeDetailFromRow` fires **~12 queries** (roaster-by-slug, coffee-by-slug, then roasters, variants, images, sensory, flavor_notes, brew_methods, regions, estates, coffee_summary, MV).
- `fetchRoasterBySlug` fires **~4 queries**.

A caching layer already exists (React `cache()` dedup + `unstable_cache` 24h) and a `cookies()`-inside-`unstable_cache` bug was fixed by switching the fallback client to `createAnonServerClient()`. That helps repeat views but not the first (uncached) hit.

**The fix:** assemble each detail object server-side in Postgres and return it in **one round-trip** — the same denormalization technique `coffee_directory_mv` already uses, at detail grain. A `SECURITY DEFINER` function also reads the tables `anon` has no grant on (variants, sensory_params, junctions, flavor_notes, brew_methods, regions, estates) **without** exposing them publicly — cleanly resolving the "should we grant anon?" question (answer: no, the definer function handles it).

**Decisions already made:**
- Roaster's coffee array is sourced from `coffee_directory_mv` (MV staleness is dominated by the 24h page cache; same source the `/coffees` directory uses).
- Scope = the **two hot paths only**. Legacy slug-only functions (`fetchCoffeeBySlug`, `fetchCoffeesBySlugOnly`, used by `/coffees/[slug]` disambiguation + v1 API) stay on `buildCoffeeDetailFromRow`.

## Key schema facts (confirmed)

- `coffee_summary` is a **live view**; it has every summary field **except `seo_desc`** (which lives on `coffees.seo_desc`).
- `coffee_directory_mv` contains every `CoffeeSummary` field plus `canon_flavor_node_ids` (uuid[]), `canon_flavor_slugs` (text[]), `flavor_keys`, `brew_method_canonical_keys`, `works_with_milk`.
- `pct` lives on the **junction** tables (`coffee_regions.pct`, `coffee_estates.pct`), not on `regions`/`estates`.
- `(roaster_id, slug)` on `coffees` is unique (migration `20260204100000_add_coffees_roaster_slug_unique.sql`).
- `PUBLIC_COFFEE_STATUSES = ['active','seasonal']`.
- RPC convention (see `20260613120000_create_top_coffee_reviewers_rpc.sql`): `DROP FUNCTION IF EXISTS … CASCADE;` then `CREATE OR REPLACE FUNCTION … RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public`, then `GRANT EXECUTE … TO anon, authenticated, service_role;`, then `COMMENT ON FUNCTION`.
- Type shapes to match: `CoffeeDetail` (`src/types/coffee-types.ts` + nested types in `src/types/coffee-component-types.ts`), `RoasterDetail` + embedded `CoffeeSummary` (`src/types/roaster-types.ts`, `src/types/coffee-types.ts`).

## Implementation

### Step 1 — Migration `supabase/migrations/<UTC-timestamp>_create_detail_rpcs.sql`

Create with `npm run supabase:migration:new create_detail_rpcs`, then paste:

```sql
-- Migration: Create get_coffee_detail and get_roaster_detail RPCs
-- Description: Single-call jsonb assembly for coffee and roaster detail pages.
--   Replaces ~10-12 PostgREST round-trips per page with one RPC each, to cut
--   Supabase disk I/O. SECURITY DEFINER is REQUIRED: anon/authenticated have no
--   SELECT grant on variants, sensory_params, the junction tables, flavor_notes,
--   brew_methods, regions, estates. The function owner (postgres) can read them.

-- ============================================================================
-- FUNCTION: get_coffee_detail(p_roaster_slug, p_coffee_slug)
-- ============================================================================
DROP FUNCTION IF EXISTS public.get_coffee_detail(text, text) CASCADE;

CREATE OR REPLACE FUNCTION public.get_coffee_detail(
  p_roaster_slug text,
  p_coffee_slug  text
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT jsonb_build_object(
      'id',              c.id,
      'slug',            c.slug,
      'name',            c.name,
      'roaster_id',      c.roaster_id,
      'description_md',  c.description_md,
      'direct_buy_url',  c.direct_buy_url,
      'status',          c.status,
      'is_coffee',       c.is_coffee,
      'is_limited',      COALESCE(c.is_limited, false),
      'decaf',           COALESCE(c.decaf, false),
      'crop_year',       c.crop_year,
      'harvest_window',  c.harvest_window,
      'roast_level',     c.roast_level,
      'roast_level_raw', c.roast_level_raw,
      'roast_style_raw', c.roast_style_raw,
      'process',         c.process,
      'process_raw',     c.process_raw,
      'bean_species',    c.bean_species,
      'default_grind',   c.default_grind,
      'varieties',       c.varieties,
      'tags',            c.tags,
      'rating_avg',      c.rating_avg,
      'rating_count',    COALESCE(c.rating_count, 0),

      'roaster', (
        SELECT jsonb_build_object(
          'id', r.id, 'slug', r.slug, 'name', r.name, 'website', r.website,
          'hq_city', r.hq_city, 'hq_state', r.hq_state, 'hq_country', r.hq_country,
          'lat', r.lat, 'lon', r.lon, 'phone', r.phone,
          'support_email', r.support_email, 'instagram_handle', r.instagram_handle,
          'social_json', r.social_json, 'created_at', r.created_at,
          'updated_at', r.updated_at, 'default_concurrency', r.default_concurrency
        )
        FROM roasters r WHERE r.id = c.roaster_id
      ),

      'variants', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', v.id, 'coffee_id', v.coffee_id,
            'platform_variant_id', v.platform_variant_id, 'sku', v.sku,
            'barcode', v.barcode, 'weight_g', v.weight_g, 'grind', v.grind,
            'pack_count', v.pack_count, 'currency', v.currency,
            'price_current', v.price_current, 'compare_at_price', v.compare_at_price,
            'in_stock', v.in_stock, 'stock_qty', v.stock_qty,
            'subscription_available', v.subscription_available, 'status', v.status,
            'created_at', v.created_at, 'updated_at', v.updated_at,
            'last_seen_at', v.last_seen_at,
            'price_last_checked_at', v.price_last_checked_at
          ) ORDER BY v.weight_g ASC
        )
        FROM variants v WHERE v.coffee_id = c.id
      ), '[]'::jsonb),

      'images', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', ci.id, 'coffee_id', ci.coffee_id,
            'imagekit_url', ci.imagekit_url, 'alt', ci.alt,
            'width', ci.width, 'height', ci.height, 'sort_order', ci.sort_order
          ) ORDER BY ci.sort_order ASC
        )
        FROM coffee_images ci WHERE ci.coffee_id = c.id
      ), '[]'::jsonb),

      'sensory', (
        SELECT jsonb_build_object(
          'acidity', s.acidity, 'sweetness', s.sweetness,
          'bitterness', s.bitterness, 'body', s.body,
          'aftertaste', s.aftertaste, 'clarity', s.clarity,
          'confidence', s.confidence, 'source', s.source, 'notes', s.notes,
          'created_at', s.created_at, 'updated_at', s.updated_at
        )
        FROM sensory_params s WHERE s.coffee_id = c.id
      ),

      'flavor_notes', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object('id', fn.id, 'key', fn.key, 'label', fn.label, 'group_key', fn.group_key)
          ORDER BY fn.label
        )
        FROM coffee_flavor_notes cfn
        JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
        WHERE cfn.coffee_id = c.id
      ), '[]'::jsonb),

      'brew_methods', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object('id', bm.id, 'key', bm.key, 'label', bm.label)
          ORDER BY bm.label
        )
        FROM coffee_brew_methods cbm
        JOIN brew_methods bm ON bm.id = cbm.brew_method_id
        WHERE cbm.coffee_id = c.id
      ), '[]'::jsonb),

      'regions', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', rg.id, 'display_name', rg.display_name, 'country', rg.country,
            'state', rg.state, 'subregion', rg.subregion, 'pct', cr.pct
          ) ORDER BY rg.display_name NULLS LAST
        )
        FROM coffee_regions cr
        JOIN regions rg ON rg.id = cr.region_id
        WHERE cr.coffee_id = c.id
      ), '[]'::jsonb),

      'estates', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', es.id, 'name', es.name, 'region_id', es.region_id,
            'altitude_min_m', es.altitude_min_m, 'altitude_max_m', es.altitude_max_m,
            'notes', es.notes, 'pct', ce.pct
          ) ORDER BY es.name
        )
        FROM coffee_estates ce
        JOIN estates es ON es.id = ce.estate_id
        WHERE ce.coffee_id = c.id
      ), '[]'::jsonb),

      'summary', (
        SELECT jsonb_build_object(
          'coffee_id',            COALESCE(cs.coffee_id, c.id),
          'status',               COALESCE(cs.status, c.status),
          'process',              COALESCE(cs.process, c.process),
          'process_raw',          COALESCE(cs.process_raw, c.process_raw),
          'roast_level',          COALESCE(cs.roast_level, c.roast_level),
          'roast_level_raw',      COALESCE(cs.roast_level_raw, c.roast_level_raw),
          'roast_style_raw',      COALESCE(cs.roast_style_raw, c.roast_style_raw),
          'direct_buy_url',       COALESCE(cs.direct_buy_url, c.direct_buy_url),
          'has_250g_bool',        cs.has_250g_bool,
          'has_sensory',          cs.has_sensory,
          'in_stock_count',       cs.in_stock_count,
          'min_price_in_stock',   cs.min_price_in_stock,
          'best_variant_id',      cs.best_variant_id,
          'best_normalized_250g', cs.best_normalized_250g,
          'weights_available',    cs.weights_available,
          'sensory_public',       cs.sensory_public,
          'sensory_updated_at',   cs.sensory_updated_at,
          'seo_desc',             c.seo_desc
        )
        FROM (SELECT 1) one
        LEFT JOIN coffee_summary cs ON cs.coffee_id = c.id
      ),

      'canon_flavor_node_ids', (
        SELECT mv.canon_flavor_node_ids FROM coffee_directory_mv mv WHERE mv.coffee_id = c.id
      ),
      'canon_flavor_slugs', (
        SELECT mv.canon_flavor_slugs FROM coffee_directory_mv mv WHERE mv.coffee_id = c.id
      )
    )
    FROM coffees c
    JOIN roasters r0 ON r0.id = c.roaster_id
    WHERE r0.slug = p_roaster_slug AND c.slug = p_coffee_slug
    LIMIT 1
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_coffee_detail(text, text)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_coffee_detail(text, text) IS
  'Single-call jsonb assembly of CoffeeDetail. Returns NULL when not found. SECURITY DEFINER so anon can read tables it has no direct grant on.';

-- ============================================================================
-- FUNCTION: get_roaster_detail(p_slug, p_limit)
-- ============================================================================
DROP FUNCTION IF EXISTS public.get_roaster_detail(text, int) CASCADE;

CREATE OR REPLACE FUNCTION public.get_roaster_detail(
  p_slug  text,
  p_limit int default 15
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT jsonb_build_object(
      'id', r.id, 'slug', r.slug, 'name', r.name,
      'description', r.description, 'logo_url', r.logo_url, 'website', r.website,
      'is_active', r.is_active,
      'hq_city', r.hq_city, 'hq_state', r.hq_state, 'hq_country', r.hq_country,
      'lat', r.lat, 'lon', r.lon, 'phone', r.phone,
      'support_email', r.support_email, 'instagram_handle', r.instagram_handle,
      'social_json', COALESCE(r.social_json, '{}'::jsonb),
      'certifications', r.certifications, 'specialty_focus', r.specialty_focus,
      'sourcing_model', r.sourcing_model,
      'created_at', r.created_at, 'updated_at', r.updated_at,
      'default_concurrency', r.default_concurrency,
      'avg_rating', r.avg_rating,
      'avg_customer_support', r.avg_customer_support,
      'avg_delivery_experience', r.avg_delivery_experience,
      'avg_packaging', r.avg_packaging,
      'avg_value_for_money', r.avg_value_for_money,
      'total_ratings_count', r.total_ratings_count,
      'recommend_percentage', r.recommend_percentage,
      'ratings_updated_at', r.ratings_updated_at,

      'coffees', COALESCE((
        SELECT jsonb_agg(co_obj ORDER BY co_name ASC)
        FROM (
          SELECT
            mv.name AS co_name,
            jsonb_build_object(
              'coffee_id', mv.coffee_id, 'slug', mv.slug, 'name', mv.name,
              'roaster_id', mv.roaster_id, 'status', mv.status,
              'process', mv.process, 'process_raw', mv.process_raw,
              'roast_level', mv.roast_level, 'roast_level_raw', mv.roast_level_raw,
              'roast_style_raw', mv.roast_style_raw, 'direct_buy_url', mv.direct_buy_url,
              'has_250g_bool', mv.has_250g_bool, 'has_sensory', mv.has_sensory,
              'in_stock_count', mv.in_stock_count, 'min_price_in_stock', mv.min_price_in_stock,
              'best_variant_id', mv.best_variant_id, 'best_normalized_250g', mv.best_normalized_250g,
              'weights_available', mv.weights_available,
              'sensory_public', mv.sensory_public, 'sensory_updated_at', mv.sensory_updated_at,
              'decaf', COALESCE(mv.decaf, false),
              'is_limited', COALESCE(mv.is_limited, false),
              'bean_species', mv.bean_species,
              'rating_avg', mv.rating_avg,
              'rating_count', COALESCE(mv.rating_count, 0),
              'tags', mv.tags,
              'works_with_milk', mv.works_with_milk,
              'roaster_slug', mv.roaster_slug, 'roaster_name', mv.roaster_name,
              'hq_city', mv.hq_city, 'hq_state', mv.hq_state, 'hq_country', mv.hq_country,
              'website', mv.website, 'image_url', mv.image_url,
              'flavor_keys', mv.flavor_keys,
              'brew_method_canonical_keys', mv.brew_method_canonical_keys
            ) AS co_obj
          FROM coffee_directory_mv mv
          WHERE mv.roaster_id = r.id
            AND mv.status IN ('active','seasonal')
          ORDER BY mv.name ASC
          LIMIT GREATEST(COALESCE(p_limit, 15), 0)
        ) sub
      ), '[]'::jsonb),

      'coffee_count', (
        SELECT count(*)::int FROM coffees co WHERE co.roaster_id = r.id
      ),
      'active_coffee_count', (
        SELECT count(*)::int FROM coffees co
        WHERE co.roaster_id = r.id AND co.status = 'active'
      ),
      'avg_coffee_rating', (
        SELECT CASE WHEN sum(co.rating_count) > 0
          THEN sum(co.rating_avg * co.rating_count) / sum(co.rating_count)
          ELSE NULL END
        FROM coffees co
        WHERE co.roaster_id = r.id AND co.rating_count > 0 AND co.rating_avg IS NOT NULL
      )
    )
    FROM roasters r
    WHERE r.slug = p_slug
    LIMIT 1
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_roaster_detail(text, int)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_roaster_detail(text, int) IS
  'Single-call jsonb assembly of RoasterDetail. coffees[] from coffee_directory_mv (limited, public statuses, name asc). coffee_count/active_coffee_count/avg_coffee_rating computed live over ALL coffees from the coffees table. Returns NULL when not found.';
```

### Step 2 — `src/lib/data/fetch-coffee-by-slug.ts`

Rewrite **only** `fetchCoffeeByRoasterAndSlug` (signature unchanged):

```ts
export async function fetchCoffeeByRoasterAndSlug(
  roasterSlug: string,
  coffeeSlug: string
): Promise<CoffeeDetail | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_coffee_detail", {
    p_roaster_slug: roasterSlug,
    p_coffee_slug: coffeeSlug,
  });
  if (error || data == null) return null;
  return data as unknown as CoffeeDetail;
}
```

Leave `buildCoffeeDetailFromRow`, `fetchCoffeeBySlug`, `fetchCoffeesBySlugOnly`, `getSupabase`, and `fetchCoffeeByRoasterAndSlugCached` untouched (the cache wrapper transparently uses the RPC).

### Step 3 — `src/lib/data/fetch-roaster-by-slug.ts`

Rewrite `fetchRoasterBySlug` body, **preserving** `FetchRoasterBySlugOptions` (`limit` default 15, `supabaseClient`):

```ts
export async function fetchRoasterBySlug(
  slug: string,
  options?: FetchRoasterBySlugOptions
): Promise<RoasterDetail | null> {
  const { limit = 15, supabaseClient } = options ?? {};
  const supabase =
    supabaseClient ??
    (process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : createAnonServerClient());
  const { data, error } = await supabase.rpc("get_roaster_detail", {
    p_slug: slug,
    p_limit: limit,
  });
  if (error || data == null) return null;
  return data as unknown as RoasterDetail;
}
```

Remove now-unused imports to satisfy the zero-warning lint: `fetchCoffeeImages`, `PUBLIC_COFFEE_STATUSES`, the `CoffeeSummary` type import. Keep `RoasterDetail`, the client imports, `cache`, `unstable_cache`, `fetchRoasterBySlugCached`.

### Step 4 — Regenerate types

After the migration is applied to the **linked** project, run `npm run supabase:types`. Sequencing matters: `supabase.rpc("get_coffee_detail", …)` will fail type-check until the function exists in the generated `Database["public"]["Functions"]`. So: apply migration → regenerate types → type-check.

## SQL correctness checklist (don't regress these)
- **NULL-when-not-found:** the outer `SELECT ( … LIMIT 1 )` scalar-subselect wrap yields SQL `NULL` automatically on no match. Keep the wrap.
- **`sensory` → null:** correlated scalar subquery returns `NULL` when no row — do **not** build over a LEFT JOIN (fabricates an all-null object).
- **Empty arrays → `[]`:** every `jsonb_agg` wrapped in `COALESCE(…, '[]'::jsonb)`.
- **`pct`** from the junction (`cr.pct`/`ce.pct`), not from `regions`/`estates`.
- **Coercions:** `COALESCE(rating_count,0)`, `COALESCE(is_limited,false)`, `COALESCE(decaf,false)`.
- **`summary`:** LEFT JOIN coffee_summary with COALESCE fallback to `coffees` values; `seo_desc` from `coffees.seo_desc`. Live view (fresh price/stock), not the MV.
- **`active_coffee_count` = `status='active'` only** — intentionally different from the array's `IN ('active','seasonal')`. Do not unify.
- **`p_limit` guard:** `GREATEST(COALESCE(p_limit,15),0)`.
- Enums serialize to their text label in jsonb — matches the TS enum unions.

## Caller-compatibility notes
- `api/v1/roasters/[slug]` injects a service-role `supabaseClient`; `.rpc` runs on it fine (definer). No route change.
- `roasters/[slug]/coffees/page.tsx` passes `{limit:50}`/`{limit:100}` → honored via `p_limit`.
- Roaster `coffees[]` now also populates `flavor_keys`/`brew_method_canonical_keys`/`works_with_milk` (previously `undefined`) — additive, all optional in `CoffeeSummary`.
- RPC returns json `null` (not `undefined`) for absent `sensory`/canon arrays; consumers use `.length`/truthiness, so compatible.

## Verification
1. **Apply migration** to linked project / branch: `npm run supabase:db:push` (or `supabase migration up`). DDL only, low risk, *reduces* load.
2. **Validate output** via Supabase MCP `execute_sql` or CLI:
   - `select get_coffee_detail('<roaster>','<coffee>');` — diff keys vs `CoffeeDetail`: `rating_count` numeric, `is_limited`/`decaf` boolean, `sensory` null vs object, empty arrays `[]`, `summary.seo_desc` populated, `regions[].pct`/`estates[].pct` present. Bad slug pair → `null`.
   - `select get_roaster_detail('<roaster>',15);` — `coffees` ≤ limit, public statuses, name-ordered; `coffee_count ≥ active_coffee_count`; `avg_coffee_rating` null when unrated; weighted avg matches manual `sum(avg*count)/sum(count)`.
3. `npm run supabase:types` → confirm both functions typed.
4. `npm run type-check` (clean), `npm run lint` (zero warnings — catches unused imports), `npm run build`.
5. **Runtime smoke:** load `/roasters/[slug]`, `/roasters/[slug]/coffees`, `/roasters/[slug]/coffees/[coffeeSlug]`; hit `/api/roasters/[slug]` + `/api/v1/roasters/[slug]`; diff a captured JSON response before/after.
6. **I/O confirmation:** via Supabase MCP `get_logs` / pg_stat, confirm one `rpc` replaces the prior ~10-12 selects per page.

## Already done in prior session (context for the fresh chat)
- `fetchRoasterBySlugCached` / `fetchCoffeeByRoasterAndSlugCached` wrappers (React `cache()` + `unstable_cache` 24h, tags `roasters`/`coffees`) exist in the two fetch files and are wired into the detail pages.
- The `unstable_cache` fallback client was changed from `createClient()` (cookie-based, illegal in `unstable_cache`) to `createAnonServerClient()` in both fetch files. The RPC work builds on top of these — the cached wrappers will simply call the new RPC-based fetch bodies.

## Out of scope (separate follow-up)
A `get_coffee_detail_by_slug(p_coffee_slug)` array-returning RPC to also migrate `fetchCoffeeBySlug` / `fetchCoffeesBySlugOnly` (legacy `/coffees/[slug]` disambiguation, low traffic).
