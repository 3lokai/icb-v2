-- Migration: Create curations tables (curators, curator_links, curator_gallery_images, curation_lists, curation_selections)
-- Created: 2026-02-03
-- Description: Curators and curations with optional user link, flexible coffee linking, and RLS.

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE public.curator_type_enum AS ENUM ('cafe', 'barista', 'community');

CREATE TYPE public.link_platform_enum AS ENUM ('instagram', 'website', 'twitter', 'youtube', 'facebook');

-- ============================================================================
-- TABLE: curators
-- ============================================================================

CREATE TABLE public.curators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  location TEXT,
  curator_type public.curator_type_enum NOT NULL,
  tags TEXT[] DEFAULT '{}',
  philosophy TEXT,
  story TEXT,
  quote TEXT,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: curator_links
-- ============================================================================

CREATE TABLE public.curator_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curator_id UUID NOT NULL REFERENCES public.curators(id) ON DELETE CASCADE,
  platform public.link_platform_enum NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- ============================================================================
-- TABLE: curator_gallery_images
-- ============================================================================

CREATE TABLE public.curator_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curator_id UUID NOT NULL REFERENCES public.curators(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ============================================================================
-- TABLE: curation_lists
-- ============================================================================

CREATE TABLE public.curation_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curator_id UUID NOT NULL REFERENCES public.curators(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_curator_list_slug UNIQUE (curator_id, slug)
);

-- ============================================================================
-- TABLE: curation_selections
-- ============================================================================

CREATE TABLE public.curation_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curation_list_id UUID NOT NULL REFERENCES public.curation_lists(id) ON DELETE CASCADE,
  coffee_id UUID REFERENCES public.coffees(id) ON DELETE SET NULL,
  roaster_id UUID REFERENCES public.roasters(id) ON DELETE SET NULL,
  coffee_name TEXT NOT NULL,
  roaster_name TEXT NOT NULL,
  curator_note TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_curators_slug ON public.curators(slug);
CREATE INDEX idx_curators_user_id ON public.curators(user_id);
CREATE INDEX idx_curators_is_active ON public.curators(is_active);

CREATE INDEX idx_curator_links_curator_id ON public.curator_links(curator_id);

CREATE INDEX idx_curator_gallery_images_curator_id ON public.curator_gallery_images(curator_id);

CREATE INDEX idx_curation_lists_curator_id ON public.curation_lists(curator_id);
CREATE INDEX idx_curation_lists_is_active ON public.curation_lists(is_active);

CREATE INDEX idx_curation_selections_curation_list_id ON public.curation_selections(curation_list_id);
CREATE INDEX idx_curation_selections_coffee_id ON public.curation_selections(coffee_id);
CREATE INDEX idx_curation_selections_roaster_id ON public.curation_selections(roaster_id);

-- ============================================================================
-- UPDATED_AT TRIGGER (curators, curation_lists) - uses existing handle_updated_at
-- ============================================================================

CREATE TRIGGER curators_updated_at
  BEFORE UPDATE ON public.curators
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER curation_lists_updated_at
  BEFORE UPDATE ON public.curation_lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- RLS: curators
-- ============================================================================

ALTER TABLE public.curators ENABLE ROW LEVEL SECURITY;

-- SELECT: Public can view active curators; admins/operators can view all
CREATE POLICY "Public can view active curators"
  ON public.curators FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all curators"
  ON public.curators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- INSERT: Admins/operators only; or user creating their own (user_id = auth.uid())
CREATE POLICY "Admins can create curators"
  ON public.curators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Users can create own curator"
  ON public.curators FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: Admins/operators or owner (curators.user_id = auth.uid())
CREATE POLICY "Admins can update curators"
  ON public.curators FOR UPDATE
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

CREATE POLICY "Curator owner can update own"
  ON public.curators FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Admins/operators only
CREATE POLICY "Admins can delete curators"
  ON public.curators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- RLS: curator_links
-- ============================================================================

ALTER TABLE public.curator_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view curator links"
  ON public.curator_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curator_links.curator_id
      AND (c.is_active = true OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'operator')
      ))
    )
  );

CREATE POLICY "Admins can manage curator links"
  ON public.curator_links FOR ALL
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

CREATE POLICY "Curator owner can manage own links"
  ON public.curator_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curator_links.curator_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curator_links.curator_id AND c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS: curator_gallery_images
-- ============================================================================

ALTER TABLE public.curator_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view curator gallery"
  ON public.curator_gallery_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curator_gallery_images.curator_id
      AND (c.is_active = true OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'operator')
      ))
    )
  );

CREATE POLICY "Admins can manage curator gallery"
  ON public.curator_gallery_images FOR ALL
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

CREATE POLICY "Curator owner can manage own gallery"
  ON public.curator_gallery_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curator_gallery_images.curator_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curator_gallery_images.curator_id AND c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS: curation_lists
-- ============================================================================

ALTER TABLE public.curation_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active curation lists"
  ON public.curation_lists FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curation_lists.curator_id AND c.is_active = true
    )
  );

CREATE POLICY "Admins can view all curation lists"
  ON public.curation_lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins can manage curation lists"
  ON public.curation_lists FOR ALL
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

CREATE POLICY "Curator owner can manage own lists"
  ON public.curation_lists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curation_lists.curator_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.curators c
      WHERE c.id = curation_lists.curator_id AND c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS: curation_selections
-- ============================================================================

ALTER TABLE public.curation_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view curation selections"
  ON public.curation_selections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.curation_lists cl
      JOIN public.curators c ON c.id = cl.curator_id
      WHERE cl.id = curation_selections.curation_list_id
      AND cl.is_active = true
      AND c.is_active = true
    )
  );

CREATE POLICY "Admins can view all curation selections"
  ON public.curation_selections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins can manage curation selections"
  ON public.curation_selections FOR ALL
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

CREATE POLICY "Curator owner can manage own selections"
  ON public.curation_selections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.curation_lists cl
      JOIN public.curators c ON c.id = cl.curator_id
      WHERE cl.id = curation_selections.curation_list_id
      AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.curation_lists cl
      JOIN public.curators c ON c.id = cl.curator_id
      WHERE cl.id = curation_selections.curation_list_id
      AND c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- GRANTS (anon/authenticated read for public policies)
-- ============================================================================

GRANT SELECT ON public.curators TO anon;
GRANT SELECT ON public.curators TO authenticated;
GRANT SELECT ON public.curator_links TO anon;
GRANT SELECT ON public.curator_links TO authenticated;
GRANT SELECT ON public.curator_gallery_images TO anon;
GRANT SELECT ON public.curator_gallery_images TO authenticated;
GRANT SELECT ON public.curation_lists TO anon;
GRANT SELECT ON public.curation_lists TO authenticated;
GRANT SELECT ON public.curation_selections TO anon;
GRANT SELECT ON public.curation_selections TO authenticated;

-- Full table access for authenticated (RLS still applies)
GRANT INSERT, UPDATE, DELETE ON public.curators TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curator_links TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curator_gallery_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curation_lists TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curation_selections TO authenticated;
