import "server-only";

import { createApiRouteClient } from "@/lib/supabase/api-route";
import { freeQuotaPeriod, paidQuotaPeriod } from "@/lib/api/quota-period";

export type EffectivePlan = {
  tier: string;
  rpm: number;
  monthlyQuota: number;
  maxKeys: number;
  commercialUse: boolean;
  features: string[];
  /** Quota bucket id: subscription period_start (paid) or YYYY-MM (free). */
  period: string;
  /** Absolute Redis expiry for the current quota bucket, in Unix seconds. */
  quotaExpiresAt: number;
};

type PlanRow = {
  tier: string;
  rpm: number;
  monthly_quota: number;
  max_keys: number;
  commercial_use: boolean;
  features: string[] | null;
};

// Used when api_plans is unreadable, so a DB hiccup never grants more than free.
const FREE_FALLBACK: PlanRow = {
  tier: "free",
  rpm: 30,
  monthly_quota: 5000,
  max_keys: 3,
  commercial_use: false,
  features: [],
};

/**
 * Resolve a user's plan: active subscription (+ overrides) or free.
 * An expired subscription (period_end in the past) falls back to free.
 */
export async function getEffectivePlan(userId: string): Promise<EffectivePlan> {
  const supabase = createApiRouteClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: sub, error: subError } = await supabase
    .from("api_subscriptions")
    .select(
      "tier, period_start, period_end, rpm_override, quota_override, features_override"
    )
    .eq("user_id", userId)
    .gte("period_end", today)
    .lte("period_start", today)
    .maybeSingle();
  if (subError) {
    console.error("[getEffectivePlan] subscription lookup failed:", subError);
  }

  const tier = (sub?.tier as string | undefined) ?? "free";
  const { data: planRow, error: planError } = await supabase
    .from("api_plans")
    .select("tier, rpm, monthly_quota, max_keys, commercial_use, features")
    .eq("tier", tier)
    .maybeSingle();
  if (planError) {
    console.error("[getEffectivePlan] plan lookup failed:", planError);
  }

  const plan = (planRow as PlanRow | null) ?? FREE_FALLBACK;
  const quotaPeriod = sub
    ? paidQuotaPeriod(sub.period_start as string, sub.period_end as string)
    : freeQuotaPeriod();

  return {
    tier: plan.tier,
    rpm: Number(sub?.rpm_override ?? plan.rpm),
    monthlyQuota: Number(sub?.quota_override ?? plan.monthly_quota),
    maxKeys: plan.max_keys,
    commercialUse: plan.commercial_use,
    features:
      (sub?.features_override as string[] | null) ?? plan.features ?? [],
    period: quotaPeriod.period,
    quotaExpiresAt: quotaPeriod.expiresAt,
  };
}
