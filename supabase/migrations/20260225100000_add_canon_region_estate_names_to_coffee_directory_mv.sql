-- Migration: Add canon_region_names and canon_estate_names to coffee_directory_mv
-- Description: Pre-resolves region and estate display names in the MV so chart data
--              can use canon fields directly without extra resolution queries.

-- ============================================================================
-- 1. Recreate coffee_directory_mv with canon name arrays
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS coffee_directory_mv CASCADE;

CREATE MATERIALIZED VIEW coffee_directory_mv AS
WITH 
  variant_aggs AS (
    SELECT 
      v.coffee_id,
      MIN(CASE WHEN v.in_stock AND v.price_one_time IS NOT NULL THEN v.price_one_time END) AS min_price_in_stock,
      MIN(CASE WHEN v.in_stock AND v.valid_for_best_value THEN v.normalized_250g END) AS best_normalized_250g,
      (ARRAY_AGG(v.variant_id ORDER BY v.normalized_250g NULLS LAST, v.price_one_time NULLS LAST) 
       FILTER (WHERE v.in_stock AND v.valid_for_best_value))[1] AS best_variant_id,
      ARRAY_AGG(DISTINCT v.weight_g ORDER BY v.weight_g) FILTER (WHERE v.weight_g IS NOT NULL) AS weights_available,
      COUNT(*) FILTER (WHERE v.in_stock) AS in_stock_count,
      BOOL_OR(v.weight_g BETWEEN 240 AND 260) AS has_250g_bool
    FROM variant_computed v
    GROUP BY v.coffee_id
  ),
  junction_aggs AS (
    SELECT 
      c.id AS coffee_id,
      ARRAY_AGG(DISTINCT fn.key ORDER BY fn.key)
        FILTER (WHERE fn.key IS NOT NULL) AS flavor_keys,
      ARRAY_AGG(DISTINCT csn.id ORDER BY csn.id)
        FILTER (WHERE csn.id IS NOT NULL AND csn.node_type = 'flavor') AS canon_flavor_node_ids,
      ARRAY_AGG(DISTINCT csn.slug ORDER BY csn.slug)
        FILTER (WHERE csn.slug IS NOT NULL AND csn.node_type = 'flavor') AS canon_flavor_slugs,
      ARRAY_AGG(DISTINCT csn.descriptor ORDER BY csn.descriptor)
        FILTER (WHERE csn.descriptor IS NOT NULL AND csn.node_type = 'flavor') AS canon_flavor_descriptors,
      ARRAY_AGG(DISTINCT csn.subcategory ORDER BY csn.subcategory)
        FILTER (WHERE csn.subcategory IS NOT NULL AND csn.node_type = 'flavor') AS canon_flavor_subcategories,
      ARRAY_AGG(DISTINCT csn.family ORDER BY csn.family)
        FILTER (WHERE csn.family IS NOT NULL AND csn.node_type = 'flavor') AS canon_flavor_families,
      ARRAY_AGG(DISTINCT cr.region_id ORDER BY cr.region_id)
        FILTER (WHERE cr.region_id IS NOT NULL) AS region_ids,
      ARRAY_AGG(DISTINCT creg.display_name ORDER BY creg.display_name)
        FILTER (WHERE creg.display_name IS NOT NULL) AS canon_region_names,
      ARRAY_AGG(DISTINCT ce.estate_id ORDER BY ce.estate_id)
        FILTER (WHERE ce.estate_id IS NOT NULL) AS estate_ids,
      ARRAY_AGG(DISTINCT cest.name ORDER BY cest.name)
        FILTER (WHERE cest.name IS NOT NULL) AS canon_estate_names,
      ARRAY_AGG(DISTINCT bm.canonical_key ORDER BY bm.canonical_key)
        FILTER (WHERE bm.canonical_key IS NOT NULL) AS brew_method_canonical_keys
    FROM coffees c
    LEFT JOIN coffee_flavor_notes cfn ON cfn.coffee_id = c.id
    LEFT JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
    LEFT JOIN flavor_note_to_canon fntc ON fntc.flavor_note_id = fn.id
    LEFT JOIN canon_sensory_nodes csn ON csn.id = fntc.canon_node_id
    LEFT JOIN coffee_regions cr ON cr.coffee_id = c.id
    LEFT JOIN regions reg ON reg.id = cr.region_id
    LEFT JOIN canon_regions creg ON creg.id = reg.canon_region_id
    LEFT JOIN coffee_estates ce ON ce.coffee_id = c.id
    LEFT JOIN estates est ON est.id = ce.estate_id
    LEFT JOIN canon_estates cest ON cest.id = est.canon_estate_id
    LEFT JOIN coffee_brew_methods cbm ON cbm.coffee_id = c.id
    LEFT JOIN brew_methods bm ON bm.id = cbm.brew_method_id
    GROUP BY c.id
  ),
  first_images AS (
    SELECT DISTINCT ON (ci.coffee_id)
      ci.coffee_id,
      ci.imagekit_url
    FROM coffee_images ci
    ORDER BY ci.coffee_id, ci.sort_order ASC
  )
