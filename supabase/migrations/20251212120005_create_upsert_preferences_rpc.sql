-- Migration: Create RPC functions for upserting coffee and notification preferences
-- Created: 2025-12-12
-- Description: Creates server-side functions to safely upsert user preferences

-- ============================================================================
-- RPC FUNCTION: upsert_coffee_preferences
-- ============================================================================

DROP FUNCTION IF EXISTS public.upsert_coffee_preferences(
  UUID,
  TEXT[],
  TEXT[],
  TEXT[],
  TEXT[],
  BOOLEAN,
  BOOLEAN,
  BOOLEAN
);

CREATE OR REPLACE FUNCTION public.upsert_coffee_preferences(
  p_user_id UUID,
  p_roast_levels TEXT[] DEFAULT NULL,
  p_flavor_profiles TEXT[] DEFAULT NULL,
  p_processing_methods TEXT[] DEFAULT NULL,
  p_regions TEXT[] DEFAULT NULL,
  p_with_milk_preference BOOLEAN DEFAULT NULL,
  p_decaf_only BOOLEAN DEFAULT false,
  p_organic_only BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_coffee_preferences (
    user_id,
    roast_levels,
    flavor_profiles,
    processing_methods,
    regions,
    with_milk_preference,
    decaf_only,
    organic_only
  )
  VALUES (
    p_user_id,
    p_roast_levels,
    p_flavor_profiles,
    p_processing_methods,
    p_regions,
    p_with_milk_preference,
    p_decaf_only,
    p_organic_only
  )
  ON CONFLICT (user_id) DO UPDATE SET
    roast_levels = EXCLUDED.roast_levels,
    flavor_profiles = EXCLUDED.flavor_profiles,
    processing_methods = EXCLUDED.processing_methods,
    regions = EXCLUDED.regions,
    with_milk_preference = EXCLUDED.with_milk_preference,
    decaf_only = EXCLUDED.decaf_only,
    organic_only = EXCLUDED.organic_only,
    updated_at = NOW();
END;
$$;

-- ============================================================================
-- RPC FUNCTION: upsert_notification_preferences
-- ============================================================================

DROP FUNCTION IF EXISTS public.upsert_notification_preferences(
  UUID,
  BOOLEAN,
  BOOLEAN,
  BOOLEAN,
  TEXT
);

CREATE OR REPLACE FUNCTION public.upsert_notification_preferences(
  p_user_id UUID,
  p_new_roasters BOOLEAN DEFAULT true,
  p_coffee_updates BOOLEAN DEFAULT true,
  p_platform_updates BOOLEAN DEFAULT true,
  p_email_frequency TEXT DEFAULT 'weekly'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_notification_preferences (
    user_id,
    new_roasters,
    coffee_updates,
    platform_updates,
    email_frequency
  )
  VALUES (
    p_user_id,
    p_new_roasters,
    p_coffee_updates,
    p_platform_updates,
    p_email_frequency
  )
  ON CONFLICT (user_id) DO UPDATE SET
    new_roasters = EXCLUDED.new_roasters,
    coffee_updates = EXCLUDED.coffee_updates,
    platform_updates = EXCLUDED.platform_updates,
    email_frequency = EXCLUDED.email_frequency,
    updated_at = NOW();
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.upsert_coffee_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_notification_preferences TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.upsert_coffee_preferences IS 'Safely upserts user coffee preferences using ON CONFLICT on user_id unique constraint';
COMMENT ON FUNCTION public.upsert_notification_preferences IS 'Safely upserts user notification preferences using ON CONFLICT on user_id unique constraint';

