-- Migration: Add roaster_claim to form_submissions form_type check constraint
-- Created: 2025-12-30
-- Description: Adds 'roaster_claim' as a valid form_type option

-- Drop the existing check constraint (using the actual constraint name from the error)
ALTER TABLE public.form_submissions
  DROP CONSTRAINT IF EXISTS form_submissions_form_type_check;

-- Recreate the constraint with the new form type
ALTER TABLE public.form_submissions
  ADD CONSTRAINT form_submissions_form_type_check
  CHECK (form_type IN (
    'newsletter',
    'roaster_submission',
    'suggestion',
    'professional_inquiry',
    'roaster_claim'
  ));

-- Update the comment to reflect the new form type
COMMENT ON COLUMN public.form_submissions.form_type IS 
  'Type of form: newsletter, roaster_submission, suggestion, professional_inquiry, or roaster_claim';

