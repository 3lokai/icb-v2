import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import { PROCESSING_METHODS } from "@/lib/utils/coffee-constants";
import type { ProcessEnum } from "@/types/db-enums";

type Count = { name: string; skus: number };

export type InsightsStats = {
  process: Array<{ key: ProcessEnum; label: string; skus: number }>;
  price: Array<{
    key: ProcessEnum;
    label: string;
    median: number;
    skus: number;
  }>;
  region_tagged_total: number;
  states: Count[];
  regions: Array<Count & { state: string | null }>;
  origin_regions: number;
  varieties: Count[];
  roaster_cities: Array<{
    city: string;
    state: string | null;
    count: number;
    lat: number | null;
    lng: number | null;
  }>;
};

export const EMPTY_INSIGHTS_STATS: InsightsStats = {
  process: [],
  price: [],
  region_tagged_total: 0,
  states: [],
  regions: [],
  origin_regions: 0,
  varieties: [],
  roaster_cities: [],
};

function processLabel(key: ProcessEnum): string {
  return PROCESSING_METHODS.find((p) => p.value === key)?.label ?? key;
}

async function fetchInsightsStatsImpl(): Promise<InsightsStats> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase.rpc("get_insights_stats");
  if (error) throw error;

  const raw = data as unknown as Omit<InsightsStats, "process" | "price"> & {
    process: Array<{ key: ProcessEnum; skus: number }>;
    price: Array<{ key: ProcessEnum; median: number; skus: number }>;
  };

  return {
    ...raw,
    process: raw.process.map((p) => ({ ...p, label: processLabel(p.key) })),
    price: raw.price.map((p) => ({ ...p, label: processLabel(p.key) })),
  };
}

/**
 * Aggregates behind /learn/insights (charts + OG image). Tagged like the
 * directory caches, so the scraper's MV-refresh webhook (/api/webhooks/indexnow
 * → revalidateTag("coffees"|"roasters")) refreshes it weekly; the 24h TTL only
 * covers a webhook outage.
 */
export const fetchInsightsStats = unstable_cache(
  fetchInsightsStatsImpl,
  ["insights-stats"],
  { revalidate: 86400, tags: ["coffees", "roasters"] }
);
