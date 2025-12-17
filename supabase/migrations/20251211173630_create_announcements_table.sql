-- Migration: Create Announcements Table
-- Created: 2025-12-11
-- Description: Creates a table to store site-wide announcements/banners with active status

-- ============================================================================
-- TABLE: announcements
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Announcement content
  message TEXT NOT NULL,
  
  -- Optional link URL (can be relative or absolute)
  link TEXT,
  
  -- Active status flag (only active announcements are displayed)
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for active announcements query (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_announcements_is_active_created_at 
  ON public.announcements(is_active, created_at DESC) 
  WHERE is_active = true;

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_announcements_created_at 
  ON public.announcements(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Note: Admin policies depend on the user_roles table existing.
-- If user_roles table doesn't exist, comment out the admin policies below.
-- The public read policy will work regardless.

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active announcements
-- This allows the banner component to fetch announcements without authentication
CREATE POLICY "Public can view active announcements"
  ON public.announcements
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: Admins can view all announcements (including inactive)
CREATE POLICY "Admins can view all announcements"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can insert announcements
CREATE POLICY "Admins can insert announcements"
  ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update announcements
CREATE POLICY "Admins can update announcements"
  ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can delete announcements
CREATE POLICY "Admins can delete announcements"
  ON public.announcements
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.announcements IS 
  'Site-wide announcements displayed in banner components';

COMMENT ON COLUMN public.announcements.message IS 
  'The announcement message text displayed in the banner';

COMMENT ON COLUMN public.announcements.link IS 
  'Optional URL link (relative or absolute) for the announcement';

COMMENT ON COLUMN public.announcements.is_active IS 
  'Whether the announcement is currently active and should be displayed';

COMMENT ON COLUMN public.announcements.created_at IS 
  'Timestamp when the announcement was created';

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial welcome announcement
INSERT INTO public.announcements (message, link, is_active, created_at)
VALUES (
  'Discover India''s finest coffee roasters and premium beans',
  '/learn',
  true,
  NOW()
);

-- ============================================================================
-- ROLLBACK (for reference)
-- ============================================================================
-- To rollback this migration:
-- DROP TABLE IF EXISTS public.announcements CASCADE;

