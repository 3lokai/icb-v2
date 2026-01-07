-- Migration: Create RPC function for coffee filter meta with counts
-- Created: 2026-01-05
-- Description: Returns filter meta with counts filtered by active filters, using canonical_key-based filtering for brew_methods

-- ============================================================================
-- RPC FUNCTION: get_coffee_filter_meta
-- ============================================================================

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
  WITH filtered_coffees AS (
    SELECT DISTINCT c.coffee_id
    FROM coffee_summary c
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
      
      -- Numeric filter
      AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
      
      -- Junction table filters: flavor_keys
      AND (
        p_flavor_keys IS NULL
        OR EXISTS (
          SELECT 1
          FROM coffee_flavor_notes cfn
          JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
          WHERE cfn.coffee_id = c.coffee_id
            AND fn.key = ANY(p_flavor_keys)
        )
      )
      
      -- Junction table filters: region_ids
      AND (
        p_region_ids IS NULL
        OR EXISTS (
          SELECT 1
          FROM coffee_regions cr
          WHERE cr.coffee_id = c.coffee_id
            AND cr.region_id = ANY(p_region_ids)
        )
      )
      
      -- Junction table filters: estate_ids
      AND (
        p_estate_ids IS NULL
        OR EXISTS (
          SELECT 1
          FROM coffee_estates ce
          WHERE ce.coffee_id = c.coffee_id
            AND ce.estate_id = ANY(p_estate_ids)
        )
      )
      
      -- Junction table filters: brew_method_ids (using canonical_key)
      AND (
        selected_canon_keys IS NULL
        OR EXISTS (
          SELECT 1
          FROM coffee_brew_methods cbm
          JOIN brew_methods bm ON bm.id = cbm.brew_method_id
          WHERE cbm.coffee_id = c.coffee_id
            AND bm.canonical_key IS NOT NULL
            AND bm.canonical_key = ANY(selected_canon_keys)
        )
      )
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
  SELECT json_build_object(
    'flavorNotes', (
      -- Count flavor notes (excluding flavor_keys filter)
      SELECT json_agg(
        json_build_object(
          'id', fn.key,
          'label', fn.label,
          'count', COUNT(DISTINCT cfn.coffee_id)
        ) ORDER BY COUNT(DISTINCT cfn.coffee_id) DESC, fn.label ASC
      )
      FROM coffee_flavor_notes cfn
      JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
      WHERE cfn.coffee_id = ANY(
        -- Rebuild filtered set excluding flavor_keys
        SELECT DISTINCT c.coffee_id
        FROM coffee_summary c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (
            p_region_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_regions cr
              WHERE cr.coffee_id = c.coffee_id AND cr.region_id = ANY(p_region_ids)
            )
          )
          AND (
            p_estate_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_estates ce
              WHERE ce.coffee_id = c.coffee_id AND ce.estate_id = ANY(p_estate_ids)
            )
          )
          AND (
            selected_canon_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_brew_methods cbm
              JOIN brew_methods bm ON bm.id = cbm.brew_method_id
              WHERE cbm.coffee_id = c.coffee_id
                AND bm.canonical_key IS NOT NULL
                AND bm.canonical_key = ANY(selected_canon_keys)
            )
          )
      )
      GROUP BY fn.id, fn.key, fn.label
      HAVING COUNT(DISTINCT cfn.coffee_id) > 0
    ),
    'regions', (
      -- Count regions (excluding region_ids filter)
      SELECT json_agg(
        json_build_object(
          'id', r.id,
          'label', COALESCE(r.display_name, r.id),
          'count', COUNT(DISTINCT cr.coffee_id)
        ) ORDER BY COUNT(DISTINCT cr.coffee_id) DESC, COALESCE(r.display_name, r.id) ASC
      )
      FROM coffee_regions cr
      JOIN regions r ON r.id = cr.region_id
      WHERE cr.coffee_id = ANY(
        SELECT DISTINCT c.coffee_id
        FROM coffee_summary c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (
            p_flavor_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_flavor_notes cfn
              JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
              WHERE cfn.coffee_id = c.coffee_id AND fn.key = ANY(p_flavor_keys)
            )
          )
          AND (
            p_estate_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_estates ce
              WHERE ce.coffee_id = c.coffee_id AND ce.estate_id = ANY(p_estate_ids)
            )
          )
          AND (
            selected_canon_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_brew_methods cbm
              JOIN brew_methods bm ON bm.id = cbm.brew_method_id
              WHERE cbm.coffee_id = c.coffee_id
                AND bm.canonical_key IS NOT NULL
                AND bm.canonical_key = ANY(selected_canon_keys)
            )
          )
      )
      GROUP BY r.id, r.display_name
      HAVING COUNT(DISTINCT cr.coffee_id) > 0
    ),
    'estates', (
      -- Count estates (excluding estate_ids filter)
      SELECT json_agg(
        json_build_object(
          'id', e.id,
          'label', e.name,
          'count', COUNT(DISTINCT ce.coffee_id)
        ) ORDER BY COUNT(DISTINCT ce.coffee_id) DESC, e.name ASC
      )
      FROM coffee_estates ce
      JOIN estates e ON e.id = ce.estate_id
      WHERE ce.coffee_id = ANY(
        SELECT DISTINCT c.coffee_id
        FROM coffee_summary c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (
            p_flavor_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_flavor_notes cfn
              JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
              WHERE cfn.coffee_id = c.coffee_id AND fn.key = ANY(p_flavor_keys)
            )
          )
          AND (
            p_region_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_regions cr
              WHERE cr.coffee_id = c.coffee_id AND cr.region_id = ANY(p_region_ids)
            )
          )
          AND (
            selected_canon_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_brew_methods cbm
              JOIN brew_methods bm ON bm.id = cbm.brew_method_id
              WHERE cbm.coffee_id = c.coffee_id
                AND bm.canonical_key IS NOT NULL
                AND bm.canonical_key = ANY(selected_canon_keys)
            )
          )
      )
      GROUP BY e.id, e.name
      HAVING COUNT(DISTINCT ce.coffee_id) > 0
    ),
    'brewMethods', (
      -- Count brew methods grouped by canonical_key (excluding brew_method_ids filter)
      -- Groups related methods (cappuccino, latte, espresso) into single option with canonical_label
      SELECT json_agg(
        json_build_object(
          'id', bm.canonical_key,
          'label', COALESCE(bm.canonical_label, bm.label),
          'count', COUNT(DISTINCT cbm.coffee_id)
        ) ORDER BY COUNT(DISTINCT cbm.coffee_id) DESC, COALESCE(bm.canonical_label, bm.label) ASC
      )
      FROM coffee_brew_methods cbm
      JOIN brew_methods bm ON bm.id = cbm.brew_method_id
      WHERE cbm.coffee_id = ANY(
        SELECT DISTINCT c.coffee_id
        FROM coffee_summary c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (
            p_flavor_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_flavor_notes cfn
              JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
              WHERE cfn.coffee_id = c.coffee_id AND fn.key = ANY(p_flavor_keys)
            )
          )
          AND (
            p_region_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_regions cr
              WHERE cr.coffee_id = c.coffee_id AND cr.region_id = ANY(p_region_ids)
            )
          )
          AND (
            p_estate_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_estates ce
              WHERE ce.coffee_id = c.coffee_id AND ce.estate_id = ANY(p_estate_ids)
            )
          )
      )
      AND bm.canonical_key IS NOT NULL
      GROUP BY bm.canonical_key, bm.canonical_label
      HAVING COUNT(DISTINCT cbm.coffee_id) > 0
    ),
    'roasters', (
      -- Count roasters (excluding roaster_ids filter)
      SELECT json_agg(
        json_build_object(
          'id', r.id,
          'label', r.name,
          'count', COUNT(DISTINCT c.coffee_id)
        ) ORDER BY COUNT(DISTINCT c.coffee_id) DESC, r.name ASC
      )
      FROM coffee_summary c
      JOIN roasters r ON r.id = c.roaster_id
      WHERE c.coffee_id = ANY(
        SELECT DISTINCT c2.coffee_id
        FROM coffee_summary c2
        WHERE c2.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c2.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c2.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c2.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c2.status = ANY(p_statuses::coffee_status_enum[]))
          AND (NOT p_in_stock_only OR c2.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c2.has_250g_bool = TRUE)
          AND (p_max_price IS NULL OR c2.best_normalized_250g <= p_max_price)
          AND (
            p_flavor_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_flavor_notes cfn
              JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
              WHERE cfn.coffee_id = c2.coffee_id AND fn.key = ANY(p_flavor_keys)
            )
          )
          AND (
            p_region_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_regions cr
              WHERE cr.coffee_id = c2.coffee_id AND cr.region_id = ANY(p_region_ids)
            )
          )
          AND (
            p_estate_ids IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_estates ce
              WHERE ce.coffee_id = c2.coffee_id AND ce.estate_id = ANY(p_estate_ids)
            )
          )
          AND (
            selected_canon_keys IS NULL
            OR EXISTS (
              SELECT 1 FROM coffee_brew_methods cbm
              JOIN brew_methods bm ON bm.id = cbm.brew_method_id
              WHERE cbm.coffee_id = c2.coffee_id
                AND bm.canonical_key IS NOT NULL
                AND bm.canonical_key = ANY(selected_canon_keys)
            )
          )
      )
      AND c.roaster_id IS NOT NULL
      GROUP BY r.id, r.name
      HAVING COUNT(DISTINCT c.coffee_id) > 0
    ),
    'roastLevels', (
      -- Count roast levels (excluding roast_levels filter)
      SELECT json_agg(
        json_build_object(
          'value', c.roast_level,
          'label', CASE c.roast_level
            WHEN 'light' THEN 'Light'
            WHEN 'light_medium' THEN 'Light Medium'
            WHEN 'medium' THEN 'Medium'
            WHEN 'medium_dark' THEN 'Medium Dark'
            WHEN 'dark' THEN 'Dark'
            ELSE c.roast_level::TEXT
          END,
          'count', COUNT(DISTINCT c.coffee_id)
        ) ORDER BY COUNT(DISTINCT c.coffee_id) DESC, c.roast_level ASC
      )
      FROM coffee_summary c
      WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
        AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
        AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
        AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
        AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
        AND (NOT p_in_stock_only OR c.in_stock_count > 0)
        AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
        AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
        AND (
          p_flavor_keys IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_flavor_notes cfn
            JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
            WHERE cfn.coffee_id = c.coffee_id AND fn.key = ANY(p_flavor_keys)
          )
        )
        AND (
          p_region_ids IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_regions cr
            WHERE cr.coffee_id = c.coffee_id AND cr.region_id = ANY(p_region_ids)
          )
        )
        AND (
          p_estate_ids IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_estates ce
            WHERE ce.coffee_id = c.coffee_id AND ce.estate_id = ANY(p_estate_ids)
          )
        )
        AND (
          selected_canon_keys IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_brew_methods cbm
            JOIN brew_methods bm ON bm.id = cbm.brew_method_id
            WHERE cbm.coffee_id = c.coffee_id
              AND bm.canonical_key IS NOT NULL
              AND bm.canonical_key = ANY(selected_canon_keys)
          )
        )
        AND c.roast_level IS NOT NULL
      GROUP BY c.roast_level
      HAVING COUNT(DISTINCT c.coffee_id) > 0
    ),
    'processes', (
      -- Count processes (excluding processes filter)
      SELECT json_agg(
        json_build_object(
          'value', c.process,
          'label', CASE c.process
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
          END,
          'count', COUNT(DISTINCT c.coffee_id)
        ) ORDER BY COUNT(DISTINCT c.coffee_id) DESC, c.process ASC
      )
      FROM coffee_summary c
      WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
        AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
        AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
        AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
        AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
        AND (NOT p_in_stock_only OR c.in_stock_count > 0)
        AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
        AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
        AND (
          p_flavor_keys IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_flavor_notes cfn
            JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
            WHERE cfn.coffee_id = c.coffee_id AND fn.key = ANY(p_flavor_keys)
          )
        )
        AND (
          p_region_ids IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_regions cr
            WHERE cr.coffee_id = c.coffee_id AND cr.region_id = ANY(p_region_ids)
          )
        )
        AND (
          p_estate_ids IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_estates ce
            WHERE ce.coffee_id = c.coffee_id AND ce.estate_id = ANY(p_estate_ids)
          )
        )
        AND (
          selected_canon_keys IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_brew_methods cbm
            JOIN brew_methods bm ON bm.id = cbm.brew_method_id
            WHERE cbm.coffee_id = c.coffee_id
              AND bm.canonical_key IS NOT NULL
              AND bm.canonical_key = ANY(selected_canon_keys)
          )
        )
        AND c.process IS NOT NULL
      GROUP BY c.process
      HAVING COUNT(DISTINCT c.coffee_id) > 0
    ),
    'statuses', (
      -- Count statuses (excluding statuses filter)
      SELECT json_agg(
        json_build_object(
          'value', c.status,
          'label', CASE c.status
            WHEN 'active' THEN 'Active'
            WHEN 'seasonal' THEN 'Seasonal'
            WHEN 'discontinued' THEN 'Discontinued'
            WHEN 'draft' THEN 'Draft'
            WHEN 'hidden' THEN 'Hidden'
            WHEN 'coming_soon' THEN 'Coming Soon'
            WHEN 'archived' THEN 'Archived'
            ELSE c.status::TEXT
          END,
          'count', COUNT(DISTINCT c.coffee_id)
        ) ORDER BY COUNT(DISTINCT c.coffee_id) DESC, c.status ASC
      )
      FROM coffee_summary c
      WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
        AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
        AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
        AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
        AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
        AND (NOT p_in_stock_only OR c.in_stock_count > 0)
        AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
        AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
        AND (
          p_flavor_keys IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_flavor_notes cfn
            JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
            WHERE cfn.coffee_id = c.coffee_id AND fn.key = ANY(p_flavor_keys)
          )
        )
        AND (
          p_region_ids IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_regions cr
            WHERE cr.coffee_id = c.coffee_id AND cr.region_id = ANY(p_region_ids)
          )
        )
        AND (
          p_estate_ids IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_estates ce
            WHERE ce.coffee_id = c.coffee_id AND ce.estate_id = ANY(p_estate_ids)
          )
        )
        AND (
          selected_canon_keys IS NULL
          OR EXISTS (
            SELECT 1 FROM coffee_brew_methods cbm
            JOIN brew_methods bm ON bm.id = cbm.brew_method_id
            WHERE cbm.coffee_id = c.coffee_id
              AND bm.canonical_key IS NOT NULL
              AND bm.canonical_key = ANY(selected_canon_keys)
          )
        )
        AND c.status IS NOT NULL
      GROUP BY c.status
      HAVING COUNT(DISTINCT c.coffee_id) > 0
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
      FROM coffee_summary c
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

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.get_coffee_filter_meta TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_coffee_filter_meta TO service_role;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.get_coffee_filter_meta IS 'Returns filter meta with counts filtered by active filters. Uses canonical_key-based filtering for brew_methods to allow related methods (e.g., cappuccino and espresso) to match each other.';


