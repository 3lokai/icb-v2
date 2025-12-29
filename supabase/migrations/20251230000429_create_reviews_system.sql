-- Migration: Create reviews system
-- Created: 2025-12-30
-- Description: Implements comprehensive review system for coffees and roasters with immutable history pattern.
-- Supports both authenticated users and anonymous users (via cookie/localStorage).
-- All edits create new review rows; views automatically pick latest by created_at DESC.

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE review_entity_type AS ENUM ('coffee', 'roaster');
CREATE TYPE review_status AS ENUM ('active', 'deleted', 'flagged');

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  -- Core fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type review_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  
  -- User references (at least one must be NOT NULL - enforced by CHECK constraint)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id UUID,
  CONSTRAINT reviews_identity_required CHECK (user_id IS NOT NULL OR anon_id IS NOT NULL),
  
  -- Review content
  recommend BOOLEAN,
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  value_for_money BOOLEAN,
  works_with_milk BOOLEAN, -- null = unknown, true = works with milk, false = better black
  brew_method grind_enum, -- Uses existing grind_enum
  comment TEXT,
  
  -- Status and timestamps
  status review_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Partial index for active reviews (most queries only care about active)
CREATE INDEX IF NOT EXISTS idx_reviews_entity_lookup_active ON public.reviews(entity_type, entity_id, created_at DESC) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id, created_at DESC) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_anon_id ON public.reviews(anon_id, created_at DESC) WHERE anon_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON public.reviews(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating) WHERE rating IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Latest review per identity (this is the public truth)
-- Uses DISTINCT ON to get latest active review per (entity_type, entity_id, identity_key)
CREATE OR REPLACE VIEW latest_reviews_per_identity AS
SELECT DISTINCT ON (
  entity_type, 
  entity_id, 
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text)
)
  *,
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text) AS identity_key
FROM public.reviews
WHERE status = 'active'
ORDER BY 
  entity_type, 
  entity_id, 
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text),
  created_at DESC;

