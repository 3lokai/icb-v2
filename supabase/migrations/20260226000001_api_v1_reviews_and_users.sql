-- Migration: Phase 2 API - reviews source_key_id and external_user_identities
-- Created: 2026-02-26
-- Description: Allow external API to submit reviews (tracked by key) and register external user identities.

-- ============================================================================
-- REVIEW STATUS: add pending_external for API-submitted reviews
-- ============================================================================

ALTER TYPE review_status ADD VALUE IF NOT EXISTS 'pending_external';

-- ============================================================================
-- REVIEWS: track which API key submitted the review
-- ============================================================================

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS source_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.reviews.source_key_id IS 'API key that submitted this review (external API only)';

CREATE INDEX IF NOT EXISTS idx_reviews_source_key_id ON public.reviews(source_key_id) WHERE source_key_id IS NOT NULL;

-- ============================================================================
-- EXTERNAL USER IDENTITIES: map external app user id to stable ICB anon_id
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.external_user_identities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id          UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  external_user_id TEXT NOT NULL,
  anon_id         UUID NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (key_id, external_user_id)
);

COMMENT ON TABLE public.external_user_identities IS 'Maps external app user IDs to stable ICB anon_id for API-submitted reviews';

CREATE INDEX IF NOT EXISTS idx_external_user_identities_key_id ON public.external_user_identities(key_id);
CREATE INDEX IF NOT EXISTS idx_external_user_identities_anon_id ON public.external_user_identities(anon_id);

-- ============================================================================
-- RLS for external_user_identities (service role used by API; no user access)
-- ============================================================================

ALTER TABLE public.external_user_identities ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE for authenticated app users; only service role (API) can use this table
CREATE POLICY "Service role only for external_user_identities"
  ON public.external_user_identities
  FOR ALL
  USING (false)
  WITH CHECK (false);
