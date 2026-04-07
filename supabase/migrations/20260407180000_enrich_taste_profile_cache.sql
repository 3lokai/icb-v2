-- Migration: Enrich taste profile cache with more aggregate signals
-- Created: 2026-04-07
-- Description:
--   1. Adds new columns to user_taste_profile_cache:
--      top_roaster_ids, top_region_names, top_processes, top_species,
--      avg_rating, recommend_rate, single_origin_pct,
--      distinct_roaster_count, rating_distribution
--   2. Rewrites refresh_user_taste_profile_cache to compute all new aggregates
--      using coffee_directory_mv for simpler joins (no junction table traversal)
--   3. Rewrites the taste profile section of get_user_profile_full to:
--      - Resolve cached canon flavor node IDs → descriptors (canon_sensory_nodes, node_type=flavor)
--      - Resolve roaster IDs → name + slug (from roasters table)
--      - Return top_region_names directly (already in MV, stored as text[])
--      - Return all new scalar stats

-- ============================================================================
-- STEP 1: ALTER user_taste_profile_cache — add new columns
-- ============================================================================

ALTER TABLE public.user_taste_profile_cache
  ADD COLUMN IF NOT EXISTS top_roaster_ids    UUID[]          DEFAULT ARRAY[]::UUID[],
  ADD COLUMN IF NOT EXISTS top_region_names   TEXT[]          DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS top_processes      TEXT[]          DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS top_species        TEXT[]          DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS avg_rating         NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS recommend_rate     NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS single_origin_pct  NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS distinct_roaster_count INT         DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_distribution   JSONB        DEFAULT '{}'::JSONB;

COMMENT ON COLUMN public.user_taste_profile_cache.top_roaster_ids IS 'Top roaster IDs by frequency of rated coffees, limit 5';
COMMENT ON COLUMN public.user_taste_profile_cache.top_region_names IS 'Top canon region display names across rated coffees, limit 5. Sourced from coffee_directory_mv.canon_region_names';
COMMENT ON COLUMN public.user_taste_profile_cache.top_processes IS 'Top coffee process enum values by frequency, limit 5';
COMMENT ON COLUMN public.user_taste_profile_cache.top_species IS 'Top bean species enum values by frequency, limit 3';
COMMENT ON COLUMN public.user_taste_profile_cache.avg_rating IS 'Average rating across all reviewed coffees';
COMMENT ON COLUMN public.user_taste_profile_cache.recommend_rate IS 'Ratio of recommended reviews to total reviews (0.0-1.0)';
COMMENT ON COLUMN public.user_taste_profile_cache.single_origin_pct IS 'Ratio of single-origin coffees to total rated coffees (0.0-1.0)';
COMMENT ON COLUMN public.user_taste_profile_cache.distinct_roaster_count IS 'Number of distinct roasters across all rated coffees';
COMMENT ON COLUMN public.user_taste_profile_cache.rating_distribution IS 'Count per star rating, e.g. {"1":0,"2":1,"3":3,"4":5,"5":2}';

COMMENT ON COLUMN public.user_taste_profile_cache.top_flavor_note_ids IS
'Top canon flavor sensory node IDs (canon_sensory_nodes.id, node_type=flavor) by frequency across rated coffees, limit 10. Sourced from coffee_directory_mv.canon_flavor_node_ids.';

-- ============================================================================
-- STEP 2: Rewrite refresh_user_taste_profile_cache
-- ============================================================================
-- Uses coffee_directory_mv for a single join to get roast_level, process,
-- bean_species, roaster_id, roaster_slug, canon_region_names,
-- canon_flavor_node_ids — no need to hit junction tables.
-- single_origin_pct joins public.coffees for coffees.is_single_origin (not on MV).

