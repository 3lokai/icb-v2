-- Migration: Create user_coffees table (tried/tasted list)
-- Created: 2026-02-11
-- Description: User's tried/tasted coffee list with status (logged, brewing, finished, rated).
--              Rating remains in reviews; this table tracks the lifecycle of a bag.

-- ============================================================================
-- ENUM
-- ============================================================================

CREATE TYPE public.user_coffee_status_enum AS ENUM (
  'logged',   -- added, not rated
  'brewing',
  'finished',
  'rated'
);

-- ============================================================================
-- TABLE: user_coffees
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  status public.user_coffee_status_enum NOT NULL DEFAULT 'logged',
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  photo TEXT,
  UNIQUE(user_id, coffee_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_coffees_user_id ON public.user_coffees(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coffees_coffee_id ON public.user_coffees(coffee_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.user_coffees ENABLE ROW LEVEL SECURITY;

-- Public read if profile is public OR viewer is owner
CREATE POLICY "Public read for public profiles" ON public.user_coffees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = user_coffees.user_id AND is_public_profile = true
    )
    OR user_id = auth.uid()
  );

-- Owner can manage
CREATE POLICY "Owner can manage own user coffees" ON public.user_coffees
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_coffees IS 'User''s tried/tasted coffee list with status; rating remains in reviews.';
COMMENT ON COLUMN public.user_coffees.status IS 'logged = added not rated, brewing, finished, rated';
COMMENT ON COLUMN public.user_coffees.photo IS 'Optional CDN URL (e.g. ImageKit) for user-uploaded photo of the bag/cup';
