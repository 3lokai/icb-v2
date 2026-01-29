-- Migration: Add species filter and species counts to get_coffee_filter_meta
-- Created: 2026-01-30
-- Description: Adds p_bean_species parameter and 'species' to the returned JSON
--              so the filter RPC works with coffee_directory_mv.bean_species.

DROP FUNCTION IF EXISTS public.get_coffee_filter_meta CASCADE;

CREATE OR REPLACE FUNCTION public.get_coffee_filter_meta(
  p_search_query TEXT DEFAULT NULL,
  p_roast_levels TEXT[] DEFAULT NULL,
  p_processes TEXT[] DEFAULT NULL,
  p_statuses TEXT[] DEFAULT NULL,
  p_bean_species TEXT[] DEFAULT NULL,
  p_roaster_ids UUID[] DEFAULT NULL,
  p_region_ids UUID[] DEFAULT NULL,
  p_estate_ids UUID[] DEFAULT NULL,
  p_brew_method_canonical_keys grind_enum[] DEFAULT NULL,
  p_flavor_keys TEXT[] DEFAULT NULL,
  p_canon_flavor_families TEXT[] DEFAULT NULL,
  p_canon_flavor_subcategories TEXT[] DEFAULT NULL,
  p_canon_flavor_node_ids UUID[] DEFAULT NULL,
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
  selected_canon_keys := p_brew_method_canonical_keys;

  WITH filtered_coffees AS (
    SELECT DISTINCT c.coffee_id
    FROM coffee_directory_mv c
    WHERE 1=1
      AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
      AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
      AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
      AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
      AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
      AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
      AND (NOT p_in_stock_only OR c.in_stock_count > 0)
      AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
      AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
      AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
      AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
      AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
      AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
      AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
      AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
      AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
      AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
  )
  SELECT array_agg(coffee_id)
  INTO base_filtered_coffee_ids
  FROM filtered_coffees;

  IF base_filtered_coffee_ids IS NULL OR array_length(base_filtered_coffee_ids, 1) = 0 THEN
    RETURN json_build_object(
      'flavorNotes', '[]'::json,
      'canonicalFlavors', '[]'::json,
      'regions', '[]'::json,
      'estates', '[]'::json,
      'brewMethods', '[]'::json,
      'roasters', '[]'::json,
      'roastLevels', '[]'::json,
      'processes', '[]'::json,
      'statuses', '[]'::json,
      'species', '[]'::json,
      'totals', json_build_object('coffees', 0, 'roasters', 0)
    );
  END IF;

  SELECT json_build_object(
    'flavorNotes', (
      SELECT json_agg(
        json_build_object('id', sub.key, 'label', sub.label, 'count', sub.coffee_count)
        ORDER BY sub.coffee_count DESC, sub.label ASC
      )
      FROM (
        SELECT fn.key, fn.label, COUNT(DISTINCT cfn.coffee_id) AS coffee_count
        FROM coffee_flavor_notes cfn
        JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
        WHERE cfn.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
            AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
            AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
            AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
        )
        GROUP BY fn.id, fn.key, fn.label
        HAVING COUNT(DISTINCT cfn.coffee_id) > 0
      ) sub
    ),
    'canonicalFlavors', (
      SELECT json_agg(
        json_build_object('id', sub.id, 'slug', sub.slug, 'descriptor', sub.descriptor, 'subcategory', sub.subcategory, 'family', sub.family, 'count', sub.coffee_count)
        ORDER BY sub.family ASC, sub.subcategory ASC, sub.coffee_count DESC
      )
      FROM (
        SELECT csn.id, csn.slug, csn.descriptor, csn.subcategory, csn.family, COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        CROSS JOIN LATERAL unnest(c.canon_flavor_node_ids) AS node_id
        JOIN canon_sensory_nodes csn ON csn.id = node_id
        WHERE c.coffee_id = ANY(
          SELECT DISTINCT c2.coffee_id FROM coffee_directory_mv c2
          WHERE c2.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c2.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c2.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c2.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c2.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_bean_species IS NULL OR c2.bean_species = ANY(p_bean_species::species_enum[]))
            AND (p_roaster_ids IS NULL OR c2.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c2.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c2.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c2.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c2.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c2.flavor_keys @> p_flavor_keys)
            AND (p_region_ids IS NULL OR c2.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c2.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c2.brew_method_canonical_keys && selected_canon_keys)
        )
        AND csn.node_type = 'flavor'
        GROUP BY csn.id, csn.slug, csn.descriptor, csn.subcategory, csn.family
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'regions', (
      SELECT json_agg(json_build_object('id', sub.id, 'label', sub.display_name, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.display_name ASC)
      FROM (
        SELECT r.id, COALESCE(r.display_name, r.id::TEXT) AS display_name, COUNT(DISTINCT cr.coffee_id) AS coffee_count
        FROM coffee_regions cr
        JOIN regions r ON r.id = cr.region_id
        WHERE cr.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
            AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
            AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
            AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
            AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
        )
        GROUP BY r.id, r.display_name
        HAVING COUNT(DISTINCT cr.coffee_id) > 0
      ) sub
    ),
    'estates', (
      SELECT json_agg(json_build_object('id', sub.id, 'label', sub.name, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.name ASC)
      FROM (
        SELECT e.id, e.name, COUNT(DISTINCT ce.coffee_id) AS coffee_count
        FROM coffee_estates ce
        JOIN estates e ON e.id = ce.estate_id
        WHERE ce.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
            AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
            AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
            AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
            AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
            AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
        )
        GROUP BY e.id, e.name
        HAVING COUNT(DISTINCT ce.coffee_id) > 0
      ) sub
    ),
    'brewMethods', (
      SELECT json_agg(json_build_object('id', sub.canonical_key, 'label', sub.label, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.label ASC)
      FROM (
        SELECT bm.canonical_key, MAX(bm.canonical_label) AS label, COUNT(DISTINCT cbm.coffee_id) AS coffee_count
        FROM coffee_brew_methods cbm
        JOIN brew_methods bm ON bm.id = cbm.brew_method_id
        WHERE cbm.coffee_id = ANY(
          SELECT DISTINCT c.coffee_id FROM coffee_directory_mv c
          WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
            AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
            AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
            AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
            AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
            AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
        )
        AND bm.canonical_key IS NOT NULL AND bm.canonical_label IS NOT NULL
        GROUP BY bm.canonical_key
        HAVING COUNT(DISTINCT cbm.coffee_id) > 0
      ) sub
    ),
    'roasters', (
      SELECT json_agg(json_build_object('id', sub.id, 'label', sub.name, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.name ASC)
      FROM (
        SELECT r.id, r.name, COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        JOIN roasters r ON r.id = c.roaster_id
        WHERE c.coffee_id = ANY(
          SELECT DISTINCT c2.coffee_id FROM coffee_directory_mv c2
          WHERE c2.coffee_id = ANY(base_filtered_coffee_ids)
            AND (p_search_query IS NULL OR c2.name ILIKE '%' || p_search_query || '%')
            AND (p_roast_levels IS NULL OR c2.roast_level = ANY(p_roast_levels::roast_level_enum[]))
            AND (p_processes IS NULL OR c2.process = ANY(p_processes::process_enum[]))
            AND (p_statuses IS NULL OR c2.status = ANY(p_statuses::coffee_status_enum[]))
            AND (p_bean_species IS NULL OR c2.bean_species = ANY(p_bean_species::species_enum[]))
            AND (p_roaster_ids IS NULL OR c2.roaster_id = ANY(p_roaster_ids))
            AND (NOT p_in_stock_only OR c2.in_stock_count > 0)
            AND (NOT p_has_250g_only OR c2.has_250g_bool = TRUE)
            AND (p_min_price IS NULL OR c2.best_normalized_250g >= p_min_price)
            AND (p_max_price IS NULL OR c2.best_normalized_250g <= p_max_price)
            AND (p_flavor_keys IS NULL OR c2.flavor_keys @> p_flavor_keys)
            AND (p_canon_flavor_families IS NULL OR c2.canon_flavor_families && p_canon_flavor_families)
            AND (p_canon_flavor_subcategories IS NULL OR c2.canon_flavor_subcategories && p_canon_flavor_subcategories)
            AND (p_canon_flavor_node_ids IS NULL OR c2.canon_flavor_node_ids && p_canon_flavor_node_ids)
            AND (p_region_ids IS NULL OR c2.region_ids && p_region_ids)
            AND (p_estate_ids IS NULL OR c2.estate_ids && p_estate_ids)
            AND (selected_canon_keys IS NULL OR c2.brew_method_canonical_keys && selected_canon_keys)
        )
        AND c.roaster_id IS NOT NULL
        GROUP BY r.id, r.name
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'roastLevels', (
      SELECT json_agg(json_build_object('value', sub.roast_level, 'label', sub.label, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.roast_level ASC)
      FROM (
        SELECT c.roast_level,
          CASE c.roast_level WHEN 'light' THEN 'Light' WHEN 'light_medium' THEN 'Light Medium' WHEN 'medium' THEN 'Medium' WHEN 'medium_dark' THEN 'Medium Dark' WHEN 'dark' THEN 'Dark' ELSE c.roast_level::TEXT END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
          AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
          AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
          AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
          AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
          AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
          AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
          AND c.roast_level IS NOT NULL
        GROUP BY c.roast_level
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'processes', (
      SELECT json_agg(json_build_object('value', sub.process, 'label', sub.label, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.process ASC)
      FROM (
        SELECT c.process,
          CASE c.process WHEN 'washed' THEN 'Washed' WHEN 'natural' THEN 'Natural' WHEN 'honey' THEN 'Honey' WHEN 'pulped_natural' THEN 'Pulped Natural' WHEN 'monsooned' THEN 'Monsooned' WHEN 'wet_hulled' THEN 'Wet Hulled' WHEN 'anaerobic' THEN 'Anaerobic' WHEN 'carbonic_maceration' THEN 'Carbonic Maceration' WHEN 'double_fermented' THEN 'Double Fermented' WHEN 'experimental' THEN 'Experimental' WHEN 'other' THEN 'Other' WHEN 'washed_natural' THEN 'Washed Natural' ELSE c.process::TEXT END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_statuses IS NULL OR c.status = ANY(p_statuses::coffee_status_enum[]))
          AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
          AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
          AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
          AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
          AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
          AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
          AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
          AND c.process IS NOT NULL
        GROUP BY c.process
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'statuses', (
      SELECT json_agg(json_build_object('value', sub.status, 'label', sub.label, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.status ASC)
      FROM (
        SELECT c.status,
          CASE c.status WHEN 'active' THEN 'Active' WHEN 'seasonal' THEN 'Seasonal' WHEN 'discontinued' THEN 'Discontinued' WHEN 'draft' THEN 'Draft' WHEN 'hidden' THEN 'Hidden' WHEN 'coming_soon' THEN 'Coming Soon' WHEN 'archived' THEN 'Archived' ELSE c.status::TEXT END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND (p_search_query IS NULL OR c.name ILIKE '%' || p_search_query || '%')
          AND (p_roast_levels IS NULL OR c.roast_level = ANY(p_roast_levels::roast_level_enum[]))
          AND (p_processes IS NULL OR c.process = ANY(p_processes::process_enum[]))
          AND (p_bean_species IS NULL OR c.bean_species = ANY(p_bean_species::species_enum[]))
          AND (p_roaster_ids IS NULL OR c.roaster_id = ANY(p_roaster_ids))
          AND (NOT p_in_stock_only OR c.in_stock_count > 0)
          AND (NOT p_has_250g_only OR c.has_250g_bool = TRUE)
          AND (p_min_price IS NULL OR c.best_normalized_250g >= p_min_price)
          AND (p_max_price IS NULL OR c.best_normalized_250g <= p_max_price)
          AND (p_flavor_keys IS NULL OR c.flavor_keys @> p_flavor_keys)
          AND (p_canon_flavor_families IS NULL OR c.canon_flavor_families && p_canon_flavor_families)
          AND (p_canon_flavor_subcategories IS NULL OR c.canon_flavor_subcategories && p_canon_flavor_subcategories)
          AND (p_canon_flavor_node_ids IS NULL OR c.canon_flavor_node_ids && p_canon_flavor_node_ids)
          AND (p_region_ids IS NULL OR c.region_ids && p_region_ids)
          AND (p_estate_ids IS NULL OR c.estate_ids && p_estate_ids)
          AND (selected_canon_keys IS NULL OR c.brew_method_canonical_keys && selected_canon_keys)
          AND c.status IS NOT NULL
        GROUP BY c.status
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'species', (
      SELECT json_agg(json_build_object('value', sub.bean_species, 'label', sub.label, 'count', sub.coffee_count) ORDER BY sub.coffee_count DESC, sub.bean_species ASC)
      FROM (
        SELECT c.bean_species,
          CASE c.bean_species
            WHEN 'arabica' THEN 'Arabica'
            WHEN 'robusta' THEN 'Robusta'
            WHEN 'liberica' THEN 'Liberica'
            WHEN 'blend' THEN 'Blend'
            WHEN 'arabica_80_robusta_20' THEN '80% Arabica, 20% Robusta'
            WHEN 'arabica_70_robusta_30' THEN '70% Arabica, 30% Robusta'
            WHEN 'arabica_60_robusta_40' THEN '60% Arabica, 40% Robusta'
            WHEN 'arabica_50_robusta_50' THEN '50% Arabica, 50% Robusta'
            WHEN 'robusta_80_arabica_20' THEN '80% Robusta, 20% Arabica'
            WHEN 'arabica_chicory' THEN 'Arabica + Chicory'
            WHEN 'robusta_chicory' THEN 'Robusta + Chicory'
            WHEN 'blend_chicory' THEN 'Blend + Chicory'
            WHEN 'filter_coffee_mix' THEN 'Filter Coffee Mix'
            WHEN 'excelsa' THEN 'Excelsa'
            ELSE c.bean_species::TEXT
          END AS label,
          COUNT(DISTINCT c.coffee_id) AS coffee_count
        FROM coffee_directory_mv c
        WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
          AND c.bean_species IS NOT NULL
        GROUP BY c.bean_species
        HAVING COUNT(DISTINCT c.coffee_id) > 0
      ) sub
    ),
    'totals', (
      SELECT json_build_object(
        'coffees', COUNT(DISTINCT c.coffee_id),
        'roasters', (SELECT COUNT(DISTINCT id) FROM roasters WHERE is_active = TRUE)
      )
      FROM coffee_directory_mv c
      WHERE c.coffee_id = ANY(base_filtered_coffee_ids)
    )
  )
  INTO result;

  RETURN COALESCE(result, json_build_object(
    'flavorNotes', '[]'::json,
    'canonicalFlavors', '[]'::json,
    'regions', '[]'::json,
    'estates', '[]'::json,
    'brewMethods', '[]'::json,
    'roasters', '[]'::json,
    'roastLevels', '[]'::json,
    'processes', '[]'::json,
    'statuses', '[]'::json,
    'species', '[]'::json,
    'totals', json_build_object('coffees', 0, 'roasters', 0)
  ));
END;
$$;

COMMENT ON FUNCTION public.get_coffee_filter_meta IS
  'Returns filter metadata with counts for coffee directory filtering. Uses coffee_directory_mv. Includes p_bean_species filter and species counts.';
