-- Migration: search_directory substring + prefix matching
-- Description: Restores "contains" matching lost when moving from Fuse.js to FTS.
--              Typing "app" now surfaces names containing "app" anywhere
--              (e.g. "Apple of my Brew", "...Pineapple..."), with prefix matches
--              ranked first. FTS (websearch) is kept for multi-word relevance and
--              pg_trgm (`%`, similarity) for typo tolerance.
--              Function-only change — no MV/table/index changes, no CASCADE.

DROP FUNCTION IF EXISTS search_directory(text, int);

CREATE FUNCTION search_directory(q text, lim int DEFAULT 25)
RETURNS SETOF jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH p AS (
    SELECT
      websearch_to_tsquery('simple', coalesce(q, '')) AS tsq,
      -- Escape LIKE metacharacters so a stray % / _ can't match everything.
      '%' || replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_') || '%' AS like_pat,
            replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_') || '%' AS prefix_pat
  )
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
      (m.name ILIKE p.prefix_pat)::int * 2      -- prefix matches first
      + (m.name ILIKE p.like_pat)::int           -- then any substring
      + ts_rank(m.search_vector, p.tsq)          -- multi-word relevance
      + similarity(m.name, q) AS rank            -- typo closeness
    FROM coffee_directory_mv m, p
    WHERE m.status IN ('active', 'seasonal')      -- PUBLIC_COFFEE_STATUSES
      AND (m.name ILIKE p.like_pat OR m.search_vector @@ p.tsq OR m.name % q)

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
      (r.name ILIKE p.prefix_pat)::int * 2
      + (r.name ILIKE p.like_pat)::int
      + ts_rank(r.search_vector, p.tsq)
      + similarity(r.name, q) AS rank
    FROM roasters r, p
    WHERE r.is_active = true
      AND (r.name ILIKE p.like_pat OR r.search_vector @@ p.tsq OR r.name % q)
  ) results
  ORDER BY rank DESC
  LIMIT GREATEST(lim, 0);
$$;

COMMENT ON FUNCTION search_directory(text, int) IS
  'Unified relevance-ranked search across coffees (coffee_directory_mv) and roasters. '
  'Substring (ILIKE) + prefix matching on name, FTS (websearch_to_tsquery) for multi-word '
  'relevance, pg_trgm for typo tolerance. Returns full SearchableItem jsonb rows.';

GRANT EXECUTE ON FUNCTION search_directory(text, int) TO anon, authenticated;
