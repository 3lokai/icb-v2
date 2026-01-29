-- Migration: Create profile tables
-- Created: 2026-01-29
-- Description: Creates gear catalog, user gear, station photos, and taste profile cache tables for user profiles.
-- Also adds constraint to enforce "recommend requires rating" on reviews table.

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- ALTER EXISTING TABLES
-- ============================================================================

-- Clean up existing data that violates the constraint
-- Set recommend = false for rows where recommend = true but:
--   - rating IS NULL, OR
--   - entity_type != 'coffee'
UPDATE public.reviews
SET recommend = false
WHERE recommend = true
  AND (rating IS NULL OR entity_type != 'coffee');

-- Enforce "recommend requires rating" constraint
-- Prevents drive-by recommends without a rating
ALTER TABLE public.reviews ADD CONSTRAINT reviews_recommend_requires_rating
  CHECK (recommend IS NOT TRUE OR (rating IS NOT NULL AND entity_type = 'coffee'));

-- ============================================================================
-- GEAR CATALOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gear_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name CITEXT NOT NULL UNIQUE,           -- Case-insensitive canonical name
  category TEXT NOT NULL CHECK (category IN ('grinder', 'brewer', 'accessory')),
  brand TEXT,                            -- "Comandante"
  model TEXT,                            -- "C40 MK4"
  image_url TEXT,                        -- Optional product image
  is_verified BOOLEAN DEFAULT false,     -- Admin-verified entries
  usage_count INT DEFAULT 0 CHECK (usage_count >= 0),  -- Clamped at 0
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- Correct FK to auth.users
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER GEAR TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_gear (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  gear_id UUID NOT NULL REFERENCES public.gear_catalog(id) ON DELETE CASCADE,
  notes TEXT,                            -- Personal notes ("My daily driver")
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, gear_id)               -- Each user can only add a gear item once
);

-- ============================================================================
-- USER STATION PHOTOS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_station_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,               -- Final CDN URL (ImageKit)
  width INT,                             -- Image dimensions for layout
  height INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER TASTE PROFILE CACHE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_taste_profile_cache (
  user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Lean aggregated data
  top_roast_levels TEXT[],               -- ["light", "medium_light"]
  top_brew_methods TEXT[],               -- ["pour_over", "aeropress"]  
  top_flavor_note_ids UUID[],            -- References to flavor_notes.id
  total_reviews INT DEFAULT 0,
  
  -- Cache management
  last_computed_at TIMESTAMPTZ,
  review_count_at_compute INT,           -- To detect if refresh needed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Gear catalog indexes
CREATE INDEX IF NOT EXISTS idx_gear_catalog_name_trgm ON public.gear_catalog USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_gear_catalog_category ON public.gear_catalog(category);
CREATE INDEX IF NOT EXISTS idx_gear_catalog_usage_count ON public.gear_catalog(usage_count DESC);

-- User gear indexes
CREATE INDEX IF NOT EXISTS idx_user_gear_user_id ON public.user_gear(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gear_gear_id ON public.user_gear(gear_id);

-- User station photos indexes
CREATE INDEX IF NOT EXISTS idx_user_station_photos_user_id ON public.user_station_photos(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.gear_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_station_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_taste_profile_cache ENABLE ROW LEVEL SECURITY;

-- Gear catalog: Public read, authenticated users can insert
CREATE POLICY "Public can read gear catalog" ON public.gear_catalog
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert gear" ON public.gear_catalog
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- User gear: Public read if profile is public OR viewer is owner
CREATE POLICY "Public read for public profiles" ON public.user_gear
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_gear.user_id AND is_public_profile = true
    )
    OR user_id = auth.uid()  -- Owner can always read their own
  );

-- User gear: Owner can manage
CREATE POLICY "Owner can manage own gear" ON public.user_gear
  FOR ALL USING (user_id = auth.uid());

-- User station photos: Public read if profile is public OR viewer is owner
CREATE POLICY "Public read for public profiles" ON public.user_station_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_station_photos.user_id AND is_public_profile = true
    )
    OR user_id = auth.uid()  -- Owner can always read their own
  );

-- User station photos: Owner can manage
CREATE POLICY "Owner can manage own photos" ON public.user_station_photos
  FOR ALL USING (user_id = auth.uid());

-- User taste profile cache: Public read if profile is public OR viewer is owner
CREATE POLICY "Public read for public profiles" ON public.user_taste_profile_cache
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_taste_profile_cache.user_id AND is_public_profile = true
    )
    OR user_id = auth.uid()  -- Owner can always read their own
  );

-- User taste profile cache: Owner can manage
CREATE POLICY "Owner can manage own cache" ON public.user_taste_profile_cache
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers (handle_updated_at function already exists)
CREATE TRIGGER set_gear_catalog_updated_at
  BEFORE UPDATE ON public.gear_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_taste_profile_cache_updated_at
  BEFORE UPDATE ON public.user_taste_profile_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Gear usage count increment trigger
CREATE OR REPLACE FUNCTION public.increment_gear_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.gear_catalog SET usage_count = usage_count + 1 WHERE id = NEW.gear_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_gear_usage
  AFTER INSERT ON public.user_gear
  FOR EACH ROW EXECUTE FUNCTION public.increment_gear_usage_count();

