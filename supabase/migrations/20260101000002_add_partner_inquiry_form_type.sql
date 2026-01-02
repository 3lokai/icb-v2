-- Migration: Add partner_inquiry to form_submissions form_type check constraint
-- Created: 2025-01-01
-- Description: Adds 'partner_inquiry' as a valid form_type option for the partner page form submissions

-- Drop the existing check constraint
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
    'roaster_claim',
    'partner_inquiry'
  ));

-- Update the comment to reflect the new form type
COMMENT ON COLUMN public.form_submissions.form_type IS 
  'Type of form: newsletter, roaster_submission, suggestion, professional_inquiry, roaster_claim, or partner_inquiry';
