-- Migration: harden search_directory against abusive direct calls
-- Description: search_directory is granted to anon/authenticated, so it can be
--              called directly (not just via the UI). Guard inside the function:
--                - trim q and short-circuit when it is blank or shorter than the
--                  UI minimum (2 chars), so a blank q can't turn '%q%' into a
--                  match-everything pattern and trigger a large scan;
--                - clamp lim to [1, 50] (default 25) so an unbounded limit can't.
--              Matching/escaping/result shape are otherwise identical to
--              20260701120000_search_directory_substring_match.sql.

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
      qq,
      char_length(qq) AS qlen,
      websearch_to_tsquery('simple', qq) AS tsq,
      '%' || esc || '%' AS like_pat,
      esc || '%' AS prefix_pat
    FROM (
      SELECT
        btrim(coalesce(q, '')) AS qq,
        -- Escape LIKE metacharacters so a stray % / _ can't broaden the match.
        replace(replace(replace(btrim(coalesce(q, '')), '\', '\\'), '%', '\%'), '_', '\_') AS esc
    ) s
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
      (m.name ILIKE p.prefix_pat)::int * 2
      + (m.name ILIKE p.like_pat)::int
      + ts_rank(m.search_vector, p.tsq)
      + similarity(m.name, p.qq) AS rank
    FROM coffee_directory_mv m, p
    WHERE p.qlen >= 2                              -- guard: blank/too-short q → no rows
      AND m.status IN ('active', 'seasonal')        -- PUBLIC_COFFEE_STATUSES
      AND (m.name ILIKE p.like_pat OR m.search_vector @@ p.tsq OR m.name % p.qq)

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
      + similarity(r.name, p.qq) AS rank
    FROM roasters r, p
    WHERE p.qlen >= 2                              -- guard: blank/too-short q → no rows
      AND r.is_active = true
      AND (r.name ILIKE p.like_pat OR r.search_vector @@ p.tsq OR r.name % p.qq)
  ) results
  ORDER BY rank DESC
  LIMIT LEAST(GREATEST(coalesce(lim, 25), 1), 50);  -- guard: clamp lim to [1, 50]
$$;

COMMENT ON FUNCTION search_directory(text, int) IS
  'Unified relevance-ranked search across coffees (coffee_directory_mv) and roasters. '
  'Substring (ILIKE) + prefix matching on name, FTS for multi-word relevance, pg_trgm '
  'for typo tolerance. Guards: ignores q shorter than 2 chars; clamps lim to [1,50]. '
  'Returns full SearchableItem jsonb rows.';

GRANT EXECUTE ON FUNCTION search_directory(text, int) TO anon, authenticated;
