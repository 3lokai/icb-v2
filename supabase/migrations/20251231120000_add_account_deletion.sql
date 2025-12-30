-- Migration: Add account deletion support
-- Created: 2025-12-31
-- Description: Adds deleted_at column to user_profiles table and updates RLS policies to exclude deleted users

-- ============================================================================
-- ADD deleted_at COLUMN
-- ============================================================================

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ============================================================================
-- INDEX FOR EFFICIENT QUERIES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_deleted_at 
ON public.user_profiles(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- UPDATE RLS POLICIES
-- ============================================================================

-- Update "Users can view public profiles" policy to exclude deleted users
DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profiles;

CREATE POLICY "Users can view public profiles"
  ON public.user_profiles FOR SELECT
  USING (is_public_profile = true AND deleted_at IS NULL);

-- ============================================================================
-- FUNCTION: Anonymize user reviews before account deletion
-- ============================================================================

-- Function to set anon_id on reviews before user deletion
-- This prevents CHECK constraint violation when user_id is set to NULL
CREATE OR REPLACE FUNCTION public.anonymize_user_reviews(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE reviews 
  SET anon_id = gen_random_uuid() 
  WHERE user_id = p_user_id AND anon_id IS NULL;
END;
$$;

COMMENT ON FUNCTION public.anonymize_user_reviews(UUID) IS 'Sets anon_id on all reviews for a user before account deletion to prevent CHECK constraint violation';

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.user_profiles.deleted_at IS 'Timestamp when account was deleted. NULL means account is active.';

