-- Migration: Recreate refresh_user_taste_profile_cache with numeric ROUND fix
-- Created: 2026-04-14
-- Description:
--   Drops and recreates public.refresh_user_taste_profile_cache(UUID) to fix
--   ROUND(double precision, integer) runtime failures by forcing numeric math
--   in score_calc (orientation/confidence scoring paths).

DROP FUNCTION IF EXISTS public.refresh_user_taste_profile_cache(UUID);

CREATE OR REPLACE FUNCTION public.refresh_user_taste_profile_cache(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NOT NULL AND v_caller_id IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only refresh your own taste profile cache'
      USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.user_taste_profile_cache (
    user_id,
    top_roast_levels,
    top_brew_methods,
    top_flavor_note_ids,
    top_roaster_ids,
    top_region_names,
    top_processes,
    top_species,
    avg_rating,
    recommend_rate,
    single_origin_pct,
    distinct_roaster_count,
    rating_distribution,
    roast_pref_json,
    process_pref_json,
    species_pref_json,
    flavor_family_pref_json,
    flavor_subcategory_pref_json,
    brew_pref_json,
    distinct_region_count,
    distinct_process_count,
    distinct_roast_count,
    distinct_brew_method_count,
    breadth_score,
    selectivity_score,
    orientation_score,
    confidence_score,
    concentration_score,
    total_reviews,
    last_computed_at,
    review_count_at_compute
  )
  WITH base_reviews AS (
    SELECT
      r.id AS review_id,
      r.entity_id AS coffee_id,
      r.rating::NUMERIC AS rating,
      COALESCE(r.recommend, false) AS recommend,
      r.brew_method::TEXT AS review_brew_method,
      mv.roast_level::TEXT AS roast_level,
      mv.process::TEXT AS process,
      mv.bean_species::TEXT AS species,
      mv.roaster_id,
      COALESCE(mv.canon_region_names, ARRAY[]::TEXT[]) AS canon_region_names,
      COALESCE(mv.canon_flavor_node_ids::UUID[], ARRAY[]::UUID[]) AS canon_flavor_node_ids,
      COALESCE(mv.canon_flavor_families, ARRAY[]::TEXT[]) AS canon_flavor_families,
      COALESCE(mv.canon_flavor_subcategories, ARRAY[]::TEXT[]) AS canon_flavor_subcategories,
      COALESCE(co.is_single_origin, false) AS is_single_origin,
      GREATEST(0::NUMERIC, COALESCE(r.rating, 0)::NUMERIC - 3.5)
        + CASE WHEN r.recommend IS TRUE THEN 0.75 ELSE 0 END AS positive_weight
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv
      ON mv.coffee_id = r.entity_id
    JOIN public.coffees co
      ON co.id = r.entity_id
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND r.entity_id IS NOT NULL
  ),
  stats AS (
    SELECT
      COUNT(*)::INT AS total_reviews,
      COUNT(*) FILTER (WHERE rating IS NOT NULL)::INT AS rated_reviews,
      COALESCE(SUM(positive_weight), 0)::NUMERIC AS total_positive_weight,
      ROUND(AVG(rating)::NUMERIC, 2) AS avg_rating,
      ROUND((COUNT(*) FILTER (WHERE recommend)::NUMERIC / NULLIF(COUNT(*), 0)), 4) AS recommend_rate,
      ROUND((COUNT(*) FILTER (WHERE is_single_origin)::NUMERIC / NULLIF(COUNT(*), 0)), 4) AS single_origin_pct,
      COUNT(DISTINCT roaster_id)::INT AS distinct_roaster_count,
      COALESCE(STDDEV_POP(rating), 0)::NUMERIC AS rating_stddev,
      AVG(rating) FILTER (WHERE recommend)::NUMERIC AS avg_recommended_rating,
      (
        COUNT(*) FILTER (WHERE rating <= 3)::NUMERIC
        / NULLIF(COUNT(*) FILTER (WHERE rating IS NOT NULL), 0)
      ) AS low_rating_share
    FROM base_reviews
  ),
  rating_distribution AS (
    SELECT COALESCE(jsonb_object_agg(star::TEXT, cnt ORDER BY star), '{}'::JSONB) AS value
    FROM (
      SELECT
        gs.star,
        COALESCE(rating_counts.cnt, 0) AS cnt
      FROM generate_series(1, 5) AS gs(star)
      LEFT JOIN (
        SELECT ROUND(rating)::INT AS star, COUNT(*)::INT AS cnt
        FROM base_reviews
        WHERE rating IS NOT NULL
        GROUP BY ROUND(rating)::INT
      ) rating_counts
        ON rating_counts.star = gs.star
    ) dist
  ),
  pos_reviews AS (
    SELECT *
    FROM base_reviews
    WHERE positive_weight > 0
  ),
  rated_reviews_base AS (
    SELECT *
    FROM base_reviews
    WHERE rating IS NOT NULL
  ),
  roast_scores AS (
    SELECT roast_level AS key, SUM(positive_weight) AS score
    FROM pos_reviews
    WHERE roast_level IS NOT NULL
    GROUP BY roast_level
  ),
  process_scores AS (
    SELECT process AS key, SUM(positive_weight) AS score
    FROM pos_reviews
    WHERE process IS NOT NULL
    GROUP BY process
  ),
  species_scores AS (
    SELECT species AS key, SUM(positive_weight) AS score
    FROM pos_reviews
    WHERE species IS NOT NULL
    GROUP BY species
  ),
  brew_scores AS (
    SELECT review_brew_method AS key, SUM(positive_weight) AS score
    FROM pos_reviews
    WHERE review_brew_method IS NOT NULL
    GROUP BY review_brew_method
  ),
  roaster_scores AS (
    SELECT roaster_id AS key, SUM(positive_weight) AS score
    FROM pos_reviews
    WHERE roaster_id IS NOT NULL
    GROUP BY roaster_id
  ),
  region_scores AS (
    SELECT
      region_name AS key,
      SUM(positive_weight / GREATEST(CARDINALITY(canon_region_names), 1)::NUMERIC) AS score
    FROM pos_reviews
    CROSS JOIN LATERAL UNNEST(canon_region_names) AS region(region_name)
    WHERE NULLIF(BTRIM(region_name), '') IS NOT NULL
    GROUP BY region_name
  ),
  flavor_note_scores AS (
    SELECT
      node_id AS key,
      SUM(positive_weight / GREATEST(CARDINALITY(canon_flavor_node_ids), 1)::NUMERIC) AS score
    FROM pos_reviews
    CROSS JOIN LATERAL UNNEST(canon_flavor_node_ids) AS node(node_id)
    WHERE node_id IS NOT NULL
    GROUP BY node_id
  ),
  flavor_family_scores AS (
    SELECT
      LOWER(REGEXP_REPLACE(BTRIM(family_name), '[^a-zA-Z0-9]+', '_', 'g')) AS key,
      SUM(positive_weight / GREATEST(CARDINALITY(canon_flavor_families), 1)::NUMERIC) AS score
    FROM pos_reviews
    CROSS JOIN LATERAL UNNEST(canon_flavor_families) AS family(family_name)
    WHERE NULLIF(BTRIM(family_name), '') IS NOT NULL
    GROUP BY LOWER(REGEXP_REPLACE(BTRIM(family_name), '[^a-zA-Z0-9]+', '_', 'g'))
  ),
  flavor_subcategory_scores AS (
    SELECT
      LOWER(REGEXP_REPLACE(BTRIM(subcategory_name), '[^a-zA-Z0-9]+', '_', 'g')) AS key,
      SUM(positive_weight / GREATEST(CARDINALITY(canon_flavor_subcategories), 1)::NUMERIC) AS score
    FROM pos_reviews
    CROSS JOIN LATERAL UNNEST(canon_flavor_subcategories) AS subcategory(subcategory_name)
    WHERE NULLIF(BTRIM(subcategory_name), '') IS NOT NULL
    GROUP BY LOWER(REGEXP_REPLACE(BTRIM(subcategory_name), '[^a-zA-Z0-9]+', '_', 'g'))
  ),
  roast_pref AS (
    SELECT
      COALESCE(jsonb_object_agg(key, share ORDER BY score DESC, key), '{}'::JSONB) AS value,
      COALESCE(MAX(share), 0)::NUMERIC AS max_share
    FROM (
      SELECT
        key,
        score,
        ROUND((score / NULLIF(SUM(score) OVER (), 0))::NUMERIC, 4) AS share
      FROM roast_scores
    ) s
  ),
  process_pref AS (
    SELECT
      COALESCE(jsonb_object_agg(key, share ORDER BY score DESC, key), '{}'::JSONB) AS value,
      COALESCE(MAX(share), 0)::NUMERIC AS max_share
    FROM (
      SELECT
        key,
        score,
        ROUND((score / NULLIF(SUM(score) OVER (), 0))::NUMERIC, 4) AS share
      FROM process_scores
    ) s
  ),
  species_pref AS (
    SELECT COALESCE(jsonb_object_agg(key, share ORDER BY score DESC, key), '{}'::JSONB) AS value
    FROM (
      SELECT
        key,
        score,
        ROUND((score / NULLIF(SUM(score) OVER (), 0))::NUMERIC, 4) AS share
      FROM species_scores
    ) s
  ),
  brew_pref AS (
    SELECT
      COALESCE(jsonb_object_agg(key, share ORDER BY score DESC, key), '{}'::JSONB) AS value,
      COALESCE(MAX(share), 0)::NUMERIC AS max_share
    FROM (
      SELECT
        key,
        score,
        ROUND((score / NULLIF(SUM(score) OVER (), 0))::NUMERIC, 4) AS share
      FROM brew_scores
    ) s
  ),
  flavor_family_pref AS (
    SELECT
      COALESCE(jsonb_object_agg(key, share ORDER BY score DESC, key), '{}'::JSONB) AS value,
      COALESCE(MAX(share), 0)::NUMERIC AS max_share
    FROM (
      SELECT
        key,
        score,
        ROUND((score / NULLIF(SUM(score) OVER (), 0))::NUMERIC, 4) AS share
      FROM flavor_family_scores
    ) s
  ),
  flavor_subcategory_pref AS (
    SELECT COALESCE(jsonb_object_agg(key, share ORDER BY score DESC, key), '{}'::JSONB) AS value
    FROM (
      SELECT
        key,
        score,
        ROUND((score / NULLIF(SUM(score) OVER (), 0))::NUMERIC, 4) AS share
      FROM flavor_subcategory_scores
    ) s
  ),
  explore_roaster_scores AS (
    SELECT roaster_id AS key, COUNT(*)::NUMERIC AS score
    FROM rated_reviews_base
    WHERE roaster_id IS NOT NULL
    GROUP BY roaster_id
  ),
  explore_region_scores AS (
    SELECT
      region_name AS key,
      SUM(1::NUMERIC / GREATEST(CARDINALITY(canon_region_names), 1)::NUMERIC) AS score
    FROM rated_reviews_base
    CROSS JOIN LATERAL UNNEST(canon_region_names) AS region(region_name)
    WHERE NULLIF(BTRIM(region_name), '') IS NOT NULL
    GROUP BY region_name
  ),
  explore_process_scores AS (
    SELECT process AS key, COUNT(*)::NUMERIC AS score
    FROM rated_reviews_base
    WHERE process IS NOT NULL
    GROUP BY process
  ),
  explore_roast_scores AS (
    SELECT roast_level AS key, COUNT(*)::NUMERIC AS score
    FROM rated_reviews_base
    WHERE roast_level IS NOT NULL
    GROUP BY roast_level
  ),
  explore_brew_scores AS (
    SELECT review_brew_method AS key, COUNT(*)::NUMERIC AS score
    FROM rated_reviews_base
    WHERE review_brew_method IS NOT NULL
    GROUP BY review_brew_method
  ),
  axis_coverage AS (
    SELECT ROUND(
      (
        (CASE WHEN EXISTS (SELECT 1 FROM roast_scores) THEN 1 ELSE 0 END)
        + (CASE WHEN EXISTS (SELECT 1 FROM process_scores) THEN 1 ELSE 0 END)
        + (CASE WHEN EXISTS (SELECT 1 FROM flavor_family_scores) THEN 1 ELSE 0 END)
        + (CASE WHEN EXISTS (SELECT 1 FROM brew_scores) THEN 1 ELSE 0 END)
      )::NUMERIC / 4,
      4
    ) AS value
  ),
  top_roasts AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::TEXT[]) AS value
    FROM (
      SELECT key, score
      FROM roast_scores
      ORDER BY score DESC, key
      LIMIT 5
    ) ranked
  ),
  top_brews AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::TEXT[]) AS value
    FROM (
      SELECT key, score
      FROM brew_scores
      ORDER BY score DESC, key
      LIMIT 5
    ) ranked
  ),
  top_flavor_notes AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::UUID[]) AS value
    FROM (
      SELECT key, score
      FROM flavor_note_scores
      ORDER BY score DESC, key
      LIMIT 10
    ) ranked
  ),
  top_roasters AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::UUID[]) AS value
    FROM (
      SELECT key, score
      FROM roaster_scores
      ORDER BY score DESC, key
      LIMIT 5
    ) ranked
  ),
  top_regions AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::TEXT[]) AS value
    FROM (
      SELECT key, score
      FROM region_scores
      ORDER BY score DESC, key
      LIMIT 5
    ) ranked
  ),
  top_processes AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::TEXT[]) AS value
    FROM (
      SELECT key, score
      FROM process_scores
      ORDER BY score DESC, key
      LIMIT 5
    ) ranked
  ),
  top_species AS (
    SELECT COALESCE(ARRAY_AGG(key ORDER BY score DESC, key), ARRAY[]::TEXT[]) AS value
    FROM (
      SELECT key, score
      FROM species_scores
      ORDER BY score DESC, key
      LIMIT 3
    ) ranked
  ),
  distinct_counts AS (
    SELECT
      (
        SELECT COUNT(DISTINCT region_name)::INT
        FROM (
          SELECT region_name
          FROM base_reviews br
          CROSS JOIN LATERAL UNNEST(br.canon_region_names) AS region(region_name)
          WHERE NULLIF(BTRIM(region_name), '') IS NOT NULL
        ) regions
      ) AS distinct_region_count,
      (SELECT COUNT(DISTINCT process)::INT FROM base_reviews WHERE process IS NOT NULL) AS distinct_process_count,
      (SELECT COUNT(DISTINCT roast_level)::INT FROM base_reviews WHERE roast_level IS NOT NULL) AS distinct_roast_count,
      (
        SELECT COUNT(DISTINCT review_brew_method)::INT
        FROM base_reviews
        WHERE review_brew_method IS NOT NULL
      ) AS distinct_brew_method_count
  ),
  roaster_entropy AS (
    SELECT COALESCE(
      CASE
        WHEN COUNT(*) > 1 AND MAX(total_score) > 0 THEN ROUND(((-SUM((score / total_score) * LN(score / total_score)) / LN(COUNT(*)::NUMERIC)))::NUMERIC, 4)
        ELSE 0::NUMERIC
      END,
      0::NUMERIC
    ) AS value
    FROM (
      SELECT score, SUM(score) OVER () AS total_score
      FROM explore_roaster_scores
    ) e
  ),
  region_entropy AS (
    SELECT COALESCE(
      CASE
        WHEN COUNT(*) > 1 AND MAX(total_score) > 0 THEN ROUND(((-SUM((score / total_score) * LN(score / total_score)) / LN(COUNT(*)::NUMERIC)))::NUMERIC, 4)
        ELSE 0::NUMERIC
      END,
      0::NUMERIC
    ) AS value
    FROM (
      SELECT score, SUM(score) OVER () AS total_score
      FROM explore_region_scores
    ) e
  ),
  process_entropy AS (
    SELECT COALESCE(
      CASE
        WHEN COUNT(*) > 1 AND MAX(total_score) > 0 THEN ROUND(((-SUM((score / total_score) * LN(score / total_score)) / LN(COUNT(*)::NUMERIC)))::NUMERIC, 4)
        ELSE 0::NUMERIC
      END,
      0::NUMERIC
    ) AS value
    FROM (
      SELECT score, SUM(score) OVER () AS total_score
      FROM explore_process_scores
    ) e
  ),
  roast_entropy AS (
    SELECT COALESCE(
      CASE
        WHEN COUNT(*) > 1 AND MAX(total_score) > 0 THEN ROUND(((-SUM((score / total_score) * LN(score / total_score)) / LN(COUNT(*)::NUMERIC)))::NUMERIC, 4)
        ELSE 0::NUMERIC
      END,
      0::NUMERIC
    ) AS value
    FROM (
      SELECT score, SUM(score) OVER () AS total_score
      FROM explore_roast_scores
    ) e
  ),
  brew_entropy AS (
    SELECT COALESCE(
      CASE
        WHEN COUNT(*) > 1 AND MAX(total_score) > 0 THEN ROUND(((-SUM((score / total_score) * LN(score / total_score)) / LN(COUNT(*)::NUMERIC)))::NUMERIC, 4)
        ELSE 0::NUMERIC
      END,
      0::NUMERIC
    ) AS value
    FROM (
      SELECT score, SUM(score) OVER () AS total_score
      FROM explore_brew_scores
    ) e
  ),
  concentration_calc AS (
    SELECT ROUND(
      (
        COALESCE(CASE WHEN rp.max_share > 0 THEN rp.max_share END, 0)
        + COALESCE(CASE WHEN pp.max_share > 0 THEN pp.max_share END, 0)
        + COALESCE(CASE WHEN ffp.max_share > 0 THEN ffp.max_share END, 0)
        + COALESCE(CASE WHEN bp.max_share > 0 THEN bp.max_share END, 0)
      )
      / NULLIF(
        (CASE WHEN rp.max_share > 0 THEN 1 ELSE 0 END)
        + (CASE WHEN pp.max_share > 0 THEN 1 ELSE 0 END)
        + (CASE WHEN ffp.max_share > 0 THEN 1 ELSE 0 END)
        + (CASE WHEN bp.max_share > 0 THEN 1 ELSE 0 END),
        0
      ),
      4
    ) AS value
    FROM roast_pref rp
    CROSS JOIN process_pref pp
    CROSS JOIN flavor_family_pref ffp
    CROSS JOIN brew_pref bp
  ),
  orientation_signals AS (
    SELECT
      (
        COALESCE((rp.value ->> 'light')::NUMERIC, 0) * 0.90
        + COALESCE((rp.value ->> 'light_medium')::NUMERIC, 0) * 0.55
        + COALESCE((ffp.value ->> 'floral')::NUMERIC, 0) * 0.60
        + COALESCE((ffp.value ->> 'fruity')::NUMERIC, 0) * 0.55
        + COALESCE((fsp.value ->> 'citrus')::NUMERIC, 0) * 0.90
        + COALESCE((fsp.value ->> 'citrus_floral')::NUMERIC, 0) * 0.80
        + COALESCE((fsp.value ->> 'berries')::NUMERIC, 0) * 0.80
        + COALESCE((fsp.value ->> 'stone_fruit')::NUMERIC, 0) * 0.70
        + COALESCE((fsp.value ->> 'tropical_fruit')::NUMERIC, 0) * 0.65
        + COALESCE((fsp.value ->> 'tropical')::NUMERIC, 0) * 0.50
        + COALESCE((fsp.value ->> 'light_floral')::NUMERIC, 0) * 0.60
        + COALESCE((pp.value ->> 'anaerobic')::NUMERIC, 0) * 0.25
        + COALESCE((pp.value ->> 'carbonic_maceration')::NUMERIC, 0) * 0.30
        + COALESCE((pp.value ->> 'double_fermented')::NUMERIC, 0) * 0.22
        + COALESCE((pp.value ->> 'experimental')::NUMERIC, 0) * 0.30
        + COALESCE((pp.value ->> 'washed_natural')::NUMERIC, 0) * 0.18
      ) AS bright_signal,
      (
        COALESCE((rp.value ->> 'medium')::NUMERIC, 0) * 0.20
        + COALESCE((rp.value ->> 'medium_dark')::NUMERIC, 0) * 0.60
        + COALESCE((rp.value ->> 'dark')::NUMERIC, 0) * 1.00
        + COALESCE((ffp.value ->> 'chocolatey_cocoa')::NUMERIC, 0) * 0.75
        + COALESCE((ffp.value ->> 'nutty')::NUMERIC, 0) * 0.70
        + COALESCE((ffp.value ->> 'caramelized_brown_sugar')::NUMERIC, 0) * 0.70
        + COALESCE((ffp.value ->> 'spice')::NUMERIC, 0) * 0.50
        + COALESCE((ffp.value ->> 'roasted_smoky')::NUMERIC, 0) * 0.45
        + COALESCE((ffp.value ->> 'sweet')::NUMERIC, 0) * 0.35
        + COALESCE((fsp.value ->> 'chocolate')::NUMERIC, 0) * 0.80
        + COALESCE((fsp.value ->> 'cocoa')::NUMERIC, 0) * 0.75
        + COALESCE((fsp.value ->> 'nuts')::NUMERIC, 0) * 0.70
        + COALESCE((fsp.value ->> 'caramel')::NUMERIC, 0) * 0.65
        + COALESCE((fsp.value ->> 'jaggery')::NUMERIC, 0) * 0.55
        + COALESCE((fsp.value ->> 'molasses')::NUMERIC, 0) * 0.55
        + COALESCE((fsp.value ->> 'toffee_butterscotch')::NUMERIC, 0) * 0.55
        + COALESCE((fsp.value ->> 'warm_spice')::NUMERIC, 0) * 0.45
        + COALESCE((fsp.value ->> 'sweet_spice')::NUMERIC, 0) * 0.45
        + COALESCE((fsp.value ->> 'syrupy')::NUMERIC, 0) * 0.35
        + COALESCE((pp.value ->> 'washed')::NUMERIC, 0) * 0.15
        + COALESCE((pp.value ->> 'monsooned')::NUMERIC, 0) * 0.22
        + COALESCE((pp.value ->> 'wet_hulled')::NUMERIC, 0) * 0.20
      ) AS comfort_signal
    FROM roast_pref rp
    CROSS JOIN process_pref pp
    CROSS JOIN flavor_family_pref ffp
    CROSS JOIN flavor_subcategory_pref fsp
  ),
  score_calc AS (
    SELECT
      ROUND((((re.value * 0.30 + rie.value * 0.20 + pe.value * 0.20 + roe.value * 0.15 + be.value * 0.15) * LEAST(1::NUMERIC, SQRT(COALESCE(s.total_reviews, 0)::NUMERIC / 12.0)))::NUMERIC), 4) AS breadth_score,
      CASE
        WHEN COALESCE(s.rated_reviews, 0) = 0 THEN NULL
        ELSE ROUND(
          LEAST(
            1::NUMERIC,
            GREATEST(
              0::NUMERIC,
              (
                COALESCE(1 - s.recommend_rate, 0) * 0.45
                + LEAST(COALESCE(s.rating_stddev, 0) / 1.50, 1) * 0.25
                + COALESCE(s.low_rating_share, 0) * 0.20
                + LEAST(GREATEST(COALESCE(s.avg_recommended_rating - s.avg_rating, 0), 0) / 1.50, 1) * 0.10
              )
            )
          ),
          4
        )
      END AS selectivity_score,
      CASE
        WHEN (os.bright_signal + os.comfort_signal) > 0 THEN ROUND(
          LEAST(
            1::NUMERIC,
            GREATEST(
              0::NUMERIC,
              0.5::NUMERIC + ((os.bright_signal - os.comfort_signal) / ((os.bright_signal + os.comfort_signal) * 2))
            )
          ),
          4
        )
        ELSE ROUND(0.5::NUMERIC, 4)
      END AS orientation_score,
      ROUND(
        LEAST(
          1::NUMERIC,
          GREATEST(
            0::NUMERIC,
            (
              LEAST((LN((1 + COALESCE(s.rated_reviews, 0))::NUMERIC) / LN(13::NUMERIC))::NUMERIC, 1::NUMERIC) * 0.55
              + LEAST(COALESCE(s.total_positive_weight, 0) / 10.0, 1) * 0.30
              + COALESCE(ac.value, 0) * 0.15
            )
          )
        ),
        4
      ) AS confidence_score,
      COALESCE(cc.value, 0) AS concentration_score
    FROM stats s
    CROSS JOIN roaster_entropy re
    CROSS JOIN region_entropy rie
    CROSS JOIN process_entropy pe
    CROSS JOIN roast_entropy roe
    CROSS JOIN brew_entropy be
    CROSS JOIN axis_coverage ac
    CROSS JOIN concentration_calc cc
    CROSS JOIN orientation_signals os
  )
  SELECT
    p_user_id,
    tr.value,
    tb.value,
    tfn.value,
    tro.value,
    treg.value,
    tp.value,
    ts.value,
    s.avg_rating,
    s.recommend_rate,
    s.single_origin_pct,
    COALESCE(s.distinct_roaster_count, 0),
    rd.value,
    COALESCE(rp.value, '{}'::JSONB),
    COALESCE(pp.value, '{}'::JSONB),
    COALESCE(sp.value, '{}'::JSONB),
    COALESCE(ffp.value, '{}'::JSONB),
    COALESCE(fsp.value, '{}'::JSONB),
    COALESCE(bp.value, '{}'::JSONB),
    COALESCE(dc.distinct_region_count, 0),
    COALESCE(dc.distinct_process_count, 0),
    COALESCE(dc.distinct_roast_count, 0),
    COALESCE(dc.distinct_brew_method_count, 0),
    sc.breadth_score,
    sc.selectivity_score,
    sc.orientation_score,
    sc.confidence_score,
    sc.concentration_score,
    COALESCE(s.total_reviews, 0),
    NOW(),
    COALESCE(s.total_reviews, 0)
  FROM stats s
  CROSS JOIN rating_distribution rd
  CROSS JOIN roast_pref rp
  CROSS JOIN process_pref pp
  CROSS JOIN species_pref sp
  CROSS JOIN flavor_family_pref ffp
  CROSS JOIN flavor_subcategory_pref fsp
  CROSS JOIN brew_pref bp
  CROSS JOIN top_roasts tr
  CROSS JOIN top_brews tb
  CROSS JOIN top_flavor_notes tfn
  CROSS JOIN top_roasters tro
  CROSS JOIN top_regions treg
  CROSS JOIN top_processes tp
  CROSS JOIN top_species ts
  CROSS JOIN distinct_counts dc
  CROSS JOIN score_calc sc
  ON CONFLICT (user_id) DO UPDATE SET
    top_roast_levels = EXCLUDED.top_roast_levels,
    top_brew_methods = EXCLUDED.top_brew_methods,
    top_flavor_note_ids = EXCLUDED.top_flavor_note_ids,
    top_roaster_ids = EXCLUDED.top_roaster_ids,
    top_region_names = EXCLUDED.top_region_names,
    top_processes = EXCLUDED.top_processes,
    top_species = EXCLUDED.top_species,
    avg_rating = EXCLUDED.avg_rating,
    recommend_rate = EXCLUDED.recommend_rate,
    single_origin_pct = EXCLUDED.single_origin_pct,
    distinct_roaster_count = EXCLUDED.distinct_roaster_count,
    rating_distribution = EXCLUDED.rating_distribution,
    roast_pref_json = EXCLUDED.roast_pref_json,
    process_pref_json = EXCLUDED.process_pref_json,
    species_pref_json = EXCLUDED.species_pref_json,
    flavor_family_pref_json = EXCLUDED.flavor_family_pref_json,
    flavor_subcategory_pref_json = EXCLUDED.flavor_subcategory_pref_json,
    brew_pref_json = EXCLUDED.brew_pref_json,
    distinct_region_count = EXCLUDED.distinct_region_count,
    distinct_process_count = EXCLUDED.distinct_process_count,
    distinct_roast_count = EXCLUDED.distinct_roast_count,
    distinct_brew_method_count = EXCLUDED.distinct_brew_method_count,
    breadth_score = EXCLUDED.breadth_score,
    selectivity_score = EXCLUDED.selectivity_score,
    orientation_score = EXCLUDED.orientation_score,
    confidence_score = EXCLUDED.confidence_score,
    concentration_score = EXCLUDED.concentration_score,
    total_reviews = EXCLUDED.total_reviews,
    last_computed_at = EXCLUDED.last_computed_at,
    review_count_at_compute = EXCLUDED.review_count_at_compute,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.refresh_user_taste_profile_cache IS
'Refreshes the user taste profile cache from latest coffee reviews using weighted positive preference. Produces normalized (not smoothed) roast/process/species/flavor/brew distributions, preference-ranked top arrays, exploration breadth from all rated reviews, and preserves the owner-only refresh security pattern.';
