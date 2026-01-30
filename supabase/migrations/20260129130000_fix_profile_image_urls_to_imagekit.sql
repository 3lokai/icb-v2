-- Migration: Fix profile image URLs to use imagekit_url instead of url
-- Created: 2026-01-29
-- Description: Updates user_recommended_coffees view and get_user_profile_full RPC
--              to use imagekit_url instead of url for proper ImageKit CDN delivery

-- ============================================================================
-- FIX VIEW: user_recommended_coffees
-- ============================================================================

-- Drop the view first to allow type changes
DROP VIEW IF EXISTS public.user_recommended_coffees;

CREATE VIEW public.user_recommended_coffees AS
WITH first_images AS (
  SELECT DISTINCT ON (ci.coffee_id)
    ci.coffee_id,
    ci.imagekit_url
  FROM public.coffee_images ci
  WHERE ci.imagekit_url IS NOT NULL
  ORDER BY ci.coffee_id, ci.sort_order ASC
)
SELECT 
  r.id as review_id,
  r.user_id,
  r.entity_id as coffee_id,
  r.rating,
  r.comment,
  r.created_at as reviewed_at,
  c.name as coffee_name,
  c.slug as coffee_slug,
  ro.name as roaster_name,
  ro.slug as roaster_slug,
  fi.imagekit_url as coffee_image_url
FROM public.latest_reviews_per_identity r
JOIN public.coffees c ON r.entity_id = c.id
JOIN public.roasters ro ON c.roaster_id = ro.id
LEFT JOIN first_images fi ON c.id = fi.coffee_id
WHERE r.entity_type = 'coffee'
  AND r.recommend = true
  AND r.user_id IS NOT NULL;

-- ============================================================================
-- FIX FUNCTION: get_user_profile_full
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
  v_result JSONB;
  v_current_review_count INT;
  v_cached_review_count INT;
BEGIN
  -- Step 1: Lookup user by username (case-insensitive) OR by UUID
  -- First try username lookup, then check if it's a valid UUID
  SELECT id, is_public_profile 
  INTO v_user_id, v_is_public
  FROM user_profiles 
  WHERE (
    -- Username match (case-insensitive, trimmed)
    LOWER(TRIM(username)) = LOWER(TRIM(p_username))
    OR
    -- UUID fallback (if p_username is a valid UUID)
    (p_username ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND id::TEXT = p_username)
  )
  AND deleted_at IS NULL;
  
  -- Return NULL if user not found
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Step 2: Check privacy - must be public OR viewer is owner
  IF v_is_public = false AND (p_viewer_id IS NULL OR p_viewer_id != v_user_id) THEN
    RETURN NULL; -- Permission denied
  END IF;
  
  -- Step 3: Check and refresh taste profile cache if needed
  SELECT COUNT(*) INTO v_current_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = v_user_id AND entity_type = 'coffee';
  
  SELECT review_count_at_compute INTO v_cached_review_count
  FROM public.user_taste_profile_cache
  WHERE user_id = v_user_id;
  
  -- Refresh cache if: doesn't exist OR review count increased by 10+
  IF v_cached_review_count IS NULL OR (v_current_review_count - v_cached_review_count) >= 10 THEN
    PERFORM public.refresh_user_taste_profile_cache(v_user_id);
  END IF;
  
  -- Step 4: Build profile section
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
  ) INTO v_profile_data
  FROM user_profiles
  WHERE id = v_user_id;
  
  -- Step 5: Build ratings section (recent reviews, limit 50)
  -- Use subquery to order first, then aggregate (fixes GROUP BY error)
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
      c.name as coffee_name,
      c.slug as coffee_slug,
      ro.name as roaster_name,
      ro.slug as roaster_slug,
      r.rating,
      r.comment,
      r.created_at,
      fi.imagekit_url as image_url
    FROM public.latest_reviews_per_identity r
    JOIN public.coffees c ON r.entity_id = c.id
    JOIN public.roasters ro ON c.roaster_id = ro.id
    LEFT JOIN first_images fi ON c.id = fi.coffee_id
    WHERE r.user_id = v_user_id
      AND r.entity_type = 'coffee'
      AND r.rating IS NOT NULL
    ORDER BY r.created_at DESC
    LIMIT 50
  ) sub;
  
  -- Step 6: Build selections section (recommended coffees)
  -- Use subquery to order first, then aggregate (fixes GROUP BY error)
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
    '[]'::jsonb
  ) INTO v_selections_data
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
  
  -- Step 7: Build taste profile section (from cache)
  SELECT jsonb_build_object(
    'top_roast_levels', COALESCE(top_roast_levels, ARRAY[]::TEXT[]),
    'top_brew_methods', COALESCE(top_brew_methods, ARRAY[]::TEXT[]),
    'top_flavor_note_ids', COALESCE(top_flavor_note_ids, ARRAY[]::UUID[]),
    'total_reviews', COALESCE(total_reviews, 0),
    'last_computed_at', last_computed_at
  ) INTO v_taste_profile_data
  FROM public.user_taste_profile_cache
  WHERE user_id = v_user_id;
  
  -- If cache doesn't exist, return empty structure
  IF v_taste_profile_data IS NULL THEN
    v_taste_profile_data := jsonb_build_object(
      'top_roast_levels', ARRAY[]::TEXT[],
      'top_brew_methods', ARRAY[]::TEXT[],
      'top_flavor_note_ids', ARRAY[]::UUID[],
      'total_reviews', 0,
      'last_computed_at', NULL
    );
  END IF;
  
  -- Step 8: Build gear section (with catalog details, categorized)
  -- Use subquery to order first, then aggregate (fixes GROUP BY error)
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
    '[]'::jsonb
  ) INTO v_gear_data
  FROM (
    SELECT 
      ug.id,
      gc.id as gear_id,
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
  
  -- Step 9: Build station photos section
  -- Use subquery to order first, then aggregate (fixes GROUP BY error)
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
    '[]'::jsonb
  ) INTO v_station_photos_data
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
  
  -- Step 10: Combine all sections into final result
  v_result := jsonb_build_object(
    'profile', v_profile_data,
    'ratings', v_ratings_data,
    'selections', v_selections_data,
    'taste_profile', v_taste_profile_data,
    'gear', v_gear_data,
    'station_photos', v_station_photos_data
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW public.user_recommended_coffees IS 'User recommended coffees (selections) - reviews where recommend = true. Uses imagekit_url for CDN delivery.';

COMMENT ON FUNCTION public.get_user_profile_full IS
'Fetches complete user profile data including ratings, selections, taste profile, gear, and station photos. Handles username/UUID lookup, privacy checks, and auto-refreshes taste profile cache if stale. Returns NULL if user not found or permission denied. Uses imagekit_url for all coffee images.';
