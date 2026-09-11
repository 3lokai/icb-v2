-- Migration: Make get_region_coffee_counts cycle-safe
-- Description: The recursive closure used UNION ALL, so a canon_regions
--   parent_id cycle (A->B->A) would recurse until statement timeout and take the
--   /regions hub down with it. The database only forbids direct self-parenting.
--   UNION dedupes the (ancestor, descendant) pairs, which bounds the recursion.
--   Body is otherwise identical to
--   20260911120000_create_region_coffee_counts_rpc.sql.

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
  -- descendant so `rolled_count` covers the region itself. UNION (not UNION ALL)
  -- is the cycle guard: the (ancestor, descendant) pair set is finite, so
  -- recursion stops even if a future edit makes parent_id cyclic (the database
  -- only rejects direct self-parenting; canon/region_structure.py --check is an
  -- external check that can't run on a hand-edited row). Dedup cost is nil on a
  -- ~100-row table.
  closure AS (
    SELECT i.id AS ancestor_id, i.id AS descendant_id
    FROM india i
    UNION
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
