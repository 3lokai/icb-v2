-- Migration: Create wishlists table ("want to try" list)
-- Created: 2026-07-15
-- Description: Auth users save coffees they want to try (heart on card / "Add to Wishlist"
--              on the coffee page). Distinct from user_coffees (tried/tasted lifecycle);
--              kept separate so a coffee can be both wishlisted and later logged.

-- ============================================================================
-- TABLE: wishlists
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, coffee_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_coffee_id ON public.wishlists(coffee_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Public read if profile is public OR viewer is owner
CREATE POLICY "Public read for public profiles" ON public.wishlists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = wishlists.user_id AND is_public_profile = true
    )
    OR user_id = auth.uid()
  );

-- Owner can manage
CREATE POLICY "Owner can manage own wishlist" ON public.wishlists
  FOR ALL USING (user_id = auth.uid());

COMMENT ON TABLE public.wishlists IS 'Coffees an auth user wants to try; separate from user_coffees (tried/tasted).';
