-- Lock down SECURITY DEFINER function EXECUTE grants to match actual callers
-- (traced against src/ for every function - see plan doc for the full audit table),
-- and fix two real ownership-check bugs found while reading the function bodies.

-- ===== Trigger-only functions: never meant to be called via PostgREST RPC =====
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_reviews_insert() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_user_gear() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_user_profiles() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_user_station_photos() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ===== No caller anywhere in src/: admin/internal-only, safe to lock down =====
REVOKE EXECUTE ON FUNCTION public.assign_user_role(target_user_id uuid, new_role user_role_enum, assigned_by uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.backfill_user_profile_emails() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_edit_roaster(p_roaster_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_duplicate_prices() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_epic_c_parameters(p_coffee_id text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_roaster_member_role(p_roaster_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_lifecycle_state(p_user_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_role(user_uuid uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_permission(required_role user_role_enum) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.map_roast_legacy(raw text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_lifecycle_sync(p_user_id uuid, p_event_name text, p_source text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_coffee_directory_mv() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_user_taste_profile_cache(p_user_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rpc_upsert_coffee_flavor_note(p_coffee_id uuid, p_flavor_note_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rpc_upsert_flavor_note(p_key text, p_label text, p_group_key text) FROM anon, authenticated;

-- ===== Only ever called via createServiceRoleClient(): grant is a no-op for the app =====
REVOKE EXECUTE ON FUNCTION public.anonymize_user_reviews(p_user_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ensure_external_identity(p_key_id uuid, p_external_user_id text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.merge_coffee_views_for_anon(p_user_id uuid, p_anon_id uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.merge_reviews_for_anon(p_user_id uuid, p_anon_id uuid) FROM anon, authenticated;

-- ===== Authenticated-only: called from src/app/actions/{gear,profile}.ts behind getCurrentUser() =====
REVOKE EXECUTE ON FUNCTION public.add_user_gear(p_user_id uuid, p_gear_id uuid, p_notes text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_gear_item(p_name text, p_category text, p_brand text, p_model text, p_created_by uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.remove_user_gear(p_user_gear_id uuid, p_user_id uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.upsert_coffee_preferences(p_user_id uuid, p_roast_levels text[], p_flavor_profiles text[], p_processing_methods text[], p_regions text[], p_with_milk_preference boolean, p_decaf_only boolean, p_organic_only boolean) FROM anon;
REVOKE EXECUTE ON FUNCTION public.upsert_notification_preferences(p_user_id uuid, p_new_roasters boolean, p_coffee_updates boolean, p_newsletter boolean, p_platform_updates boolean, p_email_frequency text) FROM anon;

-- ===== Bug fix: upsert_user_profile had zero ownership check on the caller-supplied
-- p_user_id. Any authenticated session could overwrite ANY other user's profile via
-- a raw POST to /rest/v1/rpc/upsert_user_profile with someone else's UUID. =====
CREATE OR REPLACE FUNCTION public.upsert_user_profile(p_user_id uuid, p_full_name text DEFAULT NULL::text, p_username character varying DEFAULT NULL::character varying, p_bio text DEFAULT NULL::text, p_city text DEFAULT NULL::text, p_state text DEFAULT NULL::text, p_country text DEFAULT NULL::text, p_gender text DEFAULT NULL::text, p_experience_level text DEFAULT NULL::text, p_preferred_brewing_methods text[] DEFAULT NULL::text[], p_onboarding_completed boolean DEFAULT NULL::boolean, p_newsletter_subscribed boolean DEFAULT NULL::boolean, p_is_public_profile boolean DEFAULT NULL::boolean, p_show_location boolean DEFAULT NULL::boolean)
 RETURNS TABLE(profile_id uuid, username character varying, full_name text, email text, city text, state text, country text, gender text, experience_level text, preferred_brewing_methods text[], bio text, avatar_url text, is_public_profile boolean, show_location boolean, email_verified boolean, onboarding_completed boolean, newsletter_subscribed boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_exists BOOLEAN;
  v_auth_email TEXT;
  v_auth_email_verified BOOLEAN;
BEGIN
  IF p_user_id IS DISTINCT FROM (SELECT auth.uid()) THEN
    RAISE EXCEPTION 'not authorized to modify this profile';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE user_profiles.id = p_user_id) INTO v_exists;

  SELECT au.email, (au.email_confirmed_at IS NOT NULL)
  INTO v_auth_email, v_auth_email_verified
  FROM auth.users au
  WHERE au.id = p_user_id;

  IF v_exists THEN
    UPDATE public.user_profiles up
    SET
      full_name = COALESCE(p_full_name, up.full_name),
      username = COALESCE(p_username, up.username),
      bio = COALESCE(p_bio, up.bio),
      city = COALESCE(p_city, up.city),
      state = COALESCE(p_state, up.state),
      country = COALESCE(p_country, up.country),
      gender = COALESCE(p_gender, up.gender),
      experience_level = COALESCE(p_experience_level, up.experience_level),
      preferred_brewing_methods = COALESCE(p_preferred_brewing_methods, up.preferred_brewing_methods),
      onboarding_completed = COALESCE(p_onboarding_completed, up.onboarding_completed),
      newsletter_subscribed = COALESCE(p_newsletter_subscribed, up.newsletter_subscribed),
      is_public_profile = COALESCE(p_is_public_profile, up.is_public_profile),
      show_location = COALESCE(p_show_location, up.show_location),
      updated_at = NOW()
    WHERE up.id = p_user_id;
  ELSE
    INSERT INTO public.user_profiles (
      id,
      full_name,
      username,
      bio,
      city,
      state,
      country,
      gender,
      experience_level,
      preferred_brewing_methods,
      onboarding_completed,
      newsletter_subscribed,
      is_public_profile,
      show_location,
      email,
      email_verified
    )
    VALUES (
      p_user_id,
      p_full_name,
      p_username,
      p_bio,
      p_city,
      p_state,
      p_country,
      p_gender,
      p_experience_level,
      p_preferred_brewing_methods,
      COALESCE(p_onboarding_completed, false),
      COALESCE(p_newsletter_subscribed, true),
      COALESCE(p_is_public_profile, true),
      COALESCE(p_show_location, true),
      v_auth_email,
      COALESCE(v_auth_email_verified, false)
    );
  END IF;

  RETURN QUERY
  SELECT
    up.id AS profile_id,
    up.username,
    up.full_name,
    up.email,
    up.city,
    up.state,
    up.country,
    up.gender,
    up.experience_level,
    up.preferred_brewing_methods,
    up.bio,
    up.avatar_url,
    up.is_public_profile,
    up.show_location,
    up.email_verified,
    up.onboarding_completed,
    up.newsletter_subscribed,
    up.created_at,
    up.updated_at
  FROM public.user_profiles up
  WHERE up.id = p_user_id;
END;
$function$;

-- ===== Bug fix: get_user_profile_full trusted a caller-supplied p_viewer_id for the
-- private-profile check instead of the caller's real session. Anyone who knew a
-- private-profile user's UUID could pass it as p_viewer_id and read that profile
-- without being authenticated as them. Now derives the viewer from auth.uid(); the
-- p_viewer_id parameter is kept (default NULL) only so existing callers don't break,
-- but its value is ignored. =====
CREATE OR REPLACE FUNCTION public.get_user_profile_full(p_username text, p_viewer_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID;
  v_is_public BOOLEAN;
  v_viewer_id UUID := (SELECT auth.uid());
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

  IF v_is_public = false AND (v_viewer_id IS NULL OR v_viewer_id != v_user_id) THEN
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
$function$;
