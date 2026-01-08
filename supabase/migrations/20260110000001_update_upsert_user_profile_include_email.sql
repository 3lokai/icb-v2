-- Migration: Update upsert_user_profile RPC to include email in return
-- Created: 2026-01-10
-- Description: Adds email column to the return table of upsert_user_profile function

-- ============================================================================
-- UPDATE RPC FUNCTION: upsert_user_profile
-- ============================================================================

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.upsert_user_profile CASCADE;

CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_experience_level TEXT DEFAULT NULL,
  p_preferred_brewing_methods TEXT[] DEFAULT NULL,
  p_onboarding_completed BOOLEAN DEFAULT false,
  p_newsletter_subscribed BOOLEAN DEFAULT true
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
    -- Update existing profile
    UPDATE public.user_profiles
    SET
      full_name = p_full_name,
      city = p_city,
      state = p_state,
      country = p_country,
      gender = p_gender,
      experience_level = p_experience_level,
      preferred_brewing_methods = p_preferred_brewing_methods,
      onboarding_completed = p_onboarding_completed,
      newsletter_subscribed = p_newsletter_subscribed,
      updated_at = NOW()
    WHERE user_profiles.id = p_user_id;
  ELSE
    -- Insert new profile
    -- Note: email will be synced from auth.users via the trigger
    INSERT INTO public.user_profiles (
      id,
      full_name,
      city,
      state,
      country,
      gender,
      experience_level,
      preferred_brewing_methods,
      onboarding_completed,
      newsletter_subscribed
    )
    VALUES (
      p_user_id,
      p_full_name,
      p_city,
      p_state,
      p_country,
      p_gender,
      p_experience_level,
      p_preferred_brewing_methods,
      p_onboarding_completed,
      p_newsletter_subscribed
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

COMMENT ON FUNCTION public.upsert_user_profile IS 'Safely upserts a user profile, handling both insert and update cases. Email is synced from auth.users via trigger and included in the return table.';

