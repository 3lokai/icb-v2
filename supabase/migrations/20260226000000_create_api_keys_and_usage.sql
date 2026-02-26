-- Migration: Create api_keys and api_key_daily_usage tables for external API
-- Created: 2026-02-26
-- Description: API key storage and daily usage rollups for developer portal

-- ============================================================================
-- API_KEYS TABLE
-- ============================================================================

CREATE TABLE public.api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  key_prefix      TEXT NOT NULL,
  key_hash        TEXT NOT NULL UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  rate_limit_rpm  INTEGER NOT NULL DEFAULT 60,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ
);

COMMENT ON TABLE public.api_keys IS 'API keys for external API access; raw key never stored, only SHA-256 hash';
COMMENT ON COLUMN public.api_keys.key_prefix IS 'First 16 chars of raw key, for display in UI';
COMMENT ON COLUMN public.api_keys.key_hash IS 'SHA-256 hash of full raw key';

CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE UNIQUE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

-- ============================================================================
-- API_KEY_DAILY_USAGE TABLE
-- ============================================================================

CREATE TABLE public.api_key_daily_usage (
  key_id          UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  request_count  BIGINT NOT NULL DEFAULT 0,
  error_count    BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (key_id, date)
);

COMMENT ON TABLE public.api_key_daily_usage IS 'Daily usage rollups for API keys; populated by cron from Redis';

CREATE INDEX idx_api_key_daily_usage_key_id ON public.api_key_daily_usage(key_id);
CREATE INDEX idx_api_key_daily_usage_date ON public.api_key_daily_usage(date);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_daily_usage ENABLE ROW LEVEL SECURITY;

-- api_keys: owner can SELECT, INSERT, UPDATE (no DELETE - revoke via is_active = false)
CREATE POLICY "Users can view own api_keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api_keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api_keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- api_key_daily_usage: owner can SELECT rows for their keys; INSERT/UPDATE via service role (cron)
CREATE POLICY "Users can view own api_key_daily_usage"
  ON public.api_key_daily_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.api_keys
      WHERE api_keys.id = api_key_daily_usage.key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Service role (cron) will bypass RLS for INSERT/UPDATE on api_key_daily_usage