CREATE OR REPLACE FUNCTION public.refresh_user_taste_profile_cache(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_caller_id           UUID;
  v_review_count        INT;
  v_top_roasts          TEXT[];
  v_top_methods         TEXT[];
  v_top_flavor_ids      UUID[];
  v_top_roaster_ids     UUID[];
  v_top_region_names    TEXT[];
  v_top_processes       TEXT[];
  v_top_species         TEXT[];
  v_avg_rating          NUMERIC(3,2);
  v_recommend_rate      NUMERIC(3,2);
  v_single_origin_pct   NUMERIC(3,2);
  v_distinct_roasters   INT;
  v_rating_dist         JSONB;
BEGIN
  -- Security check: users can only refresh their own cache (or service role)
  v_caller_id := auth.uid();
  IF v_caller_id IS NOT NULL AND v_caller_id IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only refresh your own taste profile cache'
      USING ERRCODE = '42501';
  END IF;

  -- Total review count
  SELECT COUNT(*) INTO v_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = p_user_id AND entity_type = 'coffee';

  -- ── Top roast levels ────────────────────────────────────────────────────────
  SELECT ARRAY_AGG(roast_level ORDER BY cnt DESC)
  INTO v_top_roasts
  FROM (
    SELECT mv.roast_level::TEXT AS roast_level, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND mv.roast_level IS NOT NULL
    GROUP BY mv.roast_level
    ORDER BY cnt DESC
    LIMIT 5
  ) sub;

  -- ── Top brew methods ────────────────────────────────────────────────────────
  SELECT ARRAY_AGG(brew_method ORDER BY cnt DESC)
  INTO v_top_methods
  FROM (
    SELECT r.brew_method::TEXT AS brew_method, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND r.brew_method IS NOT NULL
    GROUP BY r.brew_method
    ORDER BY cnt DESC
    LIMIT 5
  ) sub;

  -- ── Top canon flavor node IDs (via mv.canon_flavor_node_ids → canon_sensory_nodes.id) ──
  -- Unnest the array stored per coffee in the MV, count occurrences across rated coffees
  SELECT ARRAY_AGG(node_id::UUID ORDER BY cnt DESC)
  INTO v_top_flavor_ids
  FROM (
    SELECT node_id, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
    CROSS JOIN LATERAL UNNEST(mv.canon_flavor_node_ids) AS node_id
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND mv.canon_flavor_node_ids IS NOT NULL
    GROUP BY node_id
    ORDER BY cnt DESC
    LIMIT 10
  ) sub;

  -- ── Top roaster IDs ─────────────────────────────────────────────────────────
  SELECT ARRAY_AGG(roaster_id ORDER BY cnt DESC)
  INTO v_top_roaster_ids
  FROM (
    SELECT mv.roaster_id, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND mv.roaster_id IS NOT NULL
    GROUP BY mv.roaster_id
    ORDER BY cnt DESC
    LIMIT 5
  ) sub;

  -- ── Top region names (from mv.canon_region_names — already resolved text) ──
  SELECT ARRAY_AGG(region_name ORDER BY cnt DESC)
  INTO v_top_region_names
  FROM (
    SELECT region_name, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
    CROSS JOIN LATERAL UNNEST(mv.canon_region_names) AS region_name
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND mv.canon_region_names IS NOT NULL
    GROUP BY region_name
    ORDER BY cnt DESC
    LIMIT 5
  ) sub;

  -- ── Top processes ───────────────────────────────────────────────────────────
  SELECT ARRAY_AGG(process ORDER BY cnt DESC)
  INTO v_top_processes
  FROM (
    SELECT mv.process::TEXT AS process, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND mv.process IS NOT NULL
    GROUP BY mv.process
    ORDER BY cnt DESC
    LIMIT 5
  ) sub;

  -- ── Top species ─────────────────────────────────────────────────────────────
  SELECT ARRAY_AGG(species ORDER BY cnt DESC)
  INTO v_top_species
  FROM (
    SELECT mv.bean_species::TEXT AS species, COUNT(*) AS cnt
    FROM public.latest_reviews_per_identity r
    JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
    WHERE r.user_id = p_user_id
      AND r.entity_type = 'coffee'
      AND mv.bean_species IS NOT NULL
    GROUP BY mv.bean_species
    ORDER BY cnt DESC
    LIMIT 3
  ) sub;

  -- ── Scalar stats ─────────────────────────────────────────────────────────────
  SELECT
    ROUND(AVG(r.rating)::NUMERIC, 2),
    ROUND((COUNT(*) FILTER (WHERE r.recommend = true)::NUMERIC / NULLIF(COUNT(*), 0)), 2),
    ROUND((COUNT(*) FILTER (WHERE co.is_single_origin IS TRUE)::NUMERIC / NULLIF(COUNT(*), 0)), 2),
    COUNT(DISTINCT mv.roaster_id)
  INTO v_avg_rating, v_recommend_rate, v_single_origin_pct, v_distinct_roasters
  FROM public.latest_reviews_per_identity r
  JOIN public.coffee_directory_mv mv ON r.entity_id = mv.coffee_id
  JOIN public.coffees co ON co.id = r.entity_id
  WHERE r.user_id = p_user_id
    AND r.entity_type = 'coffee'
    AND r.rating IS NOT NULL;

  -- ── Rating distribution ──────────────────────────────────────────────────────
  -- Build {"1": n, "2": n, "3": n, "4": n, "5": n}
  SELECT jsonb_object_agg(star::TEXT, cnt)
  INTO v_rating_dist
  FROM (
    SELECT gs.star, COALESCE(counts.cnt, 0) AS cnt
    FROM generate_series(1, 5) AS gs(star)
    LEFT JOIN (
      SELECT ROUND(r.rating)::INT AS star, COUNT(*) AS cnt
      FROM public.latest_reviews_per_identity r
      WHERE r.user_id = p_user_id
        AND r.entity_type = 'coffee'
        AND r.rating IS NOT NULL
      GROUP BY ROUND(r.rating)::INT
    ) counts ON counts.star = gs.star
  ) dist;

  -- ── Upsert cache ─────────────────────────────────────────────────────────────
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
    total_reviews,
    last_computed_at,
    review_count_at_compute
  ) VALUES (
    p_user_id,
    COALESCE(v_top_roasts,       ARRAY[]::TEXT[]),
    COALESCE(v_top_methods,      ARRAY[]::TEXT[]),
    COALESCE(v_top_flavor_ids,   ARRAY[]::UUID[]),
    COALESCE(v_top_roaster_ids,  ARRAY[]::UUID[]),
    COALESCE(v_top_region_names, ARRAY[]::TEXT[]),
    COALESCE(v_top_processes,    ARRAY[]::TEXT[]),
    COALESCE(v_top_species,      ARRAY[]::TEXT[]),
    v_avg_rating,
    v_recommend_rate,
    v_single_origin_pct,
    COALESCE(v_distinct_roasters, 0),
    COALESCE(v_rating_dist, '{}'::JSONB),
    v_review_count,
    NOW(),
    v_review_count
  )
  ON CONFLICT (user_id) DO UPDATE SET
    top_roast_levels       = EXCLUDED.top_roast_levels,
    top_brew_methods       = EXCLUDED.top_brew_methods,
    top_flavor_note_ids    = EXCLUDED.top_flavor_note_ids,
    top_roaster_ids        = EXCLUDED.top_roaster_ids,
    top_region_names       = EXCLUDED.top_region_names,
    top_processes          = EXCLUDED.top_processes,
    top_species            = EXCLUDED.top_species,
    avg_rating             = EXCLUDED.avg_rating,
    recommend_rate         = EXCLUDED.recommend_rate,
    single_origin_pct      = EXCLUDED.single_origin_pct,
    distinct_roaster_count = EXCLUDED.distinct_roaster_count,
    rating_distribution    = EXCLUDED.rating_distribution,
    total_reviews          = EXCLUDED.total_reviews,
    last_computed_at       = EXCLUDED.last_computed_at,
    review_count_at_compute = EXCLUDED.review_count_at_compute,
    updated_at             = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.refresh_user_taste_profile_cache IS
