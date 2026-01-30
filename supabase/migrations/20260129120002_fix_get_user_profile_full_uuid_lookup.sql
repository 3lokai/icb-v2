-- Migration: Fix get_user_profile_full UUID lookup (case-insensitive + ensure profile)
-- Created: 2026-01-29
-- Description: Makes UUID matching case-insensitive so /profile/[uuid] works
--              regardless of UUID string casing (browser may send mixed case).

-- ============================================================================
-- FUNCTION: get_user_profile_full (update UUID lookup only)
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
  v_username_trimmed TEXT;
  v_username_lower TEXT;
BEGIN
  v_username_trimmed := TRIM(p_username);
  v_username_lower := LOWER(v_username_trimmed);

  -- Step 1: Lookup user by username (case-insensitive) OR by UUID (case-insensitive)
  SELECT id, is_public_profile 
  INTO v_user_id, v_is_public
  FROM user_profiles 
  WHERE (
    -- Username match (case-insensitive, trimmed)
    (username IS NOT NULL AND LOWER(TRIM(username)) = v_username_lower)
    OR
    -- UUID fallback: accept any case (browsers may send uppercase)
    (v_username_trimmed ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND id::TEXT = v_username_lower)
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
  IF v_cached_review_count IS NULL OR (v_current_review_count - COALESCE(v_cached_review_count, 0)) >= 10 THEN
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
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'coffee_id', r.entity_id,
        'coffee_name', c.name,
        'coffee_slug', c.slug,
        'roaster_name', ro.name,
        'roaster_slug', ro.slug,
        'rating', r.rating,
        'comment', r.comment,
        'created_at', r.created_at,
        'image_url', ci.url
      )
      ORDER BY r.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_ratings_data
  FROM public.latest_reviews_per_identity r
  JOIN public.coffees c ON r.entity_id = c.id
  JOIN public.roasters ro ON c.roaster_id = ro.id
  LEFT JOIN public.coffee_images ci ON c.id = ci.coffee_id AND ci.sort_order = 0
  WHERE r.user_id = v_user_id
    AND r.entity_type = 'coffee'
    AND r.rating IS NOT NULL
  ORDER BY r.created_at DESC
  LIMIT 50;
  
  -- Step 6: Build selections section (recommended coffees)
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'review_id', review_id,
        'coffee_id', coffee_id,
        'coffee_name', coffee_name,
        'coffee_slug', coffee_slug,
        'roaster_name', roaster_name,
        'roaster_slug', roaster_slug,
        'rating', rating,
        'comment', comment,
        'reviewed_at', reviewed_at,
        'image_url', coffee_image_url
      )
      ORDER BY reviewed_at DESC
    ),
    '[]'::jsonb
  ) INTO v_selections_data
  FROM public.user_recommended_coffees
  WHERE user_id = v_user_id
  ORDER BY reviewed_at DESC;
  
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
  
  IF v_taste_profile_data IS NULL THEN
    v_taste_profile_data := jsonb_build_object(
      'top_roast_levels', ARRAY[]::TEXT[],
      'top_brew_methods', ARRAY[]::TEXT[],
      'top_flavor_note_ids', ARRAY[]::UUID[],
      'total_reviews', 0,
      'last_computed_at', NULL
    );
  END IF;
  
  -- Step 8: Build gear section
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', ug.id,
        'gear_id', gc.id,
        'name', gc.name,
        'category', gc.category,
        'brand', gc.brand,
        'model', gc.model,
        'image_url', gc.image_url,
        'notes', ug.notes,
        'sort_order', ug.sort_order
      )
      ORDER BY ug.sort_order, gc.name
    ),
    '[]'::jsonb
  ) INTO v_gear_data
  FROM public.user_gear ug
  JOIN public.gear_catalog gc ON ug.gear_id = gc.id
  WHERE ug.user_id = v_user_id
  ORDER BY ug.sort_order, gc.name;
  
  -- Step 9: Build station photos section
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'image_url', image_url,
        'width', width,
        'height', height,
        'sort_order', sort_order
      )
      ORDER BY sort_order, created_at
    ),
    '[]'::jsonb
  ) INTO v_station_photos_data
  FROM public.user_station_photos
  WHERE user_id = v_user_id
  ORDER BY sort_order, created_at;
  
  -- Step 10: Combine all sections
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

COMMENT ON FUNCTION public.get_user_profile_full IS 'Fetches complete user profile data. Handles username/UUID lookup (case-insensitive), privacy checks, and auto-refreshes taste profile cache if stale.';
