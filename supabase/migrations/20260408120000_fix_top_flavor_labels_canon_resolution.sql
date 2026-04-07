-- Migration: Fix top_flavor_labels — resolve canon_sensory_nodes (not flavor_notes)
-- Created: 2026-04-08
-- For databases that already applied 20260407180000 with flavor_notes join; idempotent on fresh installs.

COMMENT ON COLUMN public.user_taste_profile_cache.top_flavor_note_ids IS
'Top canon flavor sensory node IDs (canon_sensory_nodes.id, node_type=flavor) by frequency across rated coffees, limit 10. Sourced from coffee_directory_mv.canon_flavor_node_ids.';

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