-- Migration: Create communities table
-- Created: 2026-05-04
-- Description: Communities directory for WhatsApp groups, Discord servers, and other
--              coffee community spaces. Simple table with public read, admin write.

-- ============================================================================
-- ENUM
-- ============================================================================

CREATE TYPE public.community_platform_enum AS ENUM (
  'whatsapp',
  'discord',
  'telegram',
  'facebook_group',
  'reddit',
  'other'
);

-- ============================================================================
-- TABLE: communities
-- ============================================================================

CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  platform public.community_platform_enum NOT NULL,
  invite_url TEXT NOT NULL,
  icon_url TEXT,
  member_count TEXT,
  moderators TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_communities_slug ON public.communities(slug);
CREATE INDEX idx_communities_is_active ON public.communities(is_active);
CREATE INDEX idx_communities_platform ON public.communities(platform);

-- ============================================================================
-- UPDATED_AT TRIGGER — reuses existing handle_updated_at function
-- ============================================================================

CREATE TRIGGER communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone can view active communities
CREATE POLICY "Public can view active communities"
  ON public.communities FOR SELECT
  USING (is_active = true);

-- SELECT: admins/operators can view all (including inactive)
CREATE POLICY "Admins can view all communities"
  ON public.communities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- INSERT / UPDATE / DELETE: admins/operators only
CREATE POLICY "Admins can manage communities"
  ON public.communities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT ON public.communities TO anon;
GRANT SELECT ON public.communities TO authenticated;
