-- Migration: Add reviews.featured + get_featured_reviews RPC
-- Created: 2026-07-20
-- Description: Powers the homepage "Fresh from the community" section — surfaces
--              signed-in reviewers' written comments as pull-quote cards, plus
--              directory-wide rating totals. One RPC returns both the featured rows
--              and the aggregate counts so the homepage pays a single round trip.

-- ============================================================================
-- 1. featured flag (manual editorial override for ordering)
-- ============================================================================

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- No index: the qualifying pool is tiny (a few dozen text reviews). Add a partial
-- index WHERE featured only if the review volume ever grows large.

-- ============================================================================
-- 2. FUNCTION: get_featured_reviews
-- ============================================================================
-- SECURITY DEFINER: reads user_profiles display fields the anon role has no direct
-- SELECT grant on (matches the sibling get_top_coffee_reviewers RPC). Only public,
-- display-safe fields are returned. Public-readable, so no REVOKE FROM PUBLIC.

DROP FUNCTION IF EXISTS public.get_featured_reviews(int);

CREATE OR REPLACE FUNCTION public.get_featured_reviews(p_limit int default 3)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'reviews', coalesce((
      SELECT jsonb_agg(r ORDER BY r.featured DESC, r.created_at DESC)
      FROM (
        SELECT
          rv.id,
          rv.rating,
          rv.comment,
          rv.brew_method,
          rv.created_at,
          rv.featured,
          coalesce(c.display_name, c.name) AS coffee_name,
          c.slug                           AS coffee_slug,
          ro.slug                          AS roaster_slug,
          up.username,
          up.avatar_url,
          (
            SELECT count(*)::int
            FROM latest_reviews_per_identity l
            WHERE l.user_id = rv.user_id
              AND l.entity_type = 'coffee'
          )                                AS reviewer_coffee_count
        FROM reviews rv
        JOIN coffees c        ON c.id = rv.entity_id
        JOIN roasters ro      ON ro.id = c.roaster_id
        JOIN user_profiles up ON up.id = rv.user_id
        WHERE rv.status = 'active'
          AND rv.entity_type = 'coffee'
          AND rv.user_id IS NOT NULL
          AND char_length(btrim(rv.comment)) > 10
          AND (rv.featured OR rv.created_at > now() - interval '90 days')
        ORDER BY rv.featured DESC, rv.created_at DESC
        LIMIT greatest(coalesce(p_limit, 3), 0)
      ) r
    ), '[]'::jsonb),
    'total_ratings', (
      SELECT count(*)::int
      FROM latest_reviews_per_identity
      WHERE entity_type = 'coffee'
    ),
    'ratings_last_30d', (
      SELECT count(*)::int
      FROM latest_reviews_per_identity
      WHERE entity_type = 'coffee'
        AND created_at > now() - interval '30 days'
    )
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_featured_reviews(int)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_featured_reviews(int) IS
  'Homepage "Fresh from the community": returns a jsonb object with a featured-first
   array of signed-in coffee reviews that have real comment text (trimmed length > 10)
   from the last 90 days (featured=true bypasses the window), plus directory-wide
   coffee rating totals (all-time and last 30 days) from latest_reviews_per_identity.';
