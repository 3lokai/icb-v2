-- Migration: Fix upsert_user_profile to include username and bio parameters
-- Created: 2026-01-29
-- Description: Adds username and bio parameters to upsert_user_profile RPC function

-- ============================================================================
-- UPDATE RPC FUNCTION: upsert_user_profile
-- ============================================================================

-- Drop the function if it exists
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
BEGIN
  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE user_profiles.id = p_user_id) INTO v_exists;
  
  IF v_exists THEN
    -- Update existing profile (only update fields that are provided)
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
    -- Insert new profile
    -- Note: email will be synced from auth.users via the trigger
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
      show_location
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
      COALESCE(p_show_location, true)
    );
  END IF;
  
  -- Return the profile (including email)
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.upsert_user_profile TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.upsert_user_profile IS 'Safely upserts a user profile with support for username, bio, and privacy settings. Only updates fields that are explicitly provided (non-null).';
