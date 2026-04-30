-- Migrate Loops lifecycle plumbing to Sequenzy naming.

-- ============================================================================
-- USER_PROFILES: rename lifecycle columns
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'loops_phase'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'sequenzy_phase'
  ) THEN
    ALTER TABLE public.user_profiles RENAME COLUMN loops_phase TO sequenzy_phase;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'loops_last_synced_at'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'sequenzy_last_synced_at'
  ) THEN
    ALTER TABLE public.user_profiles RENAME COLUMN loops_last_synced_at TO sequenzy_last_synced_at;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'loops_last_session_event_at'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'sequenzy_last_session_event_at'
  ) THEN
    ALTER TABLE public.user_profiles RENAME COLUMN loops_last_session_event_at TO sequenzy_last_session_event_at;
  END IF;
END
$$;

COMMENT ON COLUMN public.user_profiles.sequenzy_phase IS 'Marketing funnel phase for Sequenzy lifecycle emails.';
COMMENT ON COLUMN public.user_profiles.sequenzy_last_synced_at IS 'Last successful sync-to-sequenzy Edge Function run.';
COMMENT ON COLUMN public.user_profiles.sequenzy_last_session_event_at IS 'Last session_started event sent to Sequenzy (throttle max 1/day).';

-- ============================================================================
-- LIFECYCLE STATE (for Edge Function; service_role only)
-- ============================================================================

DROP FUNCTION IF EXISTS public.get_user_lifecycle_state(uuid);

