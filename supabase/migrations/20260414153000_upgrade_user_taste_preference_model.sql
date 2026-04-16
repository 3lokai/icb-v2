-- Migration: Upgrade user taste profile cache to weighted preference model
-- Created: 2026-04-14
-- Description:
--   1. Extends public.user_taste_profile_cache with weighted preference JSON,
--      breadth counts, and interpretable derived scores.
--   2. Rewrites public.refresh_user_taste_profile_cache(p_user_id) to compute
--      positive-preference weighted distributions from latest reviews using
--      public.coffee_directory_mv as the main metadata source.
--   3. Rewrites public.get_user_profile_full(...) so taste_profile returns the
--      new preference distributions and scores while preserving current fields
--      such as top_flavor_labels and top_roasters.
--   4. Defers bucket assignment columns for now. The weighted profile needs
--      production validation before opinionated bucket keys are persisted.

-- ============================================================================
-- STEP 1: Extend user_taste_profile_cache
-- ============================================================================

ALTER TABLE public.user_taste_profile_cache
  ADD COLUMN IF NOT EXISTS roast_pref_json JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS process_pref_json JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS species_pref_json JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS flavor_family_pref_json JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS flavor_subcategory_pref_json JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS brew_pref_json JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS distinct_region_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS distinct_process_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS distinct_roast_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS distinct_brew_method_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS breadth_score NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS selectivity_score NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS orientation_score NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS concentration_score NUMERIC(5,4);

COMMENT ON COLUMN public.user_taste_profile_cache.roast_pref_json IS
'Normalized (not smoothed) positive-preference roast distribution keyed by roast_level_enum text. Values sum to ~1 within the axis.';

COMMENT ON COLUMN public.user_taste_profile_cache.process_pref_json IS
'Normalized (not smoothed) positive-preference process distribution keyed by process_enum text. Values sum to ~1 within the axis.';

COMMENT ON COLUMN public.user_taste_profile_cache.species_pref_json IS
'Normalized (not smoothed) positive-preference bean species distribution keyed by species_enum text. Values sum to ~1 within the axis.';

COMMENT ON COLUMN public.user_taste_profile_cache.flavor_family_pref_json IS
'Normalized (not smoothed) positive-preference flavor-family distribution. Keys are normalized lower_snake_case family labels from coffee_directory_mv.canon_flavor_families.';

COMMENT ON COLUMN public.user_taste_profile_cache.flavor_subcategory_pref_json IS
'Normalized (not smoothed) positive-preference flavor-subcategory distribution. Keys are normalized lower_snake_case labels from coffee_directory_mv.canon_flavor_subcategories.';

COMMENT ON COLUMN public.user_taste_profile_cache.brew_pref_json IS
'Normalized (not smoothed) positive-preference brew-method distribution using the brew method recorded on the review, not inferred coffee metadata.';

COMMENT ON COLUMN public.user_taste_profile_cache.distinct_region_count IS
'Distinct canon region names seen across the user''s reviewed coffees.';

COMMENT ON COLUMN public.user_taste_profile_cache.distinct_process_count IS
'Distinct coffee process values seen across the user''s reviewed coffees.';

COMMENT ON COLUMN public.user_taste_profile_cache.distinct_roast_count IS
'Distinct roast levels seen across the user''s reviewed coffees.';

COMMENT ON COLUMN public.user_taste_profile_cache.distinct_brew_method_count IS
'Distinct review brew methods used by the user across reviewed coffees.';

COMMENT ON COLUMN public.user_taste_profile_cache.breadth_score IS
'0-1 score for exploratory breadth across all rated coffees, measured across roasters, regions, processes, roast levels, and brew methods. Uses count-based normalized entropy with a small-sample reliability multiplier.';

COMMENT ON COLUMN public.user_taste_profile_cache.selectivity_score IS
'0-1 score for how hard the user is to impress. Higher values reflect lower recommendation rate, wider rating spread, more low ratings, and a larger gap between recommended ratings and average ratings.';

COMMENT ON COLUMN public.user_taste_profile_cache.orientation_score IS
'0-1 score where 0 leans comfort/classic and 1 leans bright/expressive. Computed from weighted roast, flavor family, flavor subcategory, and process signals.';

COMMENT ON COLUMN public.user_taste_profile_cache.confidence_score IS
'0-1 score representing how dependable the taste profile is. Uses review count, positive-preference evidence volume, and axis coverage.';

COMMENT ON COLUMN public.user_taste_profile_cache.concentration_score IS
'0-1 helper score measuring how focused the weighted preference profile is across roast, process, flavor family, and brew axes.';

