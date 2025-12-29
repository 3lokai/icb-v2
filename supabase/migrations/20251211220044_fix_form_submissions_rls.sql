-- Migration: Fix Form Submissions RLS Policy
-- Created: 2025-12-11
-- Description: Fixes RLS policy to allow anonymous inserts by using 'anon' role instead of 'public'

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow public form submissions" ON public.form_submissions;

-- Recreate the policy with correct role (anon for anonymous users)
CREATE POLICY "Allow public form submissions"
  ON public.form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);




