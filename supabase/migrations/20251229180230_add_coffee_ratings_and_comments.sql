-- Migration: Add Coffee Ratings and Comments
-- Created: 2025-12-29
-- Description: Creates coffee_reviews table for user ratings and comments, and adds triggers to update coffee stats

BEGIN;

-- ============================================================================
-- COFFEE REVIEWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coffee_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    brew_method_id UUID REFERENCES public.brew_methods(id) ON DELETE SET NULL,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coffee_id, user_id)
);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE public.coffee_reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Everyone can view coffee reviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'coffee_reviews' 
        AND policyname = 'Anyone can view coffee reviews'
    ) THEN
        CREATE POLICY "Anyone can view coffee reviews"
            ON public.coffee_reviews FOR SELECT
            USING (true);
    END IF;
END $$;

-- Authenticated users can create their own reviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'coffee_reviews' 
        AND policyname = 'Users can create own coffee review'
    ) THEN
        CREATE POLICY "Users can create own coffee review"
            ON public.coffee_reviews FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Users can update their own reviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'coffee_reviews' 
        AND policyname = 'Users can update own coffee review'
    ) THEN
        CREATE POLICY "Users can update own coffee review"
            ON public.coffee_reviews FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Users can delete their own reviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'coffee_reviews' 
        AND policyname = 'Users can delete own coffee review'
    ) THEN
        CREATE POLICY "Users can delete own coffee review"
            ON public.coffee_reviews FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Admins and operators can manage all reviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'coffee_reviews' 
        AND policyname = 'Admins can manage all coffee reviews'
    ) THEN
        CREATE POLICY "Admins can manage all coffee reviews"
            ON public.coffee_reviews FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_roles
                    WHERE user_id = auth.uid()
                    AND role IN ('admin', 'operator')
                )
            );
    END IF;
END $$;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_coffee_reviews_coffee_id ON public.coffee_reviews(coffee_id);
CREATE INDEX IF NOT EXISTS idx_coffee_reviews_user_id ON public.coffee_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_reviews_rating ON public.coffee_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_coffee_reviews_created_at ON public.coffee_reviews(created_at);

-- ============================================================================
-- TRIGGER: UPDATE COFFEE STATS
-- ============================================================================

-- Function to update coffee rating_avg and rating_count
CREATE OR REPLACE FUNCTION public.handle_coffee_review_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_coffee_id UUID;
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        v_coffee_id := NEW.coffee_id;
    ELSE
        v_coffee_id := OLD.coffee_id;
    END IF;

    UPDATE public.coffees
    SET 
        rating_avg = (
            SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
            FROM public.coffee_reviews 
            WHERE coffee_id = v_coffee_id
        ),
        rating_count = (
            SELECT COUNT(*) 
            FROM public.coffee_reviews 
            WHERE coffee_id = v_coffee_id
        ),
        updated_at = NOW()
    WHERE id = v_coffee_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_coffee_review_change ON public.coffee_reviews;
CREATE TRIGGER on_coffee_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.coffee_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_coffee_review_changes();

-- ============================================================================
-- TRIGGER: UPDATED_AT
-- ============================================================================

-- Note: handle_updated_at() should already exist from previous migrations
DROP TRIGGER IF EXISTS set_coffee_reviews_updated_at ON public.coffee_reviews;
CREATE TRIGGER set_coffee_reviews_updated_at
    BEFORE UPDATE ON public.coffee_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.coffee_reviews IS 'User ratings and comments for individual coffees';
COMMENT ON COLUMN public.coffee_reviews.rating IS 'User rating from 1 to 5 stars';
COMMENT ON COLUMN public.coffee_reviews.content IS 'The text comment or review content';
COMMENT ON COLUMN public.coffee_reviews.brew_method_id IS 'The brew method used by the user when testing this coffee';
COMMENT ON COLUMN public.coffee_reviews.is_verified_purchase IS 'Whether the user is verified to have purchased this coffee';

COMMIT;