-- Entity review stats (aggregated from latest reviews)
CREATE OR REPLACE VIEW entity_review_stats AS
SELECT 
  entity_type,
  entity_id,
  COUNT(*) as review_count,  -- Total latest reviews (includes reviews without ratings)
  COUNT(rating) as rating_count,  -- Count of reviews with non-NULL ratings
  ROUND(AVG(rating)::numeric, 2) as avg_rating,  -- Ignores NULLs automatically
  ROUND(
    (COUNT(*) FILTER (WHERE recommend = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 
    2
  ) as recommend_pct,
  MAX(created_at) as last_review_at,
  NOW() as updated_at
FROM latest_reviews_per_identity
GROUP BY entity_type, entity_id;

-- ============================================================================
-- TRIGGER FUNCTIONS FOR RATING UPDATES
-- ============================================================================

-- Helper function for coffee-specific rating updates (used by main trigger)
CREATE OR REPLACE FUNCTION update_coffee_ratings_for_entity(p_entity_id UUID)
RETURNS VOID AS $$
DECLARE
  v_review_count INTEGER;
  v_avg_rating NUMERIC;
BEGIN
  SELECT 
    COUNT(*)::INTEGER,
    ROUND(AVG(rating)::numeric, 2)
  INTO v_review_count, v_avg_rating
  FROM latest_reviews_per_identity
  WHERE entity_type = 'coffee' AND entity_id = p_entity_id;
  
  UPDATE coffees
  SET 
    rating_avg = v_avg_rating,
    rating_count = COALESCE(v_review_count, 0)
  WHERE id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function for roaster-specific rating updates (used by main trigger)
CREATE OR REPLACE FUNCTION update_roaster_ratings_for_entity(p_entity_id UUID)
RETURNS VOID AS $$
DECLARE
  v_review_count INTEGER;
  v_avg_rating NUMERIC;
  v_recommend_pct NUMERIC;
BEGIN
  SELECT 
    COUNT(*)::INTEGER,
    ROUND(AVG(rating)::numeric, 2),
    ROUND(
      (COUNT(*) FILTER (WHERE recommend = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 
      2
    )
  INTO v_review_count, v_avg_rating, v_recommend_pct
  FROM latest_reviews_per_identity
  WHERE entity_type = 'roaster' AND entity_id = p_entity_id;
  
  UPDATE roasters
  SET 
    avg_rating = v_avg_rating,
    total_ratings_count = v_review_count,
    recommend_percentage = v_recommend_pct,
    ratings_updated_at = NOW()
  WHERE id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update coffee ratings (wrapper for trigger)
CREATE OR REPLACE FUNCTION update_coffee_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_entity_id UUID;
BEGIN
  -- Get entity_id from NEW or OLD
  v_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  
  -- Only process if entity_type is 'coffee'
  IF COALESCE(NEW.entity_type, OLD.entity_type) = 'coffee' THEN
    PERFORM update_coffee_ratings_for_entity(v_entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update roaster ratings (wrapper for trigger)
CREATE OR REPLACE FUNCTION update_roaster_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_entity_id UUID;
BEGIN
  -- Get entity_id from NEW or OLD
  v_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  
  -- Only process if entity_type is 'roaster'
  IF COALESCE(NEW.entity_type, OLD.entity_type) = 'roaster' THEN
    PERFORM update_roaster_ratings_for_entity(v_entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Unified function that routes to appropriate handler
-- Handles INSERT (new reviews and edits) and UPDATE (soft delete only)
-- Note: Edits create new INSERTs, so UPDATE only fires for status changes (soft delete)
CREATE OR REPLACE FUNCTION update_entity_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_old_entity_id UUID;
  v_new_entity_id UUID;
  v_entity_type TEXT;
BEGIN
  -- Get entity IDs
  v_old_entity_id := OLD.entity_id;
  v_new_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  v_entity_type := COALESCE(NEW.entity_type, OLD.entity_type);
  
  -- For UPDATE: only recalc if status changed (soft delete)
  -- Rating/recommend changes don't happen via UPDATE (edits are new INSERTs)
  IF TG_OP = 'UPDATE' THEN
    -- Early exit: if status didn't change, skip (trigger WHEN clause should prevent this, but be safe)
    IF OLD.status = NEW.status THEN
      RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- If status changed but review was not active before and still not active, skip
    IF OLD.status != 'active' AND NEW.status != 'active' THEN
      RETURN COALESCE(NEW, OLD);
    END IF;
  END IF;
  
  -- Handle entity_id changes: recalc both OLD and NEW entity
  IF TG_OP = 'UPDATE' AND OLD.entity_id IS DISTINCT FROM NEW.entity_id THEN
    -- Recalc OLD entity (review was removed from it)
    IF v_entity_type = 'coffee' THEN
      PERFORM update_coffee_ratings_for_entity(v_old_entity_id);
    ELSIF v_entity_type = 'roaster' THEN
      PERFORM update_roaster_ratings_for_entity(v_old_entity_id);
    END IF;
    
    -- Recalc NEW entity (review was added to it)
    IF v_entity_type = 'coffee' THEN
      PERFORM update_coffee_ratings_for_entity(v_new_entity_id);
    ELSIF v_entity_type = 'roaster' THEN
      PERFORM update_roaster_ratings_for_entity(v_new_entity_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Normal case: recalc single entity
  IF v_entity_type = 'coffee' THEN
    PERFORM update_coffee_ratings_for_entity(v_new_entity_id);
  ELSIF v_entity_type = 'roaster' THEN
    PERFORM update_roaster_ratings_for_entity(v_new_entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES (READ-ONLY)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read: Anyone can read active reviews
CREATE POLICY "Public can read active reviews"
  ON public.reviews FOR SELECT
  USING (status = 'active');

-- NOTE: NO INSERT/UPDATE RLS POLICIES
-- All writes go through server actions using service role client (bypasses RLS)
-- 
-- Why? Supabase clients don't reliably set custom session variables from browser.
-- Attempting to use current_setting('app.anon_id') in RLS will fail at 1am when
-- users try to edit their reviews.
--
-- Server-side enforcement (in Next.js server actions):
-- 1. Server receives anon_id from cookie/localStorage (sent by client)
-- 2. Server uses service role client (bypasses RLS)
-- 3. Server validates: anon_id matches value sent from client
-- 4. Server validates: user_id matches auth.uid() if logged in
-- 5. Server performs INSERT/UPDATE only if identity matches
--
-- This is clean, realistic, and prevents identity matching failures.

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for updated_at timestamp
DROP TRIGGER IF EXISTS set_reviews_updated_at ON public.reviews;
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Triggers to update entity ratings
DROP TRIGGER IF EXISTS trigger_update_ratings_on_insert ON public.reviews;
CREATE TRIGGER trigger_update_ratings_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_entity_ratings();

DROP TRIGGER IF EXISTS trigger_update_ratings_on_update ON public.reviews;
CREATE TRIGGER trigger_update_ratings_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_entity_ratings();
  -- Note: Only fires on status changes (soft delete)
  -- Rating/recommend changes don't happen via UPDATE (edits are new INSERTs)

-- Note: Soft delete handled by status change, so DELETE trigger not needed
-- If hard deletes are ever needed, add:
-- CREATE TRIGGER trigger_update_ratings_on_delete
--   AFTER DELETE ON public.reviews
--   FOR EACH ROW
--   EXECUTE FUNCTION update_entity_ratings();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.reviews IS 'Review system for coffees and roasters. Supports both authenticated users and anonymous users. Uses immutable history pattern - all edits create new review rows.';
COMMENT ON COLUMN public.reviews.entity_type IS 'Type of entity being reviewed: coffee or roaster';
COMMENT ON COLUMN public.reviews.entity_id IS 'UUID of the coffee or roaster being reviewed';
COMMENT ON COLUMN public.reviews.user_id IS 'Authenticated user ID (nullable, references auth.users)';
COMMENT ON COLUMN public.reviews.anon_id IS 'Anonymous user identifier from cookie/localStorage (nullable)';
COMMENT ON COLUMN public.reviews.recommend IS 'Whether user recommends the entity';
COMMENT ON COLUMN public.reviews.rating IS 'Rating value from 1-5 (nullable)';
COMMENT ON COLUMN public.reviews.value_for_money IS 'Value for money rating (nullable)';
COMMENT ON COLUMN public.reviews.works_with_milk IS 'Coffee-only field: null = unknown, true = works with milk, false = better black';
COMMENT ON COLUMN public.reviews.brew_method IS 'Brew method used (uses existing grind_enum, nullable)';
COMMENT ON COLUMN public.reviews.comment IS 'Review text content (nullable)';
COMMENT ON COLUMN public.reviews.status IS 'Review status: active, deleted, or flagged';
COMMENT ON VIEW latest_reviews_per_identity IS 'Latest active review per (entity_type, entity_id, identity). This is the public truth - only latest review per identity is shown.';
COMMENT ON VIEW entity_review_stats IS 'Aggregated statistics computed from latest active reviews per entity. Includes review_count, rating_count, avg_rating, recommend_pct, and last_review_at.';

