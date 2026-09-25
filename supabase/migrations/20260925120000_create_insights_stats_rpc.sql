-- Migration: get_insights_stats RPC
-- Description: One jsonb payload with every aggregate the /learn/insights page
--   charts (process mix, state/region concentration, price by process, variety
--   distribution, roaster cities). Replaces hand-maintained arrays in
--   InsightsCharts.tsx. Scoped like fetchPublicDirectoryTotals: public statuses
--   from coffee_directory_mv. Region rollup reuses get_region_coffee_counts().
--   Cached app-side under the "coffees"/"roasters" tags, so it refreshes when
--   the scraper's MV refresh hits /api/webhooks/indexnow.

CREATE OR REPLACE FUNCTION public.get_insights_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH pub AS (
    SELECT coffee_id, process, best_normalized_250g, region_ids
    FROM coffee_directory_mv
    WHERE status IN ('active', 'seasonal')
  ),
  classified AS (
    SELECT * FROM pub WHERE process IS NOT NULL AND process <> 'other'
  ),
  india_tagged AS (
    SELECT DISTINCT mv.coffee_id, cr.state
    FROM pub mv
    JOIN regions r ON r.id = ANY(mv.region_ids)
    JOIN canon_regions cr ON cr.id = r.canon_region_id
    WHERE cr.country = 'India'
  ),
  region_counts AS (
    SELECT cr.display_name, cr.state, g.own_count, g.rolled_count
    FROM get_region_coffee_counts() g
    JOIN canon_regions cr ON cr.id = g.canon_region_id
    WHERE cr.tier IS DISTINCT FROM 'aggregate'
      AND cr.tier IS DISTINCT FROM 'non-terroir'
  ),
  roaster_city AS (
    -- Spellings normalized by 20260925110000_normalize_roaster_hq_city.sql.
    SELECT hq_city AS city, hq_state AS state, lat, lon
    FROM roasters
    WHERE is_active AND hq_city IS NOT NULL
  )
  SELECT jsonb_build_object(
    'process', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.skus DESC)
      FROM (
        SELECT process::text AS key, count(*)::int AS skus
        FROM classified GROUP BY process
      ) x
    ), '[]'::jsonb),
    'price', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.median DESC)
      FROM (
        SELECT
          process::text AS key,
          round(percentile_cont(0.5) WITHIN GROUP (ORDER BY best_normalized_250g))::int AS median,
          count(*)::int AS skus
        FROM classified
        WHERE best_normalized_250g IS NOT NULL
        GROUP BY process
      ) x
    ), '[]'::jsonb),
    'region_tagged_total', (SELECT count(DISTINCT coffee_id)::int FROM india_tagged),
    'states', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.skus DESC)
      FROM (
        SELECT state AS name, count(DISTINCT coffee_id)::int AS skus
        FROM india_tagged WHERE state IS NOT NULL GROUP BY state
      ) x
    ), '[]'::jsonb),
    'regions', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.skus DESC)
      FROM (
        SELECT display_name AS name, state, rolled_count AS skus
        FROM region_counts
        ORDER BY rolled_count DESC
        LIMIT 10
      ) x
    ), '[]'::jsonb),
    'origin_regions', (SELECT count(*)::int FROM region_counts WHERE own_count > 0),
    'varieties', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.skus DESC)
      FROM (
        SELECT v AS name, count(DISTINCT c.id)::int AS skus
        FROM pub mv
        JOIN coffees c ON c.id = mv.coffee_id
        CROSS JOIN LATERAL unnest(c.varieties) AS v
        -- Species names leak into the varieties array; they aren't cultivars.
        WHERE lower(v) NOT IN ('arabica', 'robusta', 'excelsa', 'liberica')
        GROUP BY v
        ORDER BY skus DESC
        LIMIT 12
      ) x
    ), '[]'::jsonb),
    'roaster_cities', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.count DESC, x.city)
      FROM (
        -- Median, not avg: one roaster with stray coordinates can't drag a pin.
        SELECT
          city,
          min(state) AS state,
          count(*)::int AS count,
          percentile_cont(0.5) WITHIN GROUP (ORDER BY lat) AS lat,
          percentile_cont(0.5) WITHIN GROUP (ORDER BY lon) AS lng
        FROM roaster_city
        GROUP BY city
      ) x
    ), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_insights_stats()
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_insights_stats() IS
  'Aggregates for /learn/insights charts (process, price, states, regions, varieties, roaster cities). Public coffee statuses only.';
