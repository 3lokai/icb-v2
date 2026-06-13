-- Migration: Create get_top_coffee_reviewers RPC function
-- Created: 2026-06-13
-- Description: Ranks public profiles by the number of their *authenticated* (user_id-backed)
--              active coffee reviews, drawn from latest_reviews_per_identity (one row per
--              identity per entity). Powers the homepage "Top Profiles" section.
--              Only public, non-deleted, username-having profiles are exposed, and only
--              non-sensitive display fields are returned.

-- ============================================================================
-- FUNCTION: get_top_coffee_reviewers
-- ============================================================================

DROP FUNCTION IF EXISTS public.get_top_coffee_reviewers(int);

CREATE OR REPLACE FUNCTION public.get_top_coffee_reviewers(p_limit int default 6)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    jsonb_agg(t ORDER BY t.review_count DESC, t.last_review_at DESC NULLS LAST),
    '[]'::jsonb
  )
  FROM (
    SELECT
      up.id,
      up.username,
      up.full_name,
      up.avatar_url,
      up.bio,
      up.city,
      up.state,
      up.country,
      up.show_location,
      up.preferred_brewing_methods,
      count(lr.id)::int           AS review_count,
      max(lr.created_at)          AS last_review_at
    FROM user_profiles up
    JOIN latest_reviews_per_identity lr
      ON lr.user_id = up.id
     AND lr.entity_type = 'coffee'
     AND lr.status = 'active'
    WHERE up.is_public_profile = true
      AND up.deleted_at IS NULL
      AND up.username IS NOT NULL
    GROUP BY up.id
    HAVING count(lr.id) > 0
    ORDER BY review_count DESC, last_review_at DESC NULLS LAST
    LIMIT greatest(coalesce(p_limit, 6), 0)
  ) t;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_coffee_reviewers(int)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_top_coffee_reviewers(int) IS
  'Top public profiles ranked by count of their authenticated (user_id) active coffee reviews
   in latest_reviews_per_identity. Returns a jsonb array of display-safe profile fields for the
   homepage Top Profiles section.';
