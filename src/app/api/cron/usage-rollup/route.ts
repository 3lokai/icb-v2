import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Redis } from "@upstash/redis";

const USAGE_PREFIX = "usage";

function dateKey(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * POST /api/cron/usage-rollup
 * Reads today's Redis usage counters and upserts into api_key_daily_usage.
 * Secure with CRON_SECRET or Vercel cron auth.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 503 }
    );
  }

  const supabase = await createServiceRoleClient();
  const redis = new Redis({ url: redisUrl, token: redisToken });

  const { data: keys, error: keysError } = await supabase
    .from("api_keys")
    .select("id");

  if (keysError || !keys?.length) {
    return NextResponse.json(
      { error: keysError?.message ?? "No keys" },
      { status: 500 }
    );
  }

  const today = dateKey();

  for (const { id: keyId } of keys) {
    const dailyKey = `${USAGE_PREFIX}:${keyId}:${today}`;
    const errorKey = `${USAGE_PREFIX}:${keyId}:${today}:errors`;
    const [count, errCount] = await Promise.all([
      redis.get<number>(dailyKey),
      redis.get<number>(errorKey),
    ]);
    const request_count = typeof count === "number" ? count : 0;
    const error_count = typeof errCount === "number" ? errCount : 0;
    if (request_count > 0 || error_count > 0) {
      await supabase.from("api_key_daily_usage").upsert(
        {
          key_id: keyId,
          date: `${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`,
          request_count,
          error_count,
        },
        { onConflict: "key_id,date" }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
