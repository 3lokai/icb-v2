-- Migration: Fix user_roles RLS policies to prevent infinite recursion
-- Created: 2025-12-12
-- Description: Adds proper RLS policies for user_roles table to allow trigger function to insert roles

-- ============================================================================
-- USER_ROLES RLS POLICIES
-- ============================================================================

-- Drop ALL existing policies on user_roles to start fresh
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', r.policyname);
  END LOOP;
END $$;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own role (for the trigger function)
-- This allows the SECURITY DEFINER function to insert roles
CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: We're NOT creating an "Admins can view all roles" policy here
-- because it would cause infinite recursion (checking user_roles from within user_roles)
-- Admins can still view roles through the user_profiles policy if needed
-- For now, we keep it simple to avoid recursion

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users can view own roles" ON public.user_roles IS 'Allows users to view their own roles';
COMMENT ON POLICY "Users can insert own role" ON public.user_roles IS 'Allows users to insert their own role (used by trigger function)';

