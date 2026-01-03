-- Migration: Grant permissions for reviews view
-- Created: 2026-01-02
-- Description: Ensures authenticated users can query the latest_reviews_per_identity view
--              to see their own reviews in the dashboard

-- ============================================================================
-- GRANT PERMISSIONS ON VIEW
-- ============================================================================

-- Grant SELECT permission on the view to authenticated users
GRANT SELECT ON public.latest_reviews_per_identity TO authenticated;
GRANT SELECT ON public.latest_reviews_per_identity TO anon;

-- Also ensure the underlying reviews table has proper permissions
-- (should already exist, but ensure it's set)
GRANT SELECT ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;

-- Grant SELECT permission on entity tables for entity lookup
-- Users need to read coffees and roasters to see entity names/slugs in their reviews
GRANT SELECT ON public.coffees TO authenticated;
GRANT SELECT ON public.coffees TO anon;
GRANT SELECT ON public.roasters TO authenticated;
GRANT SELECT ON public.roasters TO anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW public.latest_reviews_per_identity IS 'Latest active review per (entity_type, entity_id, identity). This is the public truth - only latest review per identity is shown. Grants SELECT to authenticated and anon roles.';
