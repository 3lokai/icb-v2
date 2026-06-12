-- Aggregation RPCs for blog data charts: single-origin vs blend, and single-origin by region.
-- Additive only — no change to coffee_directory_mv (Postgres can't add columns to a matview
-- without a full recreate). Both functions read from coffee_directory_mv (same coffee population
-- as every other blog chart) and join coffees only for the is_single_origin flag, which lives on
-- the base table. Scoped to status = 'active' to match the "active catalogue" framing in the
-- growth-of-single-origin article (1,136 active coffees, ~47% single-origin).

CREATE OR REPLACE FUNCTION public.get_single_origin_vs_blend()
RETURNS TABLE (label text, value bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE WHEN c.is_single_origin THEN 'Single-origin' ELSE 'Blend' END AS label,
    COUNT(*)::bigint AS value
  FROM coffees c
  WHERE c.status = 'active'
  GROUP BY 1
  ORDER BY value DESC;
$$;

-- One single-origin coffee can map to several canon regions (a parent region and its
-- sub-region), so unnesting and counting per region intentionally double-counts overlaps —
-- this matches the article's "directional, sub-regions overlap their parents" methodology.
CREATE OR REPLACE FUNCTION public.get_single_origin_by_region(p_limit int DEFAULT 10)
RETURNS TABLE (label text, value bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    region AS label,
    COUNT(*)::bigint AS value
  FROM coffee_directory_mv mv
  JOIN coffees c ON c.id = mv.coffee_id
  CROSS JOIN LATERAL unnest(mv.canon_region_names) AS region
  WHERE c.is_single_origin = true
    AND mv.status = 'active'
  GROUP BY region
  ORDER BY value DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_single_origin_vs_blend() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_single_origin_by_region(int) TO anon, authenticated, service_role;
