-- Quick Fix: Remove infinite recursion in user_roles RLS policies
-- Run this in Supabase Dashboard > SQL Editor to fix the issue immediately

-- ============================================================================
-- STEP 1: Drop ALL existing policies on user_roles
-- ============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_roles'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', r.policyname);
  END LOOP;
END $$;

-- ============================================================================
-- STEP 2: Create simple policies that don't cause recursion
-- ============================================================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own role (allows trigger function to work)
CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STEP 3: Verify the fix
-- ============================================================================

-- Check that policies are created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'user_roles'
ORDER BY policyname;

