-- Migration: Update user_role_enum to include contributor and roaster
-- Created: 2025-12-12
-- Description: Adds 'contributor' and 'roaster' roles to the existing user_role_enum

-- ============================================================================
-- UPDATE ENUM
-- ============================================================================

-- Add new roles to existing enum
-- Note: PostgreSQL doesn't support IF NOT EXISTS for ALTER TYPE ADD VALUE
-- We'll use a DO block to check if the value exists first

DO $$
BEGIN
  -- Add 'contributor' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'contributor' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role_enum')
  ) THEN
    ALTER TYPE public.user_role_enum ADD VALUE 'contributor';
  END IF;

  -- Add 'roaster' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'roaster' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role_enum')
  ) THEN
    ALTER TYPE public.user_role_enum ADD VALUE 'roaster';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify enum values: admin, operator, user, viewer, contributor, roaster
-- This query can be run manually to verify:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role_enum') ORDER BY enumsortorder;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TYPE public.user_role_enum IS 'User role enumeration. Values: admin, operator, user, viewer, contributor, roaster';