SELECT 
  c.id            AS coffee_id,
  c.roaster_id,
  c.name,
  c.slug,
  c.status,
  c.roast_level,
  c.roast_level_raw,
  c.roast_style_raw,
  c.process,
  c.process_raw,
  c.direct_buy_url,
  c.created_at,
  c.updated_at,
  va.min_price_in_stock,
  va.best_normalized_250g,
  va.best_variant_id,
  va.weights_available,
  COALESCE(va.in_stock_count, 0) AS in_stock_count,
  COALESCE(va.has_250g_bool, false) AS has_250g_bool,
  (s.coffee_id IS NOT NULL) AS has_sensory,
  s.updated_at AS sensory_updated_at,
  CASE WHEN s.coffee_id IS NOT NULL THEN
    JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
      'acidity',    s.acidity,
      'sweetness',  s.sweetness,
      'body',       s.body,
      'clarity',    s.clarity,
      'aftertaste', s.aftertaste,
      'bitterness', s.bitterness
    ))
  ELSE NULL END AS sensory_public,
  c.decaf,
  c.is_limited,
  c.bean_species,
  c.rating_avg,
  c.rating_count,
  c.tags,
  c.works_with_milk,
  r.slug AS roaster_slug,
  r.name AS roaster_name,
  r.hq_city,
  r.hq_state,
  r.hq_country,
  r.website,
  fi.imagekit_url AS image_url,
  ja.flavor_keys,
  ja.canon_flavor_node_ids,
  ja.canon_flavor_slugs,
  ja.canon_flavor_descriptors,
  ja.canon_flavor_subcategories,
  ja.canon_flavor_families,
  ja.region_ids,
  ja.canon_region_names,
  ja.estate_ids,
  ja.canon_estate_names,
  ja.brew_method_canonical_keys
FROM coffees c
LEFT JOIN variant_aggs va ON va.coffee_id = c.id
LEFT JOIN sensory_params s ON s.coffee_id = c.id
LEFT JOIN roasters r ON r.id = c.roaster_id
LEFT JOIN first_images fi ON fi.coffee_id = c.id
LEFT JOIN junction_aggs ja ON ja.coffee_id = c.id;

CREATE UNIQUE INDEX idx_coffee_directory_mv_coffee_id 
  ON coffee_directory_mv USING btree (coffee_id);

CREATE INDEX idx_coffee_directory_mv_created_at 
  ON coffee_directory_mv USING btree (created_at DESC NULLS LAST);

CREATE INDEX idx_coffee_directory_mv_roaster_id 
  ON coffee_directory_mv USING btree (roaster_id);

CREATE INDEX idx_coffee_directory_mv_status 
  ON coffee_directory_mv USING btree (status);

CREATE INDEX idx_coffee_directory_mv_roast_level 
  ON coffee_directory_mv USING btree (roast_level);

CREATE INDEX idx_coffee_directory_mv_process 
  ON coffee_directory_mv USING btree (process);

CREATE INDEX idx_coffee_directory_mv_best_normalized_250g 
  ON coffee_directory_mv USING btree (best_normalized_250g);

CREATE INDEX idx_coffee_directory_mv_in_stock_count 
  ON coffee_directory_mv USING btree (in_stock_count);

CREATE INDEX idx_coffee_directory_mv_has_250g_bool 
  ON coffee_directory_mv USING btree (has_250g_bool);

CREATE INDEX idx_coffee_directory_mv_works_with_milk 
  ON coffee_directory_mv USING btree (works_with_milk);

CREATE INDEX idx_coffee_directory_mv_status_roast_level 
  ON coffee_directory_mv USING btree (status, roast_level);

CREATE INDEX idx_coffee_directory_mv_roaster_status 
  ON coffee_directory_mv USING btree (roaster_id, status);

CREATE INDEX idx_coffee_directory_mv_flavor_keys_gin 
  ON coffee_directory_mv USING gin (flavor_keys);

CREATE INDEX idx_coffee_directory_mv_canon_flavor_node_ids_gin
  ON coffee_directory_mv USING gin (canon_flavor_node_ids);

CREATE INDEX idx_coffee_directory_mv_canon_flavor_slugs_gin
  ON coffee_directory_mv USING gin (canon_flavor_slugs);

CREATE INDEX idx_coffee_directory_mv_canon_flavor_descriptors_gin
  ON coffee_directory_mv USING gin (canon_flavor_descriptors);

CREATE INDEX idx_coffee_directory_mv_canon_flavor_subcategories_gin
  ON coffee_directory_mv USING gin (canon_flavor_subcategories);

CREATE INDEX idx_coffee_directory_mv_canon_flavor_families_gin
  ON coffee_directory_mv USING gin (canon_flavor_families);

CREATE INDEX idx_coffee_directory_mv_region_ids_gin 
  ON coffee_directory_mv USING gin (region_ids);

CREATE INDEX idx_coffee_directory_mv_canon_region_names_gin 
  ON coffee_directory_mv USING gin (canon_region_names);

CREATE INDEX idx_coffee_directory_mv_estate_ids_gin 
  ON coffee_directory_mv USING gin (estate_ids);

CREATE INDEX idx_coffee_directory_mv_canon_estate_names_gin 
  ON coffee_directory_mv USING gin (canon_estate_names);

CREATE INDEX idx_coffee_directory_mv_brew_method_canonical_keys_gin 
  ON coffee_directory_mv USING gin (brew_method_canonical_keys);

-- ============================================================================
-- 2. Recreate refresh function (CASCADE dropped it)
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_coffee_directory_mv()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY coffee_directory_mv;
END;
$$;

COMMENT ON FUNCTION refresh_coffee_directory_mv() IS 
  'Refreshes the coffee_directory_mv materialized view concurrently. Can be called by scheduled jobs.';