-- Gear usage count decrement trigger (clamped at 0)
CREATE OR REPLACE FUNCTION public.decrement_gear_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.gear_catalog SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.gear_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_gear_usage
  AFTER DELETE ON public.user_gear
  FOR EACH ROW EXECUTE FUNCTION public.decrement_gear_usage_count();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for user recommended coffees (selections)
-- Selections are reviews where recommend = true
CREATE OR REPLACE VIEW public.user_recommended_coffees AS
SELECT 
  r.id as review_id,
  r.user_id,
  r.entity_id as coffee_id,
  r.rating,
  r.comment,
  r.created_at as reviewed_at,
  c.name as coffee_name,
  c.slug as coffee_slug,
  ro.name as roaster_name,
  ro.slug as roaster_slug,
  ci.url as coffee_image_url
FROM public.latest_reviews_per_identity r
JOIN public.coffees c ON r.entity_id = c.id
JOIN public.roasters ro ON c.roaster_id = ro.id
LEFT JOIN public.coffee_images ci ON c.id = ci.coffee_id AND ci.sort_order = 0
WHERE r.entity_type = 'coffee'
  AND r.recommend = true
  AND r.user_id IS NOT NULL;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to refresh user taste profile cache
CREATE OR REPLACE FUNCTION public.refresh_user_taste_profile_cache(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_review_count INT;
  v_top_roasts TEXT[];
  v_top_methods TEXT[];
  v_top_flavors UUID[];
BEGIN
  -- Get total review count
  SELECT COUNT(*) INTO v_review_count
  FROM public.latest_reviews_per_identity
  WHERE user_id = p_user_id AND entity_type = 'coffee';

  -- Get top roast levels (from coffee roast_level)
  SELECT ARRAY_AGG(DISTINCT c.roast_level::TEXT ORDER BY c.roast_level::TEXT)
  INTO v_top_roasts
  FROM public.latest_reviews_per_identity r
  JOIN public.coffees c ON r.entity_id = c.id
  WHERE r.user_id = p_user_id 
    AND r.entity_type = 'coffee'
    AND c.roast_level IS NOT NULL
  GROUP BY c.roast_level
  ORDER BY COUNT(*) DESC
  LIMIT 5;

  -- Get top brew methods (from review brew_method)
  SELECT ARRAY_AGG(DISTINCT r.brew_method::TEXT ORDER BY r.brew_method::TEXT)
  INTO v_top_methods
  FROM public.latest_reviews_per_identity r
  WHERE r.user_id = p_user_id 
    AND r.entity_type = 'coffee'
    AND r.brew_method IS NOT NULL
  GROUP BY r.brew_method
  ORDER BY COUNT(*) DESC
  LIMIT 5;

  -- Get top flavor notes (from coffee_flavor_notes junction)
  SELECT ARRAY_AGG(DISTINCT cfn.flavor_note_id ORDER BY cfn.flavor_note_id)
  INTO v_top_flavors
  FROM public.latest_reviews_per_identity r
  JOIN public.coffees c ON r.entity_id = c.id
  JOIN public.coffee_flavor_notes cfn ON c.id = cfn.coffee_id
  WHERE r.user_id = p_user_id 
    AND r.entity_type = 'coffee'
  GROUP BY cfn.flavor_note_id
  ORDER BY COUNT(*) DESC
  LIMIT 10;

  -- Upsert cache record
  INSERT INTO public.user_taste_profile_cache (
    user_id,
    top_roast_levels,
    top_brew_methods,
    top_flavor_note_ids,
    total_reviews,
    last_computed_at,
    review_count_at_compute
  ) VALUES (
    p_user_id,
    COALESCE(v_top_roasts, ARRAY[]::TEXT[]),
    COALESCE(v_top_methods, ARRAY[]::TEXT[]),
    COALESCE(v_top_flavors, ARRAY[]::UUID[]),
    v_review_count,
    NOW(),
    v_review_count
  )
  ON CONFLICT (user_id) DO UPDATE SET
    top_roast_levels = EXCLUDED.top_roast_levels,
    top_brew_methods = EXCLUDED.top_brew_methods,
    top_flavor_note_ids = EXCLUDED.top_flavor_note_ids,
    total_reviews = EXCLUDED.total_reviews,
    last_computed_at = EXCLUDED.last_computed_at,
    review_count_at_compute = EXCLUDED.review_count_at_compute,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.gear_catalog IS 'Canonical catalog of brewing equipment. Users select from this list to avoid duplicate entries.';
COMMENT ON TABLE public.user_gear IS 'User equipment collection linking to gear_catalog.';
COMMENT ON TABLE public.user_station_photos IS 'User coffee station photos gallery.';
COMMENT ON TABLE public.user_taste_profile_cache IS 'Cached taste profile analytics computed from user reviews.';
COMMENT ON VIEW public.user_recommended_coffees IS 'User recommended coffees (selections) - reviews where recommend = true.';
COMMENT ON FUNCTION public.refresh_user_taste_profile_cache IS 'Refreshes the taste profile cache for a user based on their review history.';
