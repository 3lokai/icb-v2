-- Migration: Fix ConvertKit subscriber ID column type
-- Created: 2026-01-10
-- Description: Changes convertkit_subscriber_id from INTEGER to BIGINT to support large ConvertKit subscriber IDs

-- ============================================================================
-- ALTER COLUMN TYPE TO BIGINT
-- ============================================================================

-- Change the column type from INTEGER to BIGINT
ALTER TABLE public.user_profiles
ALTER COLUMN convertkit_subscriber_id TYPE BIGINT;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.user_profiles.convertkit_subscriber_id IS 'ConvertKit/Kit API subscriber ID for unsubscribe operations (BIGINT to support large IDs)';

