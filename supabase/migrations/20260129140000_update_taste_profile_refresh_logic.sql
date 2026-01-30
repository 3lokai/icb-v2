-- Migration: Update taste profile refresh logic to 3-rating threshold
-- Created: 2026-01-29
-- Description: 
--   1. Adds security check to refresh_user_taste_profile_cache to prevent unauthorized refreshes
--   2. Updates get_user_profile_full to use 3-rating threshold instead of 10
--   3. Implements proper gating logic: refresh if < 3 ratings (don't), else if cache missing, else if count increased by 3+

-- ============================================================================
-- SECURITY: refresh_user_taste_profile_cache
-- ============================================================================

CREATE OR REPLACE FUNCTION public.refresh_user_taste_profile_cache(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_review_count INT;
  v_top_roasts TEXT[];
  v_top_methods TEXT[];
  v_top_flavors UUID[];
  v_caller_id UUID;
  v_is_service_role BOOLEAN;
BEGIN
  -- Security check: Only allow user to refresh their own cache (or service role)
  v_caller_id := auth.uid();
  
  -- Allow if:
  -- 1. Service role (auth.uid() IS NULL) - allowed for system operations
  -- 2. User refreshing their own cache (auth.uid() = p_user_id) - allowed
  -- Deny if: User trying to refresh someone else's cache
  IF v_caller_id IS NOT NULL AND v_caller_id IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only refresh your own taste profile cache'
      USING ERRCODE = '42501'; -- insufficient_privilege
  END IF;
  
  -- Get total review count
  SELECT COUNT(*) INTO v_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = p_user_id AND entity_type = 'coffee';

  -- Get top roast levels (from coffee roast_level)
  SELECT ARRAY_AGG(DISTINCT c.roast_level::TEXT ORDER BY c.roast_level::TEXT)
  INTO v_top_roasts
  FROM public.latest_reviews_per_identity r
  JOIN public.coffees c ON r.entity_id = c.id
  WHERE r.user_id = p_user_id 
    AND r.entity_type = 'coffee'
    AND c.roast_level IS NOT NULL
  GROUP BY c.roast_level
  ORDER BY COUNT(*) DESC
  LIMIT 5;

  -- Get top brew methods (from review brew_method)
  SELECT ARRAY_AGG(DISTINCT r.brew_method::TEXT ORDER BY r.brew_method::TEXT)
  INTO v_top_methods
  FROM public.latest_reviews_per_identity r
  WHERE r.user_id = p_user_id 
    AND r.entity_type = 'coffee'
    AND r.brew_method IS NOT NULL
  GROUP BY r.brew_method
  ORDER BY COUNT(*) DESC
  LIMIT 5;

  -- Get top flavor notes (from coffee_flavor_notes junction)
  SELECT ARRAY_AGG(DISTINCT cfn.flavor_note_id ORDER BY cfn.flavor_note_id)
  INTO v_top_flavors
  FROM public.latest_reviews_per_identity r
  JOIN public.coffees c ON r.entity_id = c.id
  JOIN public.coffee_flavor_notes cfn ON c.id = cfn.coffee_id
  WHERE r.user_id = p_user_id 
    AND r.entity_type = 'coffee'
  GROUP BY cfn.flavor_note_id
  ORDER BY COUNT(*) DESC
  LIMIT 10;

  -- Upsert cache record
  INSERT INTO public.user_taste_profile_cache (
    user_id,
    top_roast_levels,
    top_brew_methods,
    top_flavor_note_ids,
    total_reviews,
    last_computed_at,
    review_count_at_compute
  ) VALUES (
    p_user_id,
    COALESCE(v_top_roasts, ARRAY[]::TEXT[]),
    COALESCE(v_top_methods, ARRAY[]::TEXT[]),
    COALESCE(v_top_flavors, ARRAY[]::UUID[]),
    v_review_count,
    NOW(),
    v_review_count
  )
  ON CONFLICT (user_id) DO UPDATE SET
    top_roast_levels = EXCLUDED.top_roast_levels,
    top_brew_methods = EXCLUDED.top_brew_methods,
    top_flavor_note_ids = EXCLUDED.top_flavor_note_ids,
    total_reviews = EXCLUDED.total_reviews,
    last_computed_at = EXCLUDED.last_computed_at,
    review_count_at_compute = EXCLUDED.review_count_at_compute,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- UPDATE: get_user_profile_full (3-rating threshold)
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
  v_last_computed_at TIMESTAMPTZ;
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
  -- Get current review count (same source as cache function uses)
  SELECT COUNT(*) INTO v_current_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = v_user_id AND entity_type = 'coffee';
  
  -- Get cached review count and last computed timestamp
  SELECT review_count_at_compute, last_computed_at 
  INTO v_cached_review_count, v_last_computed_at
  FROM public.user_taste_profile_cache
  WHERE user_id = v_user_id;
  
  -- Gating logic for refresh:
  -- if reviewCount < 3: don't refresh; show empty state
  -- else if cache missing: refresh
  -- else if reviewCount - cache.review_count_at_compute >= 3: refresh
  -- else: do nothing
  -- Optional: also refresh if now - last_computed_at > 24h
  IF v_current_review_count >= 3 THEN
    IF v_cached_review_count IS NULL THEN
      -- Cache missing and we have >= 3 ratings: refresh
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    ELSIF (v_current_review_count - v_cached_review_count) >= 3 THEN
      -- Review count increased by 3+: refresh
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    ELSIF v_last_computed_at IS NOT NULL AND (NOW() - v_last_computed_at) > INTERVAL '24 hours' THEN
      -- Optional: refresh if older than 24h
      PERFORM public.refresh_user_taste_profile_cache(v_user_id);
    END IF;
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
      'total_reviews', v_current_review_count,
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

COMMENT ON FUNCTION public.refresh_user_taste_profile_cache IS 
'Refreshes the taste profile cache for a user based on their review history. Includes security check to prevent unauthorized refreshes - users can only refresh their own cache.';

COMMENT ON FUNCTION public.get_user_profile_full IS
'Fetches complete user profile data including ratings, selections, taste profile, gear, and station photos. Handles username/UUID lookup, privacy checks, and auto-refreshes taste profile cache if stale (3+ rating threshold). Returns NULL if user not found or permission denied. Uses imagekit_url for all coffee images.';
