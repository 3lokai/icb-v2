-- Migration: Add RLS for canon_sensory_nodes and flavor_note_to_canon
-- Created: 2026-01-14
-- Description: Enables Row Level Security and creates policies for canonical sensory/flavor tables.
-- These tables follow the same pattern as canon_regions and canon_estates (public read access).

-- ============================================================================
-- ENABLE RLS ON NEW TABLES
-- ============================================================================

-- Enable RLS on canon_sensory_nodes (canonical sensory nodes table)
ALTER TABLE IF EXISTS public.canon_sensory_nodes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on flavor_note_to_canon (junction table linking flavor_notes to canon_sensory_nodes)
ALTER TABLE IF EXISTS public.flavor_note_to_canon ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CANON_SENSORY_NODES POLICIES
-- ============================================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "canon_sensory_nodes_select_public" ON public.canon_sensory_nodes;
DROP POLICY IF EXISTS "Admins can manage canon_sensory_nodes" ON public.canon_sensory_nodes;

-- Public read access (these are public reference data)
CREATE POLICY "canon_sensory_nodes_select_public"
  ON public.canon_sensory_nodes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can insert/update/delete (if needed in the future)
CREATE POLICY "Admins can manage canon_sensory_nodes"
  ON public.canon_sensory_nodes
  FOR ALL
  TO authenticated
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
-- FLAVOR_NOTE_TO_CANON POLICIES
-- ============================================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "flavor_note_to_canon_select_public" ON public.flavor_note_to_canon;
DROP POLICY IF EXISTS "Admins can manage flavor_note_to_canon" ON public.flavor_note_to_canon;

-- Public read access (junction table - public reference data)
CREATE POLICY "flavor_note_to_canon_select_public"
  ON public.flavor_note_to_canon
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can insert/update/delete (if needed in the future)
CREATE POLICY "Admins can manage flavor_note_to_canon"
  ON public.flavor_note_to_canon
  FOR ALL
  TO authenticated
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
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "canon_sensory_nodes_select_public" ON public.canon_sensory_nodes IS 
  'Allows anyone to read canonical sensory nodes (public reference data)';

COMMENT ON POLICY "Admins can manage canon_sensory_nodes" ON public.canon_sensory_nodes IS 
  'Allows admins and operators to insert, update, and delete canonical sensory nodes';

COMMENT ON POLICY "flavor_note_to_canon_select_public" ON public.flavor_note_to_canon IS 
  'Allows anyone to read flavor note to canonical nodes mappings (public reference data)';

COMMENT ON POLICY "Admins can manage flavor_note_to_canon" ON public.flavor_note_to_canon IS 
  'Allows admins and operators to insert, update, and delete flavor note to canonical mappings';
