-- Migration: Ensure trigger function can insert profiles
-- Created: 2026-01-01
-- Description: Grants necessary permissions to the handle_new_user function
--              to ensure it can insert profiles even with RLS enabled

-- ============================================================================
-- GRANT PERMISSIONS TO FUNCTION
-- ============================================================================

-- Ensure the function owner (postgres) has INSERT permissions
-- SECURITY DEFINER functions should bypass RLS, but we ensure permissions are set

-- Grant INSERT permission to the postgres role (function owner)
-- This is safe because only SECURITY DEFINER functions run as postgres
GRANT INSERT ON public.user_profiles TO postgres;
GRANT INSERT ON public.user_profiles TO service_role;

-- Ensure the function is owned by postgres (should be default, but ensure it)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Grant execute permission to authenticated role (for trigger execution)
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Note: SECURITY DEFINER functions should bypass RLS automatically,
-- but granting explicit permissions ensures it works in all cases

