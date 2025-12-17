-- Migration: Create Form Submissions Table
-- Created: 2025-12-11
-- Description: Creates a unified table to handle newsletter subscriptions and contact form submissions

-- ============================================================================
-- TABLE: form_submissions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Form type identifier
  form_type TEXT NOT NULL CHECK (form_type IN (
    'newsletter',
    'roaster_submission',
    'suggestion',
    'professional_inquiry'
  )),
  
  -- Flexible JSONB storage for all form fields
  -- Newsletter: { email, consent, website (honeypot) }
  -- Roaster: { roasterName, website, location, description, yourName, yourEmail }
  -- Suggestion: { suggestionType, suggestionDetails, suggesterName, suggesterEmail }
  -- Professional: { name, organization, email, collaborationType, message }
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Extracted email for quick lookups and deduplication
  email TEXT,
  
  -- Status tracking for workflow management
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processed',
    'rejected',
    'archived'
  )),
  
  -- Spam detection and analytics
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Optional: Link to authenticated user if available
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for form type queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type 
  ON public.form_submissions(form_type);

-- Index for email lookups (newsletter deduplication, etc.)
CREATE INDEX IF NOT EXISTS idx_form_submissions_email 
  ON public.form_submissions(email) 
  WHERE email IS NOT NULL;

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_form_submissions_status 
  ON public.form_submissions(status);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at 
  ON public.form_submissions(created_at DESC);

-- Index for user-based queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_user_id 
  ON public.form_submissions(user_id) 
  WHERE user_id IS NOT NULL;

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_form_submissions_type_status_created 
  ON public.form_submissions(form_type, status, created_at DESC);

-- GIN index for JSONB data queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_data_gin 
  ON public.form_submissions USING GIN (data);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_form_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER set_form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_form_submissions_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Note: Admin policies depend on the user_roles table existing.
-- If user_roles table doesn't exist, comment out the admin policies below.

-- Enable RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for form submissions)
CREATE POLICY "Allow public form submissions"
  ON public.form_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.form_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.form_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON public.form_submissions
  FOR UPDATE
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

COMMENT ON TABLE public.form_submissions IS 
  'Unified table for storing newsletter subscriptions and contact form submissions';

COMMENT ON COLUMN public.form_submissions.form_type IS 
  'Type of form: newsletter, roaster_submission, suggestion, or professional_inquiry';

COMMENT ON COLUMN public.form_submissions.data IS 
  'JSONB object containing all form field values. Structure varies by form_type';

COMMENT ON COLUMN public.form_submissions.email IS 
  'Extracted email address for quick lookups and deduplication';

COMMENT ON COLUMN public.form_submissions.status IS 
  'Processing status: pending, processed, rejected, or archived';

COMMENT ON COLUMN public.form_submissions.ip_address IS 
  'IP address of submitter for spam detection and analytics';

COMMENT ON COLUMN public.form_submissions.user_agent IS 
  'User agent string for analytics and spam detection';

-- ============================================================================
-- ROLLBACK (for reference)
-- ============================================================================
-- To rollback this migration:
-- DROP TABLE IF EXISTS public.form_submissions CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_form_submissions_updated_at() CASCADE;