-- ============================================================================
-- STEP 2: Rewrite refresh_user_taste_profile_cache
-- ============================================================================
-- Positive preference weight:
--   GREATEST(0, rating - 3.5) + CASE WHEN recommend = true THEN 0.75 ELSE 0 END
--
-- Orientation mapping notes:
--   Lower orientation_score = comfort/classic leaning
--   Higher orientation_score = bright/expressive leaning
--   Signals:
--     Roast:
--       bright -> light, light_medium
--       comfort -> medium, medium_dark, dark
--     Flavor families / subcategories:
--       bright -> floral, fruity, citrus, berries, stone_fruit, tropical_fruit
--       comfort -> chocolatey_cocoa, nutty, caramelized_brown_sugar, spice, chocolate, cocoa, nuts, caramel
--     Process:
--       bright/expressive -> anaerobic, carbonic_maceration, double_fermented, experimental (light influence)
--       comfort/classic -> washed, monsooned, wet_hulled
--
-- Bucket columns are intentionally deferred. The scoring surface is introduced
-- first so downstream bucketing can be tuned against production data.
-- Preference JSON distributions are normalized only in v1 (no pseudocount smoothing yet).

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
  -- Top arrays are preference-ranked (positive_weight), not exposure-ranked.
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
    -- Keys in this block were audited against normalized canon_sensory_nodes family/subcategory labels.
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

