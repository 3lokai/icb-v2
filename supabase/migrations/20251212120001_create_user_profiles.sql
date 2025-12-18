-- Migration: Create user_profiles table and related tables
-- Created: 2025-12-12
-- Description: Creates user_profiles table and related preference tables for user management

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'enthusiast', 'expert')),
  preferred_brewing_methods TEXT[], -- ['pour-over', 'espresso', 'filter']
  bio TEXT,
  avatar_url TEXT,
  is_public_profile BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  newsletter_subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER ROLES TABLE (Update to reference user_profiles)
-- ============================================================================

-- Note: user_roles table already exists and references auth.users
-- We'll update it to reference user_profiles for consistency
-- This requires that a user_profile exists before a role can be assigned

-- Drop the old foreign key constraint if it exists
-- Find and drop any foreign key constraint on user_id column
DO $$
DECLARE
  constraint_name TEXT;
  constraint_ref_table TEXT;
BEGIN
  -- Find the foreign key constraint name and what it references
  SELECT conname, confrelid::regclass::text INTO constraint_name, constraint_ref_table
  FROM pg_constraint
  WHERE conrelid = 'public.user_roles'::regclass
    AND contype = 'f'
    AND conkey::text LIKE '%user_id%'
  LIMIT 1;
  
  -- Drop it if found (regardless of what it references)
  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS %I', constraint_name);
  END IF;
END $$;

-- Add new foreign key to user_profiles only if it doesn't exist
-- Since user_profiles is created above, we can safely reference it
DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.user_roles'::regclass
      AND conname = 'user_roles_user_id_fkey'
      AND contype = 'f'
  ) THEN
    ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  new_roasters BOOLEAN DEFAULT true,
  coffee_updates BOOLEAN DEFAULT true,
  newsletter BOOLEAN DEFAULT true,
  platform_updates BOOLEAN DEFAULT true,
  email_frequency TEXT CHECK (email_frequency IN ('immediately', 'daily', 'weekly', 'monthly')) DEFAULT 'weekly',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER COFFEE PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_coffee_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  roast_levels TEXT[], -- ['light', 'medium', 'dark']
  flavor_profiles TEXT[], -- ['fruity', 'nutty', 'chocolatey']
  processing_methods TEXT[], -- ['washed', 'natural', 'honey']
  regions TEXT[], -- ['coorg', 'chikmagalur', 'wayanad']
  with_milk_preference BOOLEAN,
  decaf_only BOOLEAN DEFAULT false,
  organic_only BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RATING MIGRATION TRACKING TABLE
-- ============================================================================

-- This table will be used when rating tables are created later
CREATE TABLE IF NOT EXISTS public.rating_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  coffee_ratings_migrated INTEGER DEFAULT 0,
  roaster_ratings_migrated INTEGER DEFAULT 0,
  migration_date TIMESTAMPTZ DEFAULT NOW(),
  migration_type TEXT CHECK (migration_type IN ('automatic', 'manual_claim')) DEFAULT 'automatic'
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON public.user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coffee_preferences_user_id ON public.user_coffee_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_rating_migrations_user_id ON public.rating_migrations(user_id);
CREATE INDEX IF NOT EXISTS idx_rating_migrations_ip_address ON public.rating_migrations(ip_address);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp (create if not exists)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Note: user_roles trigger may already exist, but we'll create it if not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_roles_updated_at'
  ) THEN
    CREATE TRIGGER set_user_roles_updated_at
      BEFORE UPDATE ON public.user_roles
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

CREATE TRIGGER set_user_notification_preferences_updated_at
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_coffee_preferences_updated_at
  BEFORE UPDATE ON public.user_coffee_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- TRIGGER TO AUTO-ASSIGN DEFAULT 'user' ROLE
-- ============================================================================

-- Function to automatically assign 'user' role when a profile is created
-- SECURITY DEFINER allows this function to run with the privileges of the function owner
-- This bypasses RLS, but we also need to ensure RLS policies don't cause recursion
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically assign 'user' role to new profile
  -- SECURITY DEFINER should bypass RLS, but if policies cause recursion,
  -- we need to ensure the policies are simple and don't query user_roles
  INSERT INTO public.user_roles (user_id, role, created_by)
  VALUES (NEW.id, 'user', NEW.id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run after profile insertion
DROP TRIGGER IF EXISTS on_user_profile_created ON public.user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_profiles IS 'Extended user profile information linked to auth.users';
COMMENT ON TABLE public.user_notification_preferences IS 'User notification and email preferences';
COMMENT ON TABLE public.user_coffee_preferences IS 'User coffee taste and preference settings';
COMMENT ON TABLE public.rating_migrations IS 'Tracks migration of anonymous ratings to authenticated users';

