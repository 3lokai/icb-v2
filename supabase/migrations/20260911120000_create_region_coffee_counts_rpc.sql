-- Migration: Create get_region_coffee_counts RPC
-- Description: Per-region coffee counts for the /regions hub, in one call.
--   `own_count` counts coffees tagged directly to a canon region; `rolled_count`
--   counts the region plus every descendant via canon_regions.parent_id, deduped
--   on coffee_id (a coffee tagged to both a parent and its child counts once).
--   India only — the hub is India-only by filter (46 international rows are kept
--   so foreign coffees map somewhere, but never browse).
--   SECURITY DEFINER is REQUIRED: anon/authenticated have no direct SELECT grant
--   on regions or coffee_directory_mv. Mirrors get_region_detail
--   (20260730120000_create_estate_region_detail_rpcs.sql), whose own coffee_count
--   is per-region only and undercounts parents.

DROP FUNCTION IF EXISTS public.get_region_coffee_counts();

CREATE OR REPLACE FUNCTION public.get_region_coffee_counts()
RETURNS TABLE (
  canon_region_id uuid,
  slug            text,
  own_count       int,
  rolled_count    int
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE india AS (
    SELECT cr.id, cr.slug, cr.parent_id
    FROM canon_regions cr
    WHERE cr.country = 'India'
  ),
  canon_coffee AS (
    SELECT DISTINCT r.canon_region_id AS canon_id, mv.coffee_id
    FROM coffee_directory_mv mv
    JOIN regions r ON r.id = ANY(mv.region_ids)
    WHERE mv.status IN ('active', 'seasonal')
      AND r.canon_region_id IS NOT NULL
  ),
  -- Transitive closure of the parent_id tree, each region included as its own
  -- descendant so `rolled_count` covers the region itself. The hierarchy is
  -- verified acyclic by canon/region_structure.py --check.
  closure AS (
    SELECT i.id AS ancestor_id, i.id AS descendant_id
    FROM india i
    UNION ALL
    SELECT c.ancestor_id, i.id
    FROM closure c
    JOIN india i ON i.parent_id = c.descendant_id
  )
  SELECT
    i.id,
    i.slug,
    (
      SELECT count(DISTINCT cc.coffee_id)::int
      FROM canon_coffee cc
      WHERE cc.canon_id = i.id
    ) AS own_count,
    (
      SELECT count(DISTINCT cc.coffee_id)::int
      FROM canon_coffee cc
      JOIN closure cl ON cl.descendant_id = cc.canon_id
      WHERE cl.ancestor_id = i.id
    ) AS rolled_count
  FROM india i;
$$;

GRANT EXECUTE ON FUNCTION public.get_region_coffee_counts()
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_region_coffee_counts() IS
  'Own and rolled-up (descendants via parent_id, deduped on coffee_id) coffee counts per Indian canon region. Powers the /regions hub.';
