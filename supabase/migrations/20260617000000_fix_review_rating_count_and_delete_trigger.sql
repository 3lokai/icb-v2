-- Migration: Fix rating count logic and add DELETE trigger
-- Description:
--   1. Fix update_coffee_ratings_for_entity() to use COUNT(rating) instead of COUNT(*)
--   2. Fix update_roaster_ratings_for_entity() same fix
--   3. Add missing AFTER DELETE trigger on reviews
--   4. Recalculate all coffee and roaster ratings
--   5. Refresh coffee_directory_mv

-- ============================================================================
-- PART 1: Fix update_coffee_ratings_for_entity()
-- COUNT(*) was counting null-rating reviews toward rating_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_coffee_ratings_for_entity(p_entity_id UUID)
RETURNS VOID AS $$
DECLARE
  v_rating_count INTEGER;
  v_avg_rating NUMERIC;
BEGIN
  SELECT
    COUNT(rating)::INTEGER,
    ROUND(AVG(rating)::numeric, 2)
  INTO v_rating_count, v_avg_rating
  FROM latest_reviews_per_identity
  WHERE entity_type = 'coffee' AND entity_id = p_entity_id;

  UPDATE coffees
  SET
    rating_avg = v_avg_rating,
    rating_count = COALESCE(v_rating_count, 0)
  WHERE id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 2: Fix update_roaster_ratings_for_entity()
-- Same COUNT(*) bug for total_ratings_count
-- recommend_percentage denominator stays COUNT(*) — recommend is valid without a rating
-- ============================================================================

CREATE OR REPLACE FUNCTION update_roaster_ratings_for_entity(p_entity_id UUID)
RETURNS VOID AS $$
DECLARE
  v_rating_count INTEGER;
  v_avg_rating NUMERIC;
  v_recommend_pct NUMERIC;
BEGIN
  SELECT
    COUNT(rating)::INTEGER,
    ROUND(AVG(rating)::numeric, 2),
    ROUND(
      (COUNT(*) FILTER (WHERE recommend = true)::numeric / NULLIF(COUNT(*), 0)) * 100,
      2
    )
  INTO v_rating_count, v_avg_rating, v_recommend_pct
  FROM latest_reviews_per_identity
  WHERE entity_type = 'roaster' AND entity_id = p_entity_id;

  UPDATE roasters
  SET
    avg_rating = v_avg_rating,
    total_ratings_count = v_rating_count,
    recommend_percentage = v_recommend_pct,
    ratings_updated_at = NOW()
  WHERE id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 3: Add DELETE trigger
-- Hard deletes were invisible — no trigger recalculated ratings
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_update_ratings_on_delete ON public.reviews;
CREATE TRIGGER trigger_update_ratings_on_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_entity_ratings();

-- ============================================================================
-- PART 4: One-time recalculation of all ratings
-- ============================================================================

-- Recalculate all coffees that have reviews
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT DISTINCT entity_id FROM latest_reviews_per_identity WHERE entity_type = 'coffee'
  LOOP
    PERFORM update_coffee_ratings_for_entity(r.entity_id);
  END LOOP;
END $$;

-- Recalculate all roasters that have reviews
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT DISTINCT entity_id FROM latest_reviews_per_identity WHERE entity_type = 'roaster'
  LOOP
    PERFORM update_roaster_ratings_for_entity(r.entity_id);
  END LOOP;
END $$;

-- Zero out coffees with stale counts but no remaining reviews
UPDATE coffees SET rating_avg = NULL, rating_count = 0
WHERE rating_count > 0
  AND id NOT IN (SELECT entity_id FROM latest_reviews_per_identity WHERE entity_type = 'coffee');

-- Zero out roasters with stale counts but no remaining reviews
UPDATE roasters SET avg_rating = NULL, total_ratings_count = 0, recommend_percentage = NULL
WHERE total_ratings_count > 0
  AND id NOT IN (SELECT entity_id FROM latest_reviews_per_identity WHERE entity_type = 'roaster');

-- ============================================================================
-- PART 5: Refresh materialized view to pick up corrected counts
-- ============================================================================

REFRESH MATERIALIZED VIEW CONCURRENTLY coffee_directory_mv;
