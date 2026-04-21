-- Migration: Sync user_profiles.email from auth (OAuth / RPC / trigger hardening)
-- Created: 2026-04-21
-- Description: upsert_user_profile INSERT sets email from auth.users; backfill NULL emails;
--              handle_new_user uses COALESCE(NEW.email, raw metadata email) and prefers auth on conflict.

-- ============================================================================
-- 1. upsert_user_profile: INSERT branch pulls email from auth.users
-- ============================================================================

DROP FUNCTION IF EXISTS public.upsert_user_profile CASCADE;

CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  p_user_id UUID,
  p_full_name TEXT DEFAULT NULL,
  p_username VARCHAR DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_experience_level TEXT DEFAULT NULL,
  p_preferred_brewing_methods TEXT[] DEFAULT NULL,
  p_onboarding_completed BOOLEAN DEFAULT NULL,
  p_newsletter_subscribed BOOLEAN DEFAULT NULL,
  p_is_public_profile BOOLEAN DEFAULT NULL,
  p_show_location BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
  profile_id UUID,
  username VARCHAR,
  full_name TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  gender TEXT,
  experience_level TEXT,
  preferred_brewing_methods TEXT[],
  bio TEXT,
  avatar_url TEXT,
  is_public_profile BOOLEAN,
  show_location BOOLEAN,
  email_verified BOOLEAN,
  onboarding_completed BOOLEAN,
  newsletter_subscribed BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists BOOLEAN;
  v_auth_email TEXT;
  v_auth_email_verified BOOLEAN;
BEGIN
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
$$;

GRANT EXECUTE ON FUNCTION public.upsert_user_profile TO authenticated;

COMMENT ON FUNCTION public.upsert_user_profile IS 'Safely upserts a user profile with support for username, bio, and privacy settings. On insert, email and email_verified are copied from auth.users.';

-- ============================================================================
-- 2. Backfill user_profiles.email from auth.users
-- ============================================================================

UPDATE public.user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.id = au.id
  AND up.email IS NULL
  AND au.email IS NOT NULL;

-- ============================================================================
-- 3. handle_new_user: OAuth metadata email fallback + auth-preferred ON CONFLICT
-- ============================================================================

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_avatar_url TEXT;
  user_email TEXT;
BEGIN
  user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');

  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    CASE
      WHEN user_email IS NOT NULL THEN split_part(user_email, '@', 1)
      ELSE 'User'
    END
  );

  user_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NEW.raw_user_meta_data->>'photo_url'
  );

  INSERT INTO public.user_profiles (
    id,
    full_name,
    avatar_url,
    email,
    email_verified
  )
  VALUES (
    NEW.id,
    user_full_name,
    user_avatar_url,
    user_email,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    avatar_url = COALESCE(
      user_profiles.avatar_url,
      user_avatar_url
    ),
    full_name = CASE
      WHEN user_profiles.full_name IS NULL
        OR user_profiles.full_name = split_part(COALESCE(user_email, ''), '@', 1)
        OR user_profiles.full_name = 'User'
      THEN COALESCE(
        user_full_name,
        user_profiles.full_name,
        'User'
      )
      ELSE user_profiles.full_name
    END,
    email = COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', user_profiles.email),
    email_verified = CASE
      WHEN NEW.email_confirmed_at IS NOT NULL THEN true
      ELSE user_profiles.email_verified
    END,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Creates or updates user_profiles from auth.users; email uses COALESCE(NEW.email, raw_user_meta_data email) and syncs on conflict.';
