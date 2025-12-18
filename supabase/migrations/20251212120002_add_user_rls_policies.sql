-- Migration: Add RLS policies for user management tables
-- Created: 2025-12-12
-- Description: Enables Row Level Security and creates policies for user_profiles and related tables

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coffee_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_migrations ENABLE ROW LEVEL SECURITY;

-- Note: user_roles RLS should already be configured, but we verify it's enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_roles'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- USER_PROFILES POLICIES
-- ============================================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view public profiles (if is_public_profile = true)
CREATE POLICY "Users can view public profiles"
  ON public.user_profiles FOR SELECT
  USING (is_public_profile = true);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- USER_NOTIFICATION_PREFERENCES POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.user_notification_preferences;

-- Users can view their own notification preferences
CREATE POLICY "Users can view own notification preferences"
  ON public.user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own notification preferences
CREATE POLICY "Users can insert own notification preferences"
  ON public.user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notification preferences
CREATE POLICY "Users can update own notification preferences"
  ON public.user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER_COFFEE_PREFERENCES POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own coffee preferences" ON public.user_coffee_preferences;
DROP POLICY IF EXISTS "Users can insert own coffee preferences" ON public.user_coffee_preferences;
DROP POLICY IF EXISTS "Users can update own coffee preferences" ON public.user_coffee_preferences;

-- Users can view their own coffee preferences
CREATE POLICY "Users can view own coffee preferences"
  ON public.user_coffee_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own coffee preferences
CREATE POLICY "Users can insert own coffee preferences"
  ON public.user_coffee_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own coffee preferences
CREATE POLICY "Users can update own coffee preferences"
  ON public.user_coffee_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RATING_MIGRATIONS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own rating migrations" ON public.rating_migrations;
DROP POLICY IF EXISTS "Users can insert own rating migrations" ON public.rating_migrations;
DROP POLICY IF EXISTS "Admins can view all rating migrations" ON public.rating_migrations;

-- Users can view their own rating migrations
CREATE POLICY "Users can view own rating migrations"
  ON public.rating_migrations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rating migrations
CREATE POLICY "Users can insert own rating migrations"
  ON public.rating_migrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all rating migrations
CREATE POLICY "Admins can view all rating migrations"
  ON public.rating_migrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users can view own profile" ON public.user_profiles IS 'Allows users to view their own profile';
COMMENT ON POLICY "Users can view public profiles" ON public.user_profiles IS 'Allows anyone to view profiles marked as public';
COMMENT ON POLICY "Admins can view all profiles" ON public.user_profiles IS 'Allows admins and operators to view all user profiles';

