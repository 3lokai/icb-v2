-- Migration: Grant write permissions on roasters to authenticated
-- RLS was enabled on roasters; only SELECT was previously granted.
-- Table-level UPDATE/INSERT/DELETE must be granted so RLS policies can apply.
-- RLS still restricts: only admins/members can write (per policy).

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roasters TO authenticated;
