-- Migration: Fix infinite recursion in roaster_members RLS
-- Policies that SELECT from roaster_members inside their USING/WITH CHECK
-- cause RLS to re-evaluate on the same table. Use a SECURITY DEFINER helper
-- that reads roaster_members without going through RLS.

-- ============================================================================
-- HELPER: is_roaster_owner (bypasses RLS when reading roaster_members)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_roaster_owner(p_roaster_id UUID)
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
    AND member_role = 'owner'
  );
$$;

-- ============================================================================
-- DROP RECURSIVE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Owners can view team members" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can add members" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can update member roles" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can remove members" ON public.roaster_members;

-- ============================================================================
-- RECREATE POLICIES USING is_roaster_owner()
-- ============================================================================

CREATE POLICY "Owners can view team members"
  ON public.roaster_members FOR SELECT
  USING (public.is_roaster_owner(roaster_id));

CREATE POLICY "Owners can add members"
  ON public.roaster_members FOR INSERT
  WITH CHECK (public.is_roaster_owner(roaster_id));

CREATE POLICY "Owners can update member roles"
  ON public.roaster_members FOR UPDATE
  USING (public.is_roaster_owner(roaster_id))
  WITH CHECK (public.is_roaster_owner(roaster_id));

CREATE POLICY "Owners can remove members"
  ON public.roaster_members FOR DELETE
  USING (user_id != auth.uid() AND public.is_roaster_owner(roaster_id));
