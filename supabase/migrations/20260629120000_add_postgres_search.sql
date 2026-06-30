-- Migration: Postgres full-text + trigram search for coffees and roasters
-- Description: Replaces the client-side Fuse.js search. Adds:
--                - pg_trgm extension (typo tolerance)
--                - roasters.search_vector (generated) + GIN/trigram indexes
--                - coffee_directory_mv recreated with flavor_labels + search_vector + indexes
--                  (verbatim from 20260613000000 with only those two additions)
--                - search_directory(q, lim) RPC returning full SearchableItem jsonb rows
--              Search vector recipe mirrors the old build-search-index.ts searchableText:
--                coffee = name + roaster name + roast_level_raw + roast_style_raw + process_raw + region names
--                roaster = name + hq_city + hq_state + hq_country
--              Config 'simple' (no stemming) — names are proper nouns / brands / places.

-- ============================================================================
-- 0. Extension
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- 1. roasters.search_vector (base table → generated stored column)
-- ============================================================================

ALTER TABLE roasters
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(name, '') || ' ' ||
      coalesce(hq_city, '') || ' ' ||
      coalesce(hq_state, '') || ' ' ||
      coalesce(hq_country, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_roasters_search_vector_gin
  ON roasters USING gin (search_vector);

CREATE INDEX IF NOT EXISTS idx_roasters_name_trgm
  ON roasters USING gin (name gin_trgm_ops);

-- ============================================================================
-- 2. Recreate coffee_directory_mv with flavor_labels + search_vector
--    (verbatim from 20260613000000_add_is_single_origin_to_coffee_directory_mv.sql
--     with two additions: junction_aggs.flavor_labels and the search_vector column)
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS coffee_directory_mv CASCADE;

CREATE MATERIALIZED VIEW coffee_directory_mv AS
WITH
  variant_aggs AS (
    SELECT
      v.coffee_id,
      MIN(CASE WHEN v.in_stock AND v.price_one_time IS NOT NULL THEN v.price_one_time END) AS min_price_in_stock,
      COALESCE(
        MIN(CASE WHEN v.in_stock AND v.valid_for_best_value THEN v.normalized_250g END),
        MIN(CASE WHEN v.in_stock AND v.normalized_250g IS NOT NULL THEN v.normalized_250g END)
      ) AS best_normalized_250g,
      COALESCE(
        (
          ARRAY_AGG(
            v.variant_id
            ORDER BY v.normalized_250g NULLS LAST, v.price_one_time NULLS LAST
          )
          FILTER (WHERE v.in_stock AND v.valid_for_best_value)
        )[1],
        (
          ARRAY_AGG(
            v.variant_id
            ORDER BY v.normalized_250g NULLS LAST, v.price_one_time NULLS LAST
          )
          FILTER (WHERE v.in_stock AND v.normalized_250g IS NOT NULL)
        )[1]
      ) AS best_variant_id,
      ARRAY_AGG(DISTINCT v.weight_g ORDER BY v.weight_g)
        FILTER (WHERE v.weight_g IS NOT NULL) AS weights_available,
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
      -- NEW: human flavor-note labels for search-result display (matches old searchableItem.flavorNotes)
      ARRAY_AGG(DISTINCT fn.label ORDER BY fn.label)
        FILTER (WHERE fn.label IS NOT NULL) AS flavor_labels,
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
  c.id AS coffee_id,
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
    jsonb_strip_nulls(jsonb_build_object(
      'acidity', s.acidity,
      'sweetness', s.sweetness,
      'body', s.body,
      'clarity', s.clarity,
      'aftertaste', s.aftertaste,
      'bitterness', s.bitterness
    ))
  ELSE NULL END AS sensory_public,
  c.decaf,
  c.is_limited,
  c.bean_species,
  c.is_single_origin,
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
  ja.flavor_labels,
  ja.canon_flavor_node_ids,
  ja.canon_flavor_slugs,
  ja.canon_flavor_descriptors,
  ja.canon_flavor_subcategories,
  ja.canon_flavor_families,
  ja.region_ids,
  ja.canon_region_names,
  ja.estate_ids,
  ja.canon_estate_names,
  ja.brew_method_canonical_keys,
  -- NEW: full-text search vector (mirrors old searchableText recipe; config 'simple')
  to_tsvector('simple',
    coalesce(c.name, '') || ' ' ||
    coalesce(r.name, '') || ' ' ||
    coalesce(c.roast_level_raw, '') || ' ' ||
    coalesce(c.roast_style_raw, '') || ' ' ||
    coalesce(c.process_raw, '') || ' ' ||
    coalesce(array_to_string(ja.canon_region_names, ' '), '')
  ) AS search_vector
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

CREATE INDEX idx_coffee_directory_mv_is_single_origin
  ON coffee_directory_mv USING btree (is_single_origin);

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

-- NEW: full-text + trigram indexes for search
CREATE INDEX idx_coffee_directory_mv_search_vector_gin
  ON coffee_directory_mv USING gin (search_vector);

CREATE INDEX idx_coffee_directory_mv_name_trgm
  ON coffee_directory_mv USING gin (name gin_trgm_ops);

-- Recreate refresh helper. IMPORTANT: keep the IndexNow notification body from
-- 20260624124647_indexnow_on_mv_refresh.sql verbatim — do NOT regress to the plain version.
CREATE OR REPLACE FUNCTION public.refresh_coffee_directory_mv()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_endpoint text;
  v_secret   text;
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY coffee_directory_mv;

  -- Notify IndexNow of changed URLs. Wrapped so a missing Vault secret or a
  -- pg_net hiccup can never break the refresh.
  BEGIN
    SELECT decrypted_secret INTO v_endpoint
      FROM vault.decrypted_secrets WHERE name = 'indexnow_endpoint';
    SELECT decrypted_secret INTO v_secret
      FROM vault.decrypted_secrets WHERE name = 'indexnow_secret';

    IF v_endpoint IS NOT NULL AND v_secret IS NOT NULL THEN
      PERFORM net.http_post(
        url     := v_endpoint,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_secret
        ),
        body    := '{}'::jsonb
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'IndexNow notification skipped: %', SQLERRM;
  END;
END;
$function$;

-- ============================================================================
-- 3. search_directory(q, lim) — unified ranked search across coffees + roasters
--    Each row is a full SearchableItem jsonb (zero client-side mapping).
-- ============================================================================

CREATE OR REPLACE FUNCTION search_directory(q text, lim int DEFAULT 25)
RETURNS SETOF jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH tsq AS (SELECT websearch_to_tsquery('simple', coalesce(q, '')) AS query)
  SELECT item FROM (
    -- Coffees
    SELECT
      jsonb_strip_nulls(jsonb_build_object(
        'id', m.coffee_id,
        'type', 'coffee',
        'title', m.name,
        'description', concat_ws(' • ',
          m.roaster_name,
          nullif(coalesce(m.roast_level_raw, m.roast_level::text, ''), ''),
          nullif(coalesce(m.process_raw, m.process::text, ''), '')
        ),
        'url', '/roasters/' || m.roaster_slug || '/coffees/' || m.slug,
        'imageUrl', m.image_url,
        'flavorNotes', CASE WHEN array_length(m.flavor_labels, 1) > 0
                            THEN to_jsonb(m.flavor_labels) ELSE NULL END,
        'tags', (
          SELECT coalesce(jsonb_agg(t), '[]'::jsonb)
          FROM unnest(
            ARRAY[m.roast_level_raw, m.roast_style_raw, m.process_raw]
            || coalesce(m.canon_region_names, ARRAY[]::text[])
          ) AS t
          WHERE t IS NOT NULL AND t <> ''
        ),
        'metadata', jsonb_build_object('coffee', jsonb_strip_nulls(jsonb_build_object(
          'roasterName', m.roaster_name,
          'region', nullif(array_to_string(m.canon_region_names, ', '), ''),
          'price', m.min_price_in_stock,
          'bestNormalized250g', m.best_normalized_250g,
          'rating', m.rating_avg,
          'roastLevel', m.roast_level_raw,
          'process', m.process_raw
        )))
      )) AS item,
      ts_rank(m.search_vector, t.query) + similarity(m.name, q) AS rank
    FROM coffee_directory_mv m, tsq t
    WHERE m.status IN ('active', 'seasonal')           -- PUBLIC_COFFEE_STATUSES
      AND (m.search_vector @@ t.query OR m.name % q)

    UNION ALL

    -- Roasters
    SELECT
      jsonb_strip_nulls(jsonb_build_object(
        'id', r.id,
        'type', 'roaster',
        'title', r.name,
        'description', coalesce(
          nullif(concat_ws(', ', r.hq_city, r.hq_state, r.hq_country), ''),
          'Roaster'
        ),
        'url', '/roasters/' || r.slug,
        'imageUrl', coalesce(r.logo_url, r.image_url),
        'tags', (
          SELECT coalesce(jsonb_agg(t), '[]'::jsonb)
          FROM unnest(ARRAY[r.hq_city, r.hq_state, r.hq_country]) AS t
          WHERE t IS NOT NULL AND t <> ''
        ),
        'metadata', jsonb_build_object('roaster', jsonb_strip_nulls(jsonb_build_object(
          'region', nullif(concat_ws(', ', r.hq_city, r.hq_state, r.hq_country), ''),
          'coffeeCount', (SELECT count(*) FROM coffees co WHERE co.roaster_id = r.id)
        )))
      )) AS item,
      ts_rank(r.search_vector, t.query) + similarity(r.name, q) AS rank
    FROM roasters r, tsq t
    WHERE r.is_active = true
      AND (r.search_vector @@ t.query OR r.name % q)
  ) results
  ORDER BY rank DESC
  LIMIT GREATEST(lim, 0);
$$;

COMMENT ON FUNCTION search_directory(text, int) IS
  'Unified relevance-ranked search across coffees (coffee_directory_mv) and roasters. '
  'Returns full SearchableItem jsonb rows. FTS (websearch_to_tsquery) + pg_trgm typo tolerance.';

GRANT EXECUTE ON FUNCTION search_directory(text, int) TO anon, authenticated;