-- ============================================================================
-- STEP 3: Rewrite get_user_profile_full
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_profile_full(
  p_username TEXT,
  p_viewer_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_is_public BOOLEAN;
  v_profile_data JSONB;
  v_ratings_data JSONB;
  v_selections_data JSONB;
  v_taste_profile_data JSONB;
  v_gear_data JSONB;
  v_station_photos_data JSONB;
  v_user_coffees_data JSONB;
  v_result JSONB;
  v_current_review_count INT;
  v_cached_review_count INT;
  v_last_computed_at TIMESTAMPTZ;
BEGIN
  SELECT id, is_public_profile
  INTO v_user_id, v_is_public
  FROM public.user_profiles
  WHERE (
    LOWER(TRIM(username)) = LOWER(TRIM(p_username))
    OR (
      p_username ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      AND id::TEXT = p_username
    )
  )
    AND deleted_at IS NULL;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF v_is_public = false AND (p_viewer_id IS NULL OR p_viewer_id != v_user_id) THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*)
  INTO v_current_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = v_user_id
    AND entity_type = 'coffee';

  SELECT review_count_at_compute, last_computed_at
  INTO v_cached_review_count, v_last_computed_at
  FROM public.user_taste_profile_cache
  WHERE user_id = v_user_id;

  IF v_current_review_count >= 3 THEN
    IF v_cached_review_count IS NULL THEN
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    ELSIF (v_current_review_count - v_cached_review_count) >= 3 THEN
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    ELSIF v_last_computed_at IS NOT NULL
      AND (NOW() - v_last_computed_at) > INTERVAL '24 hours' THEN
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    END IF;
  END IF;

  SELECT jsonb_build_object(
    'id', id,
    'username', username,
    'full_name', full_name,
    'avatar_url', avatar_url,
    'bio', bio,
    'city', city,
    'state', state,
    'country', country,
    'is_public_profile', is_public_profile,
    'show_location', show_location,
    'created_at', created_at
  )
  INTO v_profile_data
  FROM public.user_profiles
  WHERE id = v_user_id;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', sub.id,
        'coffee_id', sub.entity_id,
        'coffee_name', sub.coffee_name,
        'coffee_slug', sub.coffee_slug,
        'roaster_name', sub.roaster_name,
        'roaster_slug', sub.roaster_slug,
        'rating', sub.rating,
        'comment', sub.comment,
        'created_at', sub.created_at,
        'image_url', sub.image_url
      )
    ),
    '[]'::JSONB
  )
  INTO v_ratings_data
  FROM (
    WITH first_images AS (
      SELECT DISTINCT ON (ci.coffee_id)
        ci.coffee_id,
        ci.imagekit_url
      FROM public.coffee_images ci
      WHERE ci.imagekit_url IS NOT NULL
      ORDER BY ci.coffee_id, ci.sort_order ASC
    )
    SELECT
      r.id,
      r.entity_id,
      c.name AS coffee_name,
      c.slug AS coffee_slug,
      ro.name AS roaster_name,
      ro.slug AS roaster_slug,
      r.rating,
      r.comment,
      r.created_at,
      fi.imagekit_url AS image_url
    FROM public.latest_reviews_per_identity r
    JOIN public.coffees c
      ON r.entity_id = c.id
    JOIN public.roasters ro
      ON c.roaster_id = ro.id
    LEFT JOIN first_images fi
      ON c.id = fi.coffee_id
    WHERE r.user_id = v_user_id
      AND r.entity_type = 'coffee'
      AND r.rating IS NOT NULL
    ORDER BY r.created_at DESC
    LIMIT 50
  ) sub;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'review_id', sub.review_id,
        'coffee_id', sub.coffee_id,
        'coffee_name', sub.coffee_name,
        'coffee_slug', sub.coffee_slug,
        'roaster_name', sub.roaster_name,
        'roaster_slug', sub.roaster_slug,
        'rating', sub.rating,
        'comment', sub.comment,
        'reviewed_at', sub.reviewed_at,
        'image_url', sub.coffee_image_url
      )
    ),
    '[]'::JSONB
  )
  INTO v_selections_data
  FROM (
    SELECT
      review_id,
      coffee_id,
      coffee_name,
      coffee_slug,
      roaster_name,
      roaster_slug,
      rating,
      comment,
      reviewed_at,
      coffee_image_url
    FROM public.user_recommended_coffees
    WHERE user_id = v_user_id
    ORDER BY reviewed_at DESC
  ) sub;

  SELECT jsonb_build_object(
    'top_roast_levels', COALESCE(c.top_roast_levels, ARRAY[]::TEXT[]),
    'top_brew_methods', COALESCE(c.top_brew_methods, ARRAY[]::TEXT[]),
    'top_flavor_note_ids', COALESCE(c.top_flavor_note_ids, ARRAY[]::UUID[]),
    'top_region_names', COALESCE(c.top_region_names, ARRAY[]::TEXT[]),
    'top_processes', COALESCE(c.top_processes, ARRAY[]::TEXT[]),
    'top_species', COALESCE(c.top_species, ARRAY[]::TEXT[]),
    'avg_rating', c.avg_rating,
    'recommend_rate', c.recommend_rate,
    'single_origin_pct', c.single_origin_pct,
    'distinct_roaster_count', COALESCE(c.distinct_roaster_count, 0),
    'distinct_region_count', COALESCE(c.distinct_region_count, 0),
    'distinct_process_count', COALESCE(c.distinct_process_count, 0),
    'distinct_roast_count', COALESCE(c.distinct_roast_count, 0),
    'distinct_brew_method_count', COALESCE(c.distinct_brew_method_count, 0),
    'rating_distribution', COALESCE(c.rating_distribution, '{}'::JSONB),
    'roast_pref_json', COALESCE(c.roast_pref_json, '{}'::JSONB),
    'process_pref_json', COALESCE(c.process_pref_json, '{}'::JSONB),
    'species_pref_json', COALESCE(c.species_pref_json, '{}'::JSONB),
    'flavor_family_pref_json', COALESCE(c.flavor_family_pref_json, '{}'::JSONB),
    'flavor_subcategory_pref_json', COALESCE(c.flavor_subcategory_pref_json, '{}'::JSONB),
    'brew_pref_json', COALESCE(c.brew_pref_json, '{}'::JSONB),
    'breadth_score', c.breadth_score,
    'selectivity_score', c.selectivity_score,
    'orientation_score', c.orientation_score,
    'confidence_score', c.confidence_score,
    'concentration_score', c.concentration_score,
    'total_reviews', COALESCE(c.total_reviews, 0),
    'last_computed_at', c.last_computed_at,
    'top_flavor_labels', (
      SELECT COALESCE(
        jsonb_agg(
          COALESCE(NULLIF(TRIM(csn.descriptor), ''), csn.slug)::TEXT
          ORDER BY ord.pos
        ),
        '[]'::JSONB
      )
      FROM UNNEST(COALESCE(c.top_flavor_note_ids, ARRAY[]::UUID[]))
           WITH ORDINALITY AS ord(id, pos)
      JOIN public.canon_sensory_nodes csn
        ON csn.id = ord.id
       AND csn.node_type = 'flavor'
    ),
    'top_roasters', (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object('name', ro.name, 'slug', ro.slug)
          ORDER BY ord.pos
        ),
        '[]'::JSONB
      )
      FROM UNNEST(COALESCE(c.top_roaster_ids, ARRAY[]::UUID[]))
           WITH ORDINALITY AS ord(id, pos)
      JOIN public.roasters ro
        ON ro.id = ord.id
    )
  )
  INTO v_taste_profile_data
  FROM public.user_taste_profile_cache c
  WHERE c.user_id = v_user_id;

  IF v_taste_profile_data IS NULL THEN
    v_taste_profile_data := jsonb_build_object(
      'top_roast_levels', ARRAY[]::TEXT[],
      'top_brew_methods', ARRAY[]::TEXT[],
      'top_flavor_note_ids', ARRAY[]::UUID[],
      'top_flavor_labels', '[]'::JSONB,
      'top_roasters', '[]'::JSONB,
      'top_region_names', ARRAY[]::TEXT[],
      'top_processes', ARRAY[]::TEXT[],
      'top_species', ARRAY[]::TEXT[],
      'avg_rating', NULL,
      'recommend_rate', NULL,
      'single_origin_pct', NULL,
      'distinct_roaster_count', 0,
      'distinct_region_count', 0,
      'distinct_process_count', 0,
      'distinct_roast_count', 0,
      'distinct_brew_method_count', 0,
      'rating_distribution', '{}'::JSONB,
      'roast_pref_json', '{}'::JSONB,
      'process_pref_json', '{}'::JSONB,
      'species_pref_json', '{}'::JSONB,
      'flavor_family_pref_json', '{}'::JSONB,
      'flavor_subcategory_pref_json', '{}'::JSONB,
      'brew_pref_json', '{}'::JSONB,
      'breadth_score', NULL,
      'selectivity_score', NULL,
      'orientation_score', NULL,
      'confidence_score', NULL,
      'concentration_score', NULL,
      'total_reviews', v_current_review_count,
      'last_computed_at', NULL
    );
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', sub.id,
        'gear_id', sub.gear_id,
        'name', sub.name,
        'category', sub.category,
        'brand', sub.brand,
        'model', sub.model,
        'image_url', sub.image_url,
        'notes', sub.notes,
        'sort_order', sub.sort_order
      )
    ),
    '[]'::JSONB
  )
  INTO v_gear_data
  FROM (
    SELECT
      ug.id,
      gc.id AS gear_id,
      gc.name,
      gc.category,
      gc.brand,
      gc.model,
      gc.image_url,
      ug.notes,
      ug.sort_order
    FROM public.user_gear ug
    JOIN public.gear_catalog gc
      ON ug.gear_id = gc.id
    WHERE ug.user_id = v_user_id
    ORDER BY ug.sort_order, gc.name
  ) sub;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', sub.id,
        'image_url', sub.image_url,
        'width', sub.width,
        'height', sub.height,
        'sort_order', sub.sort_order
      )
    ),
    '[]'::JSONB
  )
  INTO v_station_photos_data
  FROM (
    SELECT
      id,
      image_url,
      width,
      height,
      sort_order
    FROM public.user_station_photos
    WHERE user_id = v_user_id
    ORDER BY sort_order, created_at
  ) sub;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', sub.id,
        'coffee_id', sub.coffee_id,
        'status', sub.status,
        'added_at', sub.added_at,
        'photo', sub.photo,
        'coffee_name', sub.coffee_name,
        'coffee_slug', sub.coffee_slug,
        'roaster_name', sub.roaster_name,
        'roaster_slug', sub.roaster_slug,
        'image_url', sub.image_url
      )
    ),
    '[]'::JSONB
  )
  INTO v_user_coffees_data
  FROM (
    WITH first_images AS (
      SELECT DISTINCT ON (ci.coffee_id)
        ci.coffee_id,
        ci.imagekit_url
      FROM public.coffee_images ci
      WHERE ci.imagekit_url IS NOT NULL
      ORDER BY ci.coffee_id, ci.sort_order ASC
    )
    SELECT
      uc.id,
      uc.coffee_id,
      uc.status::TEXT,
      uc.added_at,
      uc.photo,
      c.name AS coffee_name,
      c.slug AS coffee_slug,
      ro.name AS roaster_name,
      ro.slug AS roaster_slug,
      fi.imagekit_url AS image_url
    FROM public.user_coffees uc
    JOIN public.coffees c
      ON uc.coffee_id = c.id
    JOIN public.roasters ro
      ON c.roaster_id = ro.id
    LEFT JOIN first_images fi
      ON c.id = fi.coffee_id
    WHERE uc.user_id = v_user_id
    ORDER BY uc.added_at DESC
    LIMIT 100
  ) sub;

  v_result := jsonb_build_object(
    'profile', v_profile_data,
    'ratings', v_ratings_data,
    'selections', v_selections_data,
    'taste_profile', v_taste_profile_data,
    'gear', v_gear_data,
    'station_photos', v_station_photos_data,
    'user_coffees', v_user_coffees_data
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_profile_full IS
'Fetches a full user profile payload and exposes the weighted taste preference model. Taste profile now includes normalized preference JSON, breadth/selectivity/orientation/confidence scores, extra distinct counts, and still resolves top_flavor_labels plus top_roasters for current consumers.';