CREATE OR REPLACE FUNCTION public.get_user_lifecycle_state(p_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  ratings_count integer,
  has_gear boolean,
  has_station_photo boolean,
  has_bio boolean,
  has_avatar boolean,
  sequenzy_phase text,
  sequenzy_last_synced_at timestamptz,
  sequenzy_last_session_event_at timestamptz,
  activated_at timestamptz,
  profile_building_entered_at timestamptz,
  last_active_at timestamptz,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    up.id AS user_id,
    (
      SELECT COUNT(*)::integer
      FROM public.reviews r
      INNER JOIN public.coffees c ON c.id = r.entity_id
      WHERE r.user_id = p_user_id
        AND r.entity_type = 'coffee'::public.review_entity_type
        AND r.rating IS NOT NULL
        AND r.status = 'active'::public.review_status
    ) AS ratings_count,
    EXISTS (SELECT 1 FROM public.user_gear ug WHERE ug.user_id = p_user_id) AS has_gear,
    EXISTS (SELECT 1 FROM public.user_station_photos usp WHERE usp.user_id = p_user_id) AS has_station_photo,
    (up.bio IS NOT NULL AND btrim(up.bio) <> '') AS has_bio,
    (up.avatar_url IS NOT NULL AND btrim(up.avatar_url) <> '') AS has_avatar,
    up.sequenzy_phase,
    up.sequenzy_last_synced_at,
    up.sequenzy_last_session_event_at,
    up.activated_at,
    up.profile_building_entered_at,
    up.last_active_at,
    up.email
  FROM public.user_profiles up
  WHERE up.id = p_user_id;
$$;

REVOKE ALL ON FUNCTION public.get_user_lifecycle_state(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_lifecycle_state(uuid) TO service_role;

COMMENT ON FUNCTION public.get_user_lifecycle_state(uuid) IS
  'Single-row lifecycle snapshot for Sequenzy sync (ratings_count = active coffee reviews with any coffee status).';

-- ============================================================================
-- PG_NET: notify Edge Function (secrets from Vault)
-- ============================================================================

DROP FUNCTION IF EXISTS public.notify_loops_sync(uuid, text);
DROP FUNCTION IF EXISTS public.notify_loops_sync(uuid, text, text);

CREATE OR REPLACE FUNCTION public.notify_sequenzy_sync(
  p_user_id uuid,
  p_event_name text,
  p_source text DEFAULT 'trigger'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_url text;
  v_secret text;
  v_body jsonb;
  v_headers jsonb;
BEGIN
  IF p_user_id IS NULL OR p_event_name IS NULL OR btrim(p_event_name) = '' THEN
    RETURN;
  END IF;

  BEGIN
    SELECT ds.decrypted_secret::text INTO v_url
    FROM vault.decrypted_secrets ds
    WHERE ds.name = 'sequenzy_edge_function_url'
    LIMIT 1;
  EXCEPTION
    WHEN undefined_table THEN
      v_url := NULL;
    WHEN undefined_column THEN
      v_url := NULL;
  END;

  BEGIN
    SELECT ds.decrypted_secret::text INTO v_secret
    FROM vault.decrypted_secrets ds
    WHERE ds.name = 'sequenzy_internal_sync_secret'
    LIMIT 1;
  EXCEPTION
    WHEN undefined_table THEN
      v_secret := NULL;
    WHEN undefined_column THEN
      v_secret := NULL;
  END;

  IF v_url IS NULL OR v_secret IS NULL THEN
    RAISE LOG 'notify_sequenzy_sync: skipped (configure vault secrets sequenzy_edge_function_url and sequenzy_internal_sync_secret)';
    RETURN;
  END IF;

  v_body := jsonb_build_object(
    'user_id', p_user_id::text,
    'event_name', p_event_name,
    'source', COALESCE(NULLIF(btrim(p_source), ''), 'trigger')
  );

  v_headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-icb-sequenzy-sync', v_secret
  );

  PERFORM net.http_post(
    url := v_url,
    body := v_body,
    headers := v_headers,
    timeout_milliseconds := 8000
  );
END;
$$;

REVOKE ALL ON FUNCTION public.notify_sequenzy_sync(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.notify_sequenzy_sync(uuid, text, text) TO postgres;
GRANT EXECUTE ON FUNCTION public.notify_sequenzy_sync(uuid, text, text) TO service_role;

COMMENT ON FUNCTION public.notify_sequenzy_sync(uuid, text, text) IS
  'Async POST to sync-to-sequenzy Edge Function via pg_net; includes source tag and requires Vault secrets.';

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.loops_sync_after_user_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_sequenzy_sync(NEW.id, 'signed_up');
  ELSIF TG_OP = 'UPDATE' THEN
    IF (
      OLD.bio IS DISTINCT FROM NEW.bio
      OR OLD.username IS DISTINCT FROM NEW.username
      OR OLD.avatar_url IS DISTINCT FROM NEW.avatar_url
      OR OLD.full_name IS DISTINCT FROM NEW.full_name
      OR OLD.city IS DISTINCT FROM NEW.city
      OR OLD.state IS DISTINCT FROM NEW.state
      OR OLD.country IS DISTINCT FROM NEW.country
      OR OLD.gender IS DISTINCT FROM NEW.gender
      OR OLD.experience_level IS DISTINCT FROM NEW.experience_level
      OR OLD.preferred_brewing_methods IS DISTINCT FROM NEW.preferred_brewing_methods
      OR OLD.onboarding_completed IS DISTINCT FROM NEW.onboarding_completed
      OR OLD.is_public_profile IS DISTINCT FROM NEW.is_public_profile
      OR OLD.show_location IS DISTINCT FROM NEW.show_location
    ) THEN
      PERFORM public.notify_sequenzy_sync(NEW.id, 'profile_updated');
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.loops_sync_after_user_gear()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_sequenzy_sync(NEW.user_id, 'gear_added');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.loops_sync_after_user_station_photos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_sequenzy_sync(NEW.user_id, 'station_photo_added');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.loops_sync_after_reviews_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.user_id IS NOT NULL
      AND NEW.entity_type = 'coffee'::public.review_entity_type
      AND NEW.rating IS NOT NULL
      AND NEW.status = 'active'::public.review_status
    THEN
      PERFORM public.notify_sequenzy_sync(NEW.user_id, 'rated_coffee');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
