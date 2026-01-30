-- Migration: Fix get_similar_coffees RPC function
-- Created: 2026-01-28
-- Description: Rebuild get_similar_coffees using SQL CTEs for deterministic,
--              multi-signal picks with canonical flavor/origin overlap.

-- ============================================================================
-- DROP AND RECREATE FUNCTION: get_similar_coffees
-- ============================================================================

-- Drop existing function (exact signature) for clean re-runs
DROP FUNCTION IF EXISTS public.get_similar_coffees(
  uuid,
  uuid[],
  roast_level_enum,
  process_enum,
  uuid[],
  uuid[],
  uuid,
  int,
  text
);

CREATE OR REPLACE FUNCTION public.get_similar_coffees(
  p_coffee_id uuid,
  p_canon_flavor_node_ids uuid[] DEFAULT NULL,
  p_roast_level roast_level_enum DEFAULT NULL,
  p_process process_enum DEFAULT NULL,
  p_region_ids uuid[] DEFAULT NULL,
  p_estate_ids uuid[] DEFAULT NULL,
  p_roaster_id uuid DEFAULT NULL,
  p_limit int DEFAULT 4,
  p_seed text DEFAULT NULL
) RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH current AS (
  SELECT
    p_coffee_id AS coffee_id,
    p_canon_flavor_node_ids AS flavors,
    p_roast_level AS roast_level,
    p_process AS process,
    p_region_ids AS region_ids,
    p_estate_ids AS estate_ids,
    p_roaster_id AS roaster_id,
    COALESCE(p_seed, p_coffee_id::text) AS seed
),
base AS (
  SELECT
    mv.coffee_id,
    mv.slug,
    mv.name,
    mv.roaster_id,
    mv.roaster_name,
    mv.roast_level,
    mv.process,
    mv.region_ids,
    mv.estate_ids,
    mv.image_url,
    mv.rating_avg,
    mv.rating_count,
    mv.canon_flavor_node_ids,
    COALESCE((
      SELECT array_agg(f)
      FROM (
        SELECT unnest(mv.canon_flavor_node_ids) AS f
        INTERSECT
        SELECT unnest(c.flavors) AS f
      ) t
    ), ARRAY[]::uuid[]) AS overlap_flavor_ids,
    COALESCE((
      SELECT count(*)
      FROM (
        SELECT unnest(mv.canon_flavor_node_ids) AS f
        INTERSECT
        SELECT unnest(c.flavors) AS f
      ) t
    ), 0) AS flavor_overlap_count,
    (c.roast_level IS NOT NULL AND mv.roast_level = c.roast_level) AS roast_match,
    (c.process IS NOT NULL AND mv.process = c.process) AS process_match,
    (
      (
        c.region_ids IS NOT NULL
        AND mv.region_ids IS NOT NULL
        AND mv.region_ids && c.region_ids
      )
      OR
      (
        c.estate_ids IS NOT NULL
        AND mv.estate_ids IS NOT NULL
        AND mv.estate_ids && c.estate_ids
      )
    ) AS origin_match,
    (c.roaster_id IS NOT NULL AND mv.roaster_id = c.roaster_id) AS same_roaster,
    md5(c.seed || mv.coffee_id::text) AS stable_key
  FROM coffee_directory_mv mv
  CROSS JOIN current c
  WHERE mv.coffee_id <> c.coffee_id
    AND mv.status IN ('active','seasonal')
    AND mv.image_url IS NOT NULL
    AND (
      (c.flavors IS NOT NULL AND mv.canon_flavor_node_ids && c.flavors)
      OR (c.roast_level IS NOT NULL AND mv.roast_level = c.roast_level)
      OR (c.process IS NOT NULL AND mv.process = c.process)
      OR (c.region_ids IS NOT NULL AND mv.region_ids && c.region_ids)
      OR (c.estate_ids IS NOT NULL AND mv.estate_ids && c.estate_ids)
    )
),
scored AS (
  SELECT
    b.*,
    (b.flavor_overlap_count * 10)
    + (CASE WHEN b.roast_match THEN 5 ELSE 0 END)
    + (CASE WHEN b.process_match THEN 5 ELSE 0 END)
    + (CASE WHEN b.origin_match THEN 3 ELSE 0 END)
    - (CASE WHEN b.same_roaster THEN 2 ELSE 0 END)
    AS composite_score
  FROM base b
),
flavor_ranked AS (
  SELECT
    s.*,
    row_number() OVER (
      ORDER BY
        (CASE WHEN s.flavor_overlap_count >= 2 THEN 0 ELSE 1 END),
        s.flavor_overlap_count DESC,
        s.process_match DESC,
        s.roast_match DESC,
        s.origin_match DESC,
        s.same_roaster ASC,
        s.stable_key
    ) AS rn
  FROM scored s
  WHERE s.flavor_overlap_count >= 1
),
flavor_picks AS (
  SELECT * FROM flavor_ranked WHERE rn <= 6
),
flavor_pick_1 AS (
  SELECT * FROM flavor_picks ORDER BY rn LIMIT 1
),
flavor_pick_2 AS (
  SELECT fp.*
  FROM flavor_picks fp
  LEFT JOIN flavor_pick_1 f1 ON true
  WHERE fp.coffee_id <> f1.coffee_id
  ORDER BY
    (CASE WHEN fp.roaster_id <> f1.roaster_id THEN 0 ELSE 1 END),
    fp.rn
  LIMIT 1
),
picked_ids_12 AS (
  SELECT coffee_id FROM flavor_pick_1
  UNION
  SELECT coffee_id FROM flavor_pick_2
),
style_pick AS (
  SELECT s.*
  FROM scored s
  WHERE s.coffee_id NOT IN (SELECT coffee_id FROM picked_ids_12)
    AND s.roast_match = true
    AND s.process_match = true
  ORDER BY
    s.origin_match DESC,
    s.flavor_overlap_count DESC,
    s.same_roaster ASC,
    s.composite_score DESC,
    s.stable_key
  LIMIT 1
),
picked_ids_123 AS (
  SELECT coffee_id FROM picked_ids_12
  UNION
  SELECT coffee_id FROM style_pick
),
origin_pick AS (
  SELECT s.*
  FROM scored s
  WHERE s.coffee_id NOT IN (SELECT coffee_id FROM picked_ids_123)
    AND s.origin_match = true
  ORDER BY
    s.flavor_overlap_count DESC,
    s.process_match DESC,
    s.roast_match DESC,
    s.same_roaster ASC,
    s.composite_score DESC,
    s.stable_key
  LIMIT 1
),
picked_ids_1234 AS (
  SELECT coffee_id FROM picked_ids_123
  UNION
  SELECT coffee_id FROM origin_pick
),
fillers AS (
  SELECT s.*
  FROM scored s
  WHERE s.coffee_id NOT IN (SELECT coffee_id FROM picked_ids_1234)
  ORDER BY
    s.composite_score DESC,
    s.stable_key
  LIMIT GREATEST(p_limit - (SELECT count(*) FROM picked_ids_1234), 0)
),
final_rows AS (
  SELECT
    s.coffee_id,
    s.slug,
    s.name,
    s.roaster_id,
    s.roaster_name,
    s.roast_level,
    s.process,
    s.region_ids,
    s.estate_ids,
    s.image_url,
    s.rating_avg,
    s.rating_count,
    s.canon_flavor_node_ids,
    s.overlap_flavor_ids,
    s.flavor_overlap_count,
    s.roast_match,
    s.process_match,
    s.origin_match,
    s.same_roaster,
    s.stable_key,
    s.composite_score,
    'flavor'::text AS match_type
  FROM flavor_pick_1 s
  UNION ALL
  SELECT
    s.coffee_id,
    s.slug,
    s.name,
    s.roaster_id,
    s.roaster_name,
    s.roast_level,
    s.process,
    s.region_ids,
    s.estate_ids,
    s.image_url,
    s.rating_avg,
    s.rating_count,
    s.canon_flavor_node_ids,
    s.overlap_flavor_ids,
    s.flavor_overlap_count,
    s.roast_match,
    s.process_match,
    s.origin_match,
    s.same_roaster,
    s.stable_key,
    s.composite_score,
    'flavor'::text AS match_type
  FROM flavor_pick_2 s
  UNION ALL
  SELECT
    s.coffee_id,
    s.slug,
    s.name,
    s.roaster_id,
    s.roaster_name,
    s.roast_level,
    s.process,
    s.region_ids,
    s.estate_ids,
    s.image_url,
    s.rating_avg,
    s.rating_count,
    s.canon_flavor_node_ids,
    s.overlap_flavor_ids,
    s.flavor_overlap_count,
    s.roast_match,
    s.process_match,
    s.origin_match,
    s.same_roaster,
    s.stable_key,
    s.composite_score,
    'style'::text AS match_type
  FROM style_pick s
  UNION ALL
  SELECT
    s.coffee_id,
    s.slug,
    s.name,
    s.roaster_id,
    s.roaster_name,
    s.roast_level,
    s.process,
    s.region_ids,
    s.estate_ids,
    s.image_url,
    s.rating_avg,
    s.rating_count,
    s.canon_flavor_node_ids,
    s.overlap_flavor_ids,
    s.flavor_overlap_count,
    s.roast_match,
    s.process_match,
    s.origin_match,
    s.same_roaster,
    s.stable_key,
    s.composite_score,
    'origin'::text AS match_type
  FROM origin_pick s
  UNION ALL
  SELECT
    s.coffee_id,
    s.slug,
    s.name,
    s.roaster_id,
    s.roaster_name,
    s.roast_level,
    s.process,
    s.region_ids,
    s.estate_ids,
    s.image_url,
    s.rating_avg,
    s.rating_count,
    s.canon_flavor_node_ids,
    s.overlap_flavor_ids,
    s.flavor_overlap_count,
    s.roast_match,
    s.process_match,
    s.origin_match,
    s.same_roaster,
    s.stable_key,
    s.composite_score,
    'fallback'::text AS match_type
  FROM fillers s
),
limited AS (
  SELECT * FROM final_rows
  LIMIT p_limit
)
SELECT COALESCE(
  jsonb_agg(
    jsonb_build_object(
      'coffee_id', coffee_id,
      'slug', slug,
      'name', name,
      'roaster_id', roaster_id,
      'roaster_name', roaster_name,
      'roast_level', roast_level,
      'process', process,
      'image_url', image_url,
      'rating_avg', rating_avg,
      'rating_count', rating_count,
      'match_type', match_type,
      'overlap_flavor_ids', to_jsonb(overlap_flavor_ids),
      'flavor_overlap_count', flavor_overlap_count,
      'roast_match', roast_match,
      'process_match', process_match,
      'origin_match', origin_match
    )
    ORDER BY
      CASE match_type
        WHEN 'flavor' THEN 1
        WHEN 'style' THEN 2
        WHEN 'origin' THEN 3
        ELSE 4
      END,
      composite_score DESC,
      stable_key
  ),
  '[]'::jsonb
)
FROM limited;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.get_similar_coffees IS
'Returns up to p_limit similar coffees from coffee_directory_mv using canonical flavor/region/estate overlap. Picks: 2 flavor, 1 roast+process, 1 origin, then fills by composite score. Deterministic via p_seed.';
