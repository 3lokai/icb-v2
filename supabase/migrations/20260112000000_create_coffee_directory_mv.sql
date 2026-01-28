-- Migration: Create coffee_directory_mv materialized view
-- Created: 2026-01-12
-- Description: Materialized view consolidating all data needed for coffee directory listing and filtering
--              Eliminates multiple joins currently done in fetch-coffees.ts by including:
--              - All fields from coffee_summary view logic
--              - Additional fields from coffees table
--              - Roaster information from roasters table
--              - First image URL from coffee_images table
--              - Junction table arrays for efficient filtering

-- ============================================================================
-- MATERIALIZED VIEW: coffee_directory_mv
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS coffee_directory_mv AS
WITH 
  -- Pre-aggregate variant data to avoid row explosion
  variant_aggs AS (
    SELECT 
      v.coffee_id,
      MIN(CASE WHEN v.in_stock AND v.price_one_time IS NOT NULL THEN v.price_one_time END) AS min_price_in_stock,
      MIN(CASE WHEN v.in_stock AND v.valid_for_best_value THEN v.normalized_250g END) AS best_normalized_250g,
      -- best_variant_id: get first variant_id ordered by normalized_250g, price_one_time
      (ARRAY_AGG(v.variant_id ORDER BY v.normalized_250g NULLS LAST, v.price_one_time NULLS LAST) 
       FILTER (WHERE v.in_stock AND v.valid_for_best_value))[1] AS best_variant_id,
      -- weights_available: aggregate all weights
      ARRAY_AGG(DISTINCT v.weight_g ORDER BY v.weight_g) FILTER (WHERE v.weight_g IS NOT NULL) AS weights_available,
      -- in_stock_count: count in-stock variants
      COUNT(*) FILTER (WHERE v.in_stock) AS in_stock_count,
      -- has_250g_bool: check if any variant has weight between 240-260
      BOOL_OR(v.weight_g BETWEEN 240 AND 260) AS has_250g_bool
    FROM variant_computed v
    GROUP BY v.coffee_id
  ),
  -- Pre-aggregate junction table arrays separately to avoid row explosion
  junction_aggs AS (
    SELECT 
      c.id AS coffee_id,
      ARRAY_AGG(DISTINCT fn.key ORDER BY fn.key) FILTER (WHERE fn.key IS NOT NULL) AS flavor_keys,
      ARRAY_AGG(DISTINCT cr.region_id ORDER BY cr.region_id) FILTER (WHERE cr.region_id IS NOT NULL) AS region_ids,
      ARRAY_AGG(DISTINCT ce.estate_id ORDER BY ce.estate_id) FILTER (WHERE ce.estate_id IS NOT NULL) AS estate_ids,
      ARRAY_AGG(DISTINCT bm.canonical_key ORDER BY bm.canonical_key) FILTER (WHERE bm.canonical_key IS NOT NULL) AS brew_method_canonical_keys
    FROM coffees c
    LEFT JOIN coffee_flavor_notes cfn ON cfn.coffee_id = c.id
    LEFT JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
    LEFT JOIN coffee_regions cr ON cr.coffee_id = c.id
    LEFT JOIN coffee_estates ce ON ce.coffee_id = c.id
    LEFT JOIN coffee_brew_methods cbm ON cbm.coffee_id = c.id
    LEFT JOIN brew_methods bm ON bm.id = cbm.brew_method_id
    GROUP BY c.id
  ),
  -- Pre-aggregate first image separately
  first_images AS (
    SELECT DISTINCT ON (ci.coffee_id)
      ci.coffee_id,
      ci.imagekit_url
    FROM coffee_images ci
    ORDER BY ci.coffee_id, ci.sort_order ASC
  )
SELECT 
  -- All fields from coffee_summary view (replicated from actual view definition)
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
  
  -- Pricing rollups from pre-aggregated variant data (with null safety)
  va.min_price_in_stock,
  va.best_normalized_250g,
  va.best_variant_id,
  va.weights_available,
  COALESCE(va.in_stock_count, 0) AS in_stock_count,
  COALESCE(va.has_250g_bool, false) AS has_250g_bool,
  
  -- Sensory signals (from coffee_summary)
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
  
  -- Additional coffees fields (not in coffee_summary)
  c.decaf,
  c.is_limited,
  c.bean_species,
  c.rating_avg,
  c.rating_count,
  c.tags,
  
  -- Roaster fields
  r.slug AS roaster_slug,
  r.name AS roaster_name,
  r.hq_city,
  r.hq_state,
  r.hq_country,
  r.website,
  
  -- First image URL from pre-aggregated CTE
  fi.imagekit_url AS image_url,
  
  -- Junction table arrays from pre-aggregated CTE
  ja.flavor_keys,
  ja.region_ids,
  ja.estate_ids,
  ja.brew_method_canonical_keys

FROM coffees c
LEFT JOIN variant_aggs va ON va.coffee_id = c.id
LEFT JOIN sensory_params s ON s.coffee_id = c.id
LEFT JOIN roasters r ON r.id = c.roaster_id
LEFT JOIN first_images fi ON fi.coffee_id = c.id
LEFT JOIN junction_aggs ja ON ja.coffee_id = c.id;

-- ============================================================================
-- INDEXES ON MATERIALIZED VIEW
-- ============================================================================

-- UNIQUE index on coffee_id (required for CONCURRENT refresh, also serves as primary lookup)
CREATE UNIQUE INDEX IF NOT EXISTS idx_coffee_directory_mv_coffee_id 
  ON coffee_directory_mv USING btree (coffee_id);

-- Filtering indexes
CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_roaster_id 
  ON coffee_directory_mv USING btree (roaster_id);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_status 
  ON coffee_directory_mv USING btree (status);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_roast_level 
  ON coffee_directory_mv USING btree (roast_level);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_process 
  ON coffee_directory_mv USING btree (process);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_best_normalized_250g 
  ON coffee_directory_mv USING btree (best_normalized_250g);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_in_stock_count 
  ON coffee_directory_mv USING btree (in_stock_count);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_has_250g_bool 
  ON coffee_directory_mv USING btree (has_250g_bool);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_status_roast_level 
  ON coffee_directory_mv USING btree (status, roast_level);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_roaster_status 
  ON coffee_directory_mv USING btree (roaster_id, status);

-- GIN indexes on array columns for efficient array operations
CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_flavor_keys_gin 
  ON coffee_directory_mv USING gin (flavor_keys);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_region_ids_gin 
  ON coffee_directory_mv USING gin (region_ids);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_estate_ids_gin 
  ON coffee_directory_mv USING gin (estate_ids);

CREATE INDEX IF NOT EXISTS idx_coffee_directory_mv_brew_method_canonical_keys_gin 
  ON coffee_directory_mv USING gin (brew_method_canonical_keys);

-- ============================================================================
-- REFRESH FUNCTION
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

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON MATERIALIZED VIEW coffee_directory_mv IS 
  'Materialized view consolidating all data needed for coffee directory listing and filtering. 
   Includes all fields from coffee_summary view logic plus additional fields from coffees, 
   roasters, coffee_images tables and junction table arrays for efficient filtering. 
   Refresh using refresh_coffee_directory_mv() function.';

