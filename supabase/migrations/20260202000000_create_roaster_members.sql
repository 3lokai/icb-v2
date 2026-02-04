-- Migration: Create roaster_members join table and RLS
-- Created: 2026-02-02
-- Description: Join table linking users to roasters with member_role (owner/editor/viewer), RLS for roasters and roaster_members, and helper functions.

-- ============================================================================
-- ENUM
-- ============================================================================

CREATE TYPE public.member_role_enum AS ENUM ('owner', 'editor', 'viewer');

-- ============================================================================
-- TABLE: roaster_members
-- ============================================================================

CREATE TABLE public.roaster_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  roaster_id UUID NOT NULL REFERENCES public.roasters(id) ON DELETE CASCADE,
  member_role member_role_enum NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,

  CONSTRAINT unique_user_roaster UNIQUE (user_id, roaster_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_roaster_members_user_id ON public.roaster_members(user_id);
CREATE INDEX idx_roaster_members_roaster_id ON public.roaster_members(roaster_id);
CREATE INDEX idx_roaster_members_role ON public.roaster_members(member_role);

-- ============================================================================
-- RLS: roaster_members
-- ============================================================================

ALTER TABLE public.roaster_members ENABLE ROW LEVEL SECURITY;

-- SELECT POLICIES
CREATE POLICY "Users can view own memberships"
  ON public.roaster_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can view team members"
  ON public.roaster_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roaster_members.roaster_id
      AND rm.user_id = auth.uid()
      AND rm.member_role = 'owner'
    )
  );

CREATE POLICY "Admins can view all memberships"
  ON public.roaster_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- INSERT POLICIES
CREATE POLICY "Owners can add members"
  ON public.roaster_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roaster_members.roaster_id
      AND rm.user_id = auth.uid()
      AND rm.member_role = 'owner'
    )
  );

CREATE POLICY "Admins can add memberships"
  ON public.roaster_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- UPDATE POLICIES
CREATE POLICY "Owners can update member roles"
  ON public.roaster_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roaster_members.roaster_id
      AND rm.user_id = auth.uid()
      AND rm.member_role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roaster_members.roaster_id
      AND rm.user_id = auth.uid()
      AND rm.member_role = 'owner'
    )
  );

CREATE POLICY "Admins can update memberships"
  ON public.roaster_members FOR UPDATE
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

-- DELETE POLICIES
CREATE POLICY "Owners can remove members"
  ON public.roaster_members FOR DELETE
  USING (
    user_id != auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roaster_members.roaster_id
      AND rm.user_id = auth.uid()
      AND rm.member_role = 'owner'
    )
  );

CREATE POLICY "Admins can delete memberships"
  ON public.roaster_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- RLS: roasters
-- ============================================================================

ALTER TABLE public.roasters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present (idempotent; e.g. "Public can view active roasters" may already exist)
DROP POLICY IF EXISTS "Public can view active roasters" ON public.roasters;
DROP POLICY IF EXISTS "Members can view own roaster" ON public.roasters;
DROP POLICY IF EXISTS "Admins can view all roasters" ON public.roasters;
DROP POLICY IF EXISTS "Members can edit roasters" ON public.roasters;
DROP POLICY IF EXISTS "Admins can update roasters" ON public.roasters;
DROP POLICY IF EXISTS "Admins can create roasters" ON public.roasters;
DROP POLICY IF EXISTS "Admins can delete roasters" ON public.roasters;

-- SELECT POLICIES
CREATE POLICY "Public can view active roasters"
  ON public.roasters FOR SELECT
  USING (is_active = true);

CREATE POLICY "Members can view own roaster"
  ON public.roasters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roasters.id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all roasters"
  ON public.roasters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- UPDATE POLICIES
CREATE POLICY "Members can edit roasters"
  ON public.roasters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roasters.id
      AND rm.user_id = auth.uid()
      AND rm.member_role IN ('owner', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roaster_members rm
      WHERE rm.roaster_id = roasters.id
      AND rm.user_id = auth.uid()
      AND rm.member_role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Admins can update roasters"
  ON public.roasters FOR UPDATE
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

-- INSERT POLICIES
CREATE POLICY "Admins can create roasters"
  ON public.roasters FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- DELETE POLICIES
CREATE POLICY "Admins can delete roasters"
  ON public.roasters FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.can_edit_roaster(p_roaster_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.roaster_members
    WHERE roaster_id = p_roaster_id
    AND user_id = auth.uid()
    AND member_role IN ('owner', 'editor')
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'operator')
  );
$$;

CREATE OR REPLACE FUNCTION public.get_roaster_member_role(p_roaster_id UUID)
RETURNS member_role_enum
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT member_role FROM public.roaster_members
  WHERE roaster_id = p_roaster_id
  AND user_id = auth.uid();
$$;
