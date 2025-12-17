-- Migration: User Management Setup
-- Created: 2025-12-09
-- Description: Initial migration for user management tables, views, and RPCs

-- ============================================================================
-- TABLES
-- ============================================================================

-- Example: Create a users table (if not using Supabase Auth users table)
-- Uncomment and modify as needed:
/*
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);
*/

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Example: Create a view for user summaries
/*
CREATE OR REPLACE VIEW public.user_summary AS
SELECT 
  u.id,
  u.email,
  up.username,
  up.full_name,
  up.avatar_url,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id;
*/

-- ============================================================================
-- FUNCTIONS / RPCs
-- ============================================================================

-- Example: Create an RPC function
/*
CREATE OR REPLACE FUNCTION public.get_user_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.username,
    up.full_name,
    up.avatar_url
  FROM public.user_profiles up
  WHERE up.id = p_user_id;
END;
$$;
*/

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Example: Create indexes for better query performance
/*
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
*/

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Example: Create a trigger to update updated_at timestamp
/*
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
*/