'Refreshes the taste profile cache for a user based on their review history.
Uses coffee_directory_mv for efficient joins; joins public.coffees for is_single_origin
when computing single_origin_pct. Computes: top roast levels, brew methods, flavor node IDs,
roaster IDs, region names, processes, species, avg rating, recommend rate, single origin %,
distinct roaster count, and rating distribution.
Includes security check — users can only refresh their own cache.';

-- ============================================================================
-- STEP 3: Rewrite get_user_profile_full — taste profile Step 7
-- ============================================================================
-- Resolves IDs to human-readable strings server-side:
--   top_flavor_note_ids → top_flavor_labels (canon_sensory_nodes.descriptor, node_type=flavor)
--   top_roaster_ids → top_roasters JSONB[] [{name, slug}] (from roasters)
-- Region names are already strings (stored in top_region_names).

CREATE OR REPLACE FUNCTION public.get_user_profile_full(
  p_username TEXT,
  p_viewer_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id               UUID;
  v_is_public             BOOLEAN;
  v_profile_data          JSONB;
  v_ratings_data          JSONB;
  v_selections_data       JSONB;
  v_taste_profile_data    JSONB;
  v_gear_data             JSONB;
  v_station_photos_data   JSONB;
  v_user_coffees_data     JSONB;
  v_result                JSONB;
  v_current_review_count  INT;
  v_cached_review_count   INT;
  v_last_computed_at      TIMESTAMPTZ;
BEGIN
  -- Step 1: Lookup user by username (case-insensitive) OR by UUID
  SELECT id, is_public_profile
  INTO v_user_id, v_is_public
  FROM user_profiles
  WHERE (
    LOWER(TRIM(username)) = LOWER(TRIM(p_username))
    OR (p_username ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        AND id::TEXT = p_username)
  )
  AND deleted_at IS NULL;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Step 2: Check privacy
  IF v_is_public = false AND (p_viewer_id IS NULL OR p_viewer_id != v_user_id) THEN
    RETURN NULL;
  END IF;

  -- Step 3: Taste profile cache refresh gating
  SELECT COUNT(*) INTO v_current_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = v_user_id AND entity_type = 'coffee';

  SELECT review_count_at_compute, last_computed_at
  INTO v_cached_review_count, v_last_computed_at
  FROM public.user_taste_profile_cache
  WHERE user_id = v_user_id;

  IF v_current_review_count >= 3 THEN
    IF v_cached_review_count IS NULL THEN
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    ELSIF (v_current_review_count - v_cached_review_count) >= 3 THEN
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    ELSIF v_last_computed_at IS NOT NULL AND (NOW() - v_last_computed_at) > INTERVAL '24 hours' THEN
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    END IF;
  END IF;

  -- Step 4: Profile section
  SELECT jsonb_build_object(
    'id',               id,
    'username',         username,
    'full_name',        full_name,
    'avatar_url',       avatar_url,
    'bio',              bio,
    'city',             city,
    'state',            state,
    'country',          country,
    'is_public_profile', is_public_profile,
    'show_location',    show_location,
    'created_at',       created_at
  ) INTO v_profile_data
  FROM user_profiles
  WHERE id = v_user_id;

  -- Step 5: Ratings section (recent reviews, limit 50)
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id',           sub.id,
        'coffee_id',    sub.entity_id,
        'coffee_name',  sub.coffee_name,
        'coffee_slug',  sub.coffee_slug,
        'roaster_name', sub.roaster_name,
        'roaster_slug', sub.roaster_slug,
        'rating',       sub.rating,
        'comment',      sub.comment,
        'created_at',   sub.created_at,
        'image_url',    sub.image_url
      )
    ),
    '[]'::jsonb
  ) INTO v_ratings_data
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
      c.name       AS coffee_name,
      c.slug       AS coffee_slug,
      ro.name      AS roaster_name,
      ro.slug      AS roaster_slug,
      r.rating,
      r.comment,
      r.created_at,
      fi.imagekit_url AS image_url
    FROM public.latest_reviews_per_identity r
    JOIN public.coffees c  ON r.entity_id = c.id
    JOIN public.roasters ro ON c.roaster_id = ro.id
    LEFT JOIN first_images fi ON c.id = fi.coffee_id
    WHERE r.user_id = v_user_id
      AND r.entity_type = 'coffee'
      AND r.rating IS NOT NULL
    ORDER BY r.created_at DESC
    LIMIT 50
  ) sub;

  -- Step 6: Selections section (recommended coffees)
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'review_id',    sub.review_id,
        'coffee_id',    sub.coffee_id,
        'coffee_name',  sub.coffee_name,
        'coffee_slug',  sub.coffee_slug,
        'roaster_name', sub.roaster_name,
        'roaster_slug', sub.roaster_slug,
        'rating',       sub.rating,
        'comment',      sub.comment,
        'reviewed_at',  sub.reviewed_at,
        'image_url',    sub.coffee_image_url
      )
    ),
    '[]'::jsonb
  ) INTO v_selections_data
  FROM (
    SELECT
      review_id, coffee_id, coffee_name, coffee_slug,
      roaster_name, roaster_slug, rating, comment,
      reviewed_at, coffee_image_url
    FROM public.user_recommended_coffees
    WHERE user_id = v_user_id
    ORDER BY reviewed_at DESC
  ) sub;

  -- Step 7: Taste profile section — resolve IDs to display strings
  SELECT jsonb_build_object(
    -- Existing fields
    'top_roast_levels',       COALESCE(c.top_roast_levels,      ARRAY[]::TEXT[]),
    'top_brew_methods',       COALESCE(c.top_brew_methods,      ARRAY[]::TEXT[]),
    'top_flavor_note_ids',    COALESCE(c.top_flavor_note_ids,   ARRAY[]::UUID[]),
    'total_reviews',          COALESCE(c.total_reviews,          0),
    'last_computed_at',       c.last_computed_at,

    -- New fields — scalar stats
    'avg_rating',             c.avg_rating,
    'recommend_rate',         c.recommend_rate,
    'single_origin_pct',      c.single_origin_pct,
    'distinct_roaster_count', COALESCE(c.distinct_roaster_count, 0),
    'rating_distribution',    COALESCE(c.rating_distribution,   '{}'::JSONB),

    -- New fields — top region names (already text in cache)
    'top_region_names',       COALESCE(c.top_region_names,      ARRAY[]::TEXT[]),

    -- New fields — top processes + species (enum strings)
    'top_processes',          COALESCE(c.top_processes,         ARRAY[]::TEXT[]),
    'top_species',            COALESCE(c.top_species,           ARRAY[]::TEXT[]),

    -- Resolved: canon flavor node IDs → descriptors (canon_sensory_nodes)
    'top_flavor_labels', (
      SELECT COALESCE(
        jsonb_agg(
          COALESCE(NULLIF(TRIM(csn.descriptor), ''), csn.slug)::TEXT
          ORDER BY ord.pos
        ),
        '[]'::jsonb
      )
      FROM UNNEST(COALESCE(c.top_flavor_note_ids, ARRAY[]::UUID[]))
           WITH ORDINALITY AS ord(id, pos)
      JOIN public.canon_sensory_nodes csn
        ON csn.id = ord.id AND csn.node_type = 'flavor'
    ),

    -- Resolved: roaster IDs → {name, slug} objects (join roasters)
    'top_roasters', (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object('name', ro.name, 'slug', ro.slug)
          ORDER BY ord.pos
        ),
        '[]'::jsonb
      )
      FROM UNNEST(COALESCE(c.top_roaster_ids, ARRAY[]::UUID[]))
           WITH ORDINALITY AS ord(id, pos)
      JOIN public.roasters ro ON ro.id = ord.id
    )
  )
  INTO v_taste_profile_data
  FROM public.user_taste_profile_cache c
  WHERE c.user_id = v_user_id;

  -- If cache doesn't exist yet, return empty structure
  IF v_taste_profile_data IS NULL THEN
    v_taste_profile_data := jsonb_build_object(
      'top_roast_levels',       ARRAY[]::TEXT[],
      'top_brew_methods',       ARRAY[]::TEXT[],
      'top_flavor_note_ids',    ARRAY[]::UUID[],
      'top_flavor_labels',      '[]'::jsonb,
      'top_roasters',           '[]'::jsonb,
      'top_region_names',       ARRAY[]::TEXT[],
      'top_processes',          ARRAY[]::TEXT[],
      'top_species',            ARRAY[]::TEXT[],
      'avg_rating',             NULL,
      'recommend_rate',         NULL,
      'single_origin_pct',      NULL,
      'distinct_roaster_count', 0,
      'rating_distribution',    '{}'::JSONB,
      'total_reviews',          v_current_review_count,
      'last_computed_at',       NULL
    );
  END IF;

  -- Step 8: Gear section
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id',         sub.id,
        'gear_id',    sub.gear_id,
        'name',       sub.name,
        'category',   sub.category,
        'brand',      sub.brand,
        'model',      sub.model,
        'image_url',  sub.image_url,
        'notes',      sub.notes,
        'sort_order', sub.sort_order
      )
    ),
    '[]'::jsonb
  ) INTO v_gear_data
  FROM (
    SELECT
      ug.id,
      gc.id    AS gear_id,
      gc.name,
      gc.category,
      gc.brand,
      gc.model,
      gc.image_url,
      ug.notes,
      ug.sort_order
    FROM public.user_gear ug
    JOIN public.gear_catalog gc ON ug.gear_id = gc.id
    WHERE ug.user_id = v_user_id
    ORDER BY ug.sort_order, gc.name
  ) sub;

  -- Step 9: Station photos section
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id',         sub.id,
        'image_url',  sub.image_url,
        'width',      sub.width,
        'height',     sub.height,
        'sort_order', sub.sort_order
      )
    ),
    '[]'::jsonb
  ) INTO v_station_photos_data
  FROM (
    SELECT id, image_url, width, height, sort_order
    FROM public.user_station_photos
    WHERE user_id = v_user_id
    ORDER BY sort_order, created_at
  ) sub;

  -- Step 10: User coffees section (tried/tasted list)
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id',           sub.id,
        'coffee_id',    sub.coffee_id,
        'status',       sub.status,
        'added_at',     sub.added_at,
        'photo',        sub.photo,
        'coffee_name',  sub.coffee_name,
        'coffee_slug',  sub.coffee_slug,
        'roaster_name', sub.roaster_name,
        'roaster_slug', sub.roaster_slug,
        'image_url',    sub.image_url
      )
    ),
    '[]'::jsonb
  ) INTO v_user_coffees_data
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
      c.name   AS coffee_name,
      c.slug   AS coffee_slug,
      ro.name  AS roaster_name,
      ro.slug  AS roaster_slug,
      fi.imagekit_url AS image_url
    FROM public.user_coffees uc
    JOIN public.coffees c   ON uc.coffee_id = c.id
    JOIN public.roasters ro ON c.roaster_id = ro.id
    LEFT JOIN first_images fi ON c.id = fi.coffee_id
    WHERE uc.user_id = v_user_id
    ORDER BY uc.added_at DESC
    LIMIT 100
  ) sub;

  -- Step 11: Combine all sections
  v_result := jsonb_build_object(
    'profile',        v_profile_data,
    'ratings',        v_ratings_data,
    'selections',     v_selections_data,
    'taste_profile',  v_taste_profile_data,
    'gear',           v_gear_data,
    'station_photos', v_station_photos_data,
    'user_coffees',   v_user_coffees_data
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_profile_full IS
'Fetches complete user profile data including ratings, selections, taste profile (with resolved labels),
gear, station photos, and user_coffees. Taste profile returns top_flavor_labels as canonical descriptors
(canon_sensory_nodes.descriptor for node_type=flavor; slug fallback), top_roasters ({name, slug}),
top_region_names (already resolved text), top_processes, top_species, avg_rating, recommend_rate,
single_origin_pct, distinct_roaster_count, and rating_distribution. Refresh uses coffee_directory_mv.
Handles username/UUID lookup, privacy checks, and auto-refreshes cache when stale.
Returns NULL if user not found or permission denied.';
