-- Migration: Add ConvertKit subscriber ID to user_profiles
-- Created: 2026-01-10
-- Description: Adds convertkit_subscriber_id column to store ConvertKit subscriber ID for unsubscribe operations

-- ============================================================================
-- ADD CONVERTKIT SUBSCRIBER ID COLUMN
-- ============================================================================

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS convertkit_subscriber_id BIGINT;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.user_profiles.convertkit_subscriber_id IS 'ConvertKit/Kit API subscriber ID for unsubscribe operations (BIGINT to support large IDs)';

