-- Migration: Update get_coffee_filter_meta to use coffee_directory_mv
-- Created: 2026-01-13
-- Description: Updates RPC function to use coffee_directory_mv materialized view
--              Replaces EXISTS subqueries for junction tables with array operators
--              for better performance

-- Drop the function if it exists (in case of previous failed attempts)
DROP FUNCTION IF EXISTS public.get_coffee_filter_meta CASCADE;

CREATE OR REPLACE FUNCTION public.get_coffee_filter_meta(
  p_search_query TEXT DEFAULT NULL,
  p_roast_levels TEXT[] DEFAULT NULL,
  p_processes TEXT[] DEFAULT NULL,
  p_statuses TEXT[] DEFAULT NULL,
  p_roaster_ids UUID[] DEFAULT NULL,
  p_region_ids UUID[] DEFAULT NULL,
  p_estate_ids UUID[] DEFAULT NULL,
  p_brew_method_canonical_keys grind_enum[] DEFAULT NULL,
  p_flavor_keys TEXT[] DEFAULT NULL,
  p_in_stock_only BOOLEAN DEFAULT FALSE,
  p_has_250g_only BOOLEAN DEFAULT FALSE,
  p_min_price NUMERIC DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_canon_keys grind_enum[];
  base_filtered_coffee_ids UUID[];
  result JSON;
BEGIN
  -- Use canonical_keys directly (if provided)
  selected_canon_keys := p_brew_method_canonical_keys;

  -- Build base filtered coffee IDs set using all active filters
  -- Now using coffee_directory_mv with array operators for junction tables
  WITH filtered_coffees AS (
    SELECT DISTINCT c.coffee_id
    FROM coffee_directory_mv c
    WHERE 1=1
      -- Text search
      AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
      
      -- Direct filters (cast TEXT[] to enum types)
      AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
      AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
      AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
      AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
      
      -- Boolean filters
      AND (NOT p_in_stock_only OR c.in_stock_count > 0)
      AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
      
      -- Numeric filters
      AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
      AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
      
      -- Junction table filters using array operators (from coffee_directory_mv)
      -- flavor_keys: use contains (@>) - coffee must have ALL selected flavors
      AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
      
      -- region_ids: use overlaps (&&) - coffee must have ANY selected region
      AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
      
      -- estate_ids: use overlaps (&&) - coffee must have ANY selected estate
      AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
      
      -- brew_method_canonical_keys: use contains (@>) - coffee must support ALL selected methods
      AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
  )
  SELECT array_agg(coffee_id)
  INTO base_filtered_coffee_ids
  FROM filtered_coffees;

  -- If no coffees match, return empty meta
  IF base_filtered_coffee_ids IS NULL OR array_length(base_filtered_coffee_ids, 1) = 0 THEN
    RETURN json_build_object(
      'flavorNotes', '[]'::json,
      'regions', '[]'::json,
      'estates', '[]'::json,
      'brewMethods', '[]'::json,
      'roasters', '[]'::json,
      'roastLevels', '[]'::json,
      'processes', '[]'::json,
      'statuses', '[]'::json,
      'totals', json_build_object('coffees', 0, 'roasters', 0)
    );
  END IF;

  -- Build result JSON with counts for each filter category
  -- For each category, count options while excluding that category from filters
  -- Note: We still join junction tables for counting, but filter coffee set using coffee_directory_mv
  SELECT json_build_object(
    'flavorNotes', (
      -- Count flavor notes (excluding flavor_keys filter)
      SELECT json_agg(
        json_build_object(
          'id', sub.key,
          'label', sub.label,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.label ASC
      )
      FROM (
        SELECT 
          fn.key,
          fn.label,
          COUNT(DISTINCT cfn.coffee_id) AS coffee_count
        FROM coffee_flavor_notes cfn
        JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
        WHERE cfn.coffee_id = ANY(
          -- Rebuild filtered set excluding flavor_keys, using coffee_directory_mv with array operators
          SELECT DISTINCT c.coffee_id
          FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
        )
        GROUP BY fn.id, fn.key, fn.label
        HAVING COUNT(DISTINCT cfn.coffee_id) > 0
      ) sub
    ),
    'regions', (
      -- Count regions (excluding region_ids filter)
      SELECT json_agg(
        json_build_object(
          'id', sub.id,
          'label', sub.display_name,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.display_name ASC
      )
      FROM (
        SELECT 
          r.id,
          COALESCE(r.display_name, r.id::TEXT) AS display_name,
          COUNT(DISTINCT cr.coffee_id) AS coffee_count
        FROM coffee_regions cr
        JOIN regions r ON r.id = cr.region_id
        WHERE cr.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id
          FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
            AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
        )
        GROUP BY r.id, r.display_name
        HAVING COUNT(DISTINCT cr.coffee_id) > 0
      ) sub
    ),
    'estates', (
      -- Count estates (excluding estate_ids filter)
      SELECT json_agg(
        json_build_object(
          'id', sub.id,
          'label', sub.name,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.name ASC
      )
      FROM (
        SELECT 
          e.id,
          e.name,
          COUNT(DISTINCT ce.coffee_id) AS coffee_count
        FROM coffee_estates ce
        JOIN estates e ON e.id = ce.estate_id
        WHERE ce.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id
          FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
            AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
            AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
        )
        GROUP BY e.id, e.name
        HAVING COUNT(DISTINCT ce.coffee_id) > 0
      ) sub
    ),
    'brewMethods', (
      -- Count brew methods grouped by canonical_key (excluding brew_method_ids filter)
      -- Groups related methods (cappuccino, latte, espresso) into single option with canonical_label
      SELECT json_agg(
        json_build_object(
          'id', sub.canonical_key,
          'label', sub.label,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.label ASC
      )
      FROM (
        SELECT 
          bm.canonical_key,
          MAX(bm.canonical_label) AS label,
          COUNT(DISTINCT cbm.coffee_id) AS coffee_count
        FROM coffee_brew_methods cbm
        JOIN brew_methods bm ON bm.id = cbm.brew_method_id
        WHERE cbm.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id
          FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
            AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
        )
        AND bm.canonical_key IS NOT NULL
        AND bm.canonical_label IS NOT NULL
        GROUP BY bm.canonical_key
        HAVING COUNT(DISTINCT cbm.coffee_id) > 0
      ) sub
    ),
    'roasters', (
      -- Count roasters (excluding roaster_ids filter)
      SELECT json_agg(
        json_build_object(
          'id', sub.id,
          'label', sub.name,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.name ASC
      )
      FROM (
        SELECT 
          r.id,
          r.name,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        JOIN roasters r ON r.id = c.roaster_id
        WHERE c.coffee_id = ANY(
          SELECT DISTINCT c2.coffee_id
          FROM coffee_directory_mv c2
          WHERE c2.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c2.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c2.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c2.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c2.status = ANY(p_statuses::coffee_status_enum[]))
            AND (NOT p_in_stock_only OR c2.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c2.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c2.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c2.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c2.flavor_keys @> p_flavor_keys)
            AND (p_region_ids IS NULL OR c2.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c2.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c2.brew_method_canonical_keys @> selected_canon_keys)
        )
        AND c.roaster_id IS NOT NULL
        GROUP BY r.id, r.name
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'roastLevels', (
      -- Count roast levels (excluding roast_levels filter)
      SELECT json_agg(
        json_build_object(
          'value', sub.roast_level,
          'label', sub.label,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.roast_level ASC
      )
      FROM (
        SELECT 
          c.roast_level,
          CASE c.roast_level
            WHEN 'light' THEN 'Light'
            WHEN 'light_medium' THEN 'Light Medium'
            WHEN 'medium' THEN 'Medium'
            WHEN 'medium_dark' THEN 'Medium Dark'
            WHEN 'dark' THEN 'Dark'
            ELSE c.roast_level::TEXT
          END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
          AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
          AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
          AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
          AND c.roast_level IS NOT NULL
        GROUP BY c.roast_level
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'processes', (
      -- Count processes (excluding processes filter)
      SELECT json_agg(
        json_build_object(
          'value', sub.process,
          'label', sub.label,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.process ASC
      )
      FROM (
        SELECT 
          c.process,
          CASE c.process
            WHEN 'washed' THEN 'Washed'
            WHEN 'natural' THEN 'Natural'
            WHEN 'honey' THEN 'Honey'
            WHEN 'pulped_natural' THEN 'Pulped Natural'
            WHEN 'monsooned' THEN 'Monsooned'
            WHEN 'wet_hulled' THEN 'Wet Hulled'
            WHEN 'anaerobic' THEN 'Anaerobic'
            WHEN 'carbonic_maceration' THEN 'Carbonic Maceration'
            WHEN 'double_fermented' THEN 'Double Fermented'
            WHEN 'experimental' THEN 'Experimental'
            WHEN 'other' THEN 'Other'
            WHEN 'washed_natural' THEN 'Washed Natural'
            ELSE c.process::TEXT
          END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
          AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
          AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
          AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
          AND c.process IS NOT NULL
        GROUP BY c.process
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'statuses', (
      -- Count statuses (excluding statuses filter)
      SELECT json_agg(
        json_build_object(
          'value', sub.status,
          'label', sub.label,
          'count', sub.coffee_count
        ) ORDER BY sub.coffee_count DESC, sub.status ASC
      )
      FROM (
        SELECT 
          c.status,
          CASE c.status
            WHEN 'active' THEN 'Active'
            WHEN 'seasonal' THEN 'Seasonal'
            WHEN 'discontinued' THEN 'Discontinued'
            WHEN 'draft' THEN 'Draft'
            WHEN 'hidden' THEN 'Hidden'
            WHEN 'coming_soon' THEN 'Coming Soon'
            WHEN 'archived' THEN 'Archived'
            ELSE c.status::TEXT
          END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
          AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
          AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
          AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys @> selected_canon_keys)
          AND c.status IS NOT NULL
        GROUP BY c.status
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'totals', (
      -- Count totals using base filtered set
      SELECT json_build_object(
        'coffees', COUNT(DISTINCT c.coffee_id),
        'roasters', (
          SELECT COUNT(DISTINCT id)
          FROM roasters
          WHERE is_active = TRUE
        )
      )
      FROM coffee_directory_mv c
      WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
    )
  )
  INTO result;

  -- Return NULL arrays as empty arrays
  RETURN COALESCE(result, json_build_object(
    'flavorNotes', '[]'::json,
    'regions', '[]'::json,
    'estates', '[]'::json,
    'brewMethods', '[]'::json,
    'roasters', '[]'::json,
    'roastLevels', '[]'::json,
    'processes', '[]'::json,
    'statuses', '[]'::json,
    'totals', json_build_object('coffees', 0, 'roasters', 0)
  ));
END;
$$;

COMMENT ON FUNCTION public.get_coffee_filter_meta IS
  'Returns filter metadata with counts for coffee directory filtering.
   Updated to use coffee_directory_mv materialized view with array operators for junction table filtering.';
