-- Migration: Fix upsert_notification_preferences to include newsletter parameter
-- Created: 2026-01-29
-- Description: Adds newsletter parameter to upsert_notification_preferences RPC function

-- ============================================================================
-- UPDATE RPC FUNCTION: upsert_notification_preferences
-- ============================================================================

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.upsert_notification_preferences CASCADE;

CREATE OR REPLACE FUNCTION public.upsert_notification_preferences(
  p_user_id UUID,
  p_new_roasters BOOLEAN DEFAULT true,
  p_coffee_updates BOOLEAN DEFAULT true,
  p_newsletter BOOLEAN DEFAULT true,
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
    newsletter,
    platform_updates,
    email_frequency
  )
  VALUES (
    p_user_id,
    p_new_roasters,
    p_coffee_updates,
    p_newsletter,
    p_platform_updates,
    p_email_frequency
  )
  ON CONFLICT (user_id) DO UPDATE SET
    new_roasters = EXCLUDED.new_roasters,
    coffee_updates = EXCLUDED.coffee_updates,
    newsletter = EXCLUDED.newsletter,
    platform_updates = EXCLUDED.platform_updates,
    email_frequency = EXCLUDED.email_frequency,
    updated_at = NOW();
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.upsert_notification_preferences TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.upsert_notification_preferences IS 'Safely upserts user notification preferences including newsletter preference using ON CONFLICT on user_id unique constraint';
