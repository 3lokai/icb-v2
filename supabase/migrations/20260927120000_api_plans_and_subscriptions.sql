-- Migration: API plans, per-user subscriptions, usage ledger view
-- Created: 2026-09-27
-- Description: Limits move from per-key (api_keys.rate_limit_rpm) to per-user plans.
-- Free/Pro = developer product; Commercial/Enterprise = data licence (enforced by contract).

-- ============================================================================
-- FIX: users could UPDATE any column on their own keys (e.g. rate_limit_rpm).
-- Only revocation is user-writable; everything else goes through service role.
-- ============================================================================

REVOKE UPDATE ON public.api_keys FROM authenticated, anon;
GRANT UPDATE (is_active) ON public.api_keys TO authenticated;

-- ============================================================================
-- API_PLANS
-- ============================================================================

CREATE TABLE public.api_plans (
  tier            TEXT PRIMARY KEY,
  rpm             INTEGER NOT NULL CHECK (rpm > 0),
  monthly_quota   BIGINT NOT NULL CHECK (monthly_quota > 0),
  max_keys        INTEGER NOT NULL CHECK (max_keys > 0),
  commercial_use  BOOLEAN NOT NULL DEFAULT false,
  features        TEXT[] NOT NULL DEFAULT '{}'
);

COMMENT ON TABLE public.api_plans IS 'API plan catalogue. commercial_use is informational; licence terms are contractual.';

INSERT INTO public.api_plans (tier, rpm, monthly_quota, max_keys, commercial_use) VALUES
  ('free',        30,     5000,      3, false),
  ('pro',        120,   100000,      5, false),
  ('commercial', 300,  1000000,     10, true),
  ('enterprise', 600, 10000000,     20, true);

-- ============================================================================
-- API_SUBSCRIPTIONS (one row per paying user; absent = free)
-- ============================================================================

CREATE TABLE public.api_subscriptions (
  user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier               TEXT NOT NULL REFERENCES public.api_plans(tier),
  period_start       DATE NOT NULL,
  period_end         DATE NOT NULL CHECK (period_end > period_start),
  rpm_override       INTEGER CHECK (rpm_override > 0),
  quota_override     BIGINT CHECK (quota_override > 0),
  features_override  TEXT[],
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.api_subscriptions IS 'Manually managed (service role) after invoice/pilot is signed. Expired period_end falls back to free.';
COMMENT ON COLUMN public.api_subscriptions.period_start IS 'Billing period start; quota counter is keyed on this date.';

CREATE INDEX idx_api_subscriptions_tier ON public.api_subscriptions(tier);

-- ============================================================================
-- RLS: read-only for users; writes via service role
-- ============================================================================

ALTER TABLE public.api_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view api_plans"
  ON public.api_plans FOR SELECT
  USING (true);

CREATE POLICY "Users can view own api_subscription"
  ON public.api_subscriptions FOR SELECT
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Per-user daily usage (billing/reporting ledger; Redis only enforces)
-- ============================================================================

CREATE VIEW public.api_user_daily_usage
WITH (security_invoker = true) AS
SELECT
  k.user_id,
  u.date,
  SUM(u.request_count)::BIGINT AS request_count
FROM public.api_key_daily_usage u
JOIN public.api_keys k ON k.id = u.key_id
GROUP BY k.user_id, u.date;

COMMENT ON VIEW public.api_user_daily_usage IS 'Daily request totals per user across all keys; sum over a subscription period for invoicing.';
