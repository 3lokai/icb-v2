import { Redis } from "@upstash/redis";

const USAGE_PREFIX = "usage";
const DAILY_TTL_SECONDS = 32 * 24 * 60 * 60; // 32 days
const HOURLY_TTL_SECONDS = 48 * 60 * 60; // 48 hours

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function dateKey(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function hourKey(): string {
  const now = new Date();
  return String(now.getUTCHours()).padStart(2, "0");
}

/**
 * Increment usage counters for an API key (fire-and-forget).
 * Called from validateApiKey after rate limit check passes.
 */
export async function incrementUsage(keyId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const date = dateKey();
  const hour = hourKey();
  const dailyKey = `${USAGE_PREFIX}:${keyId}:${date}`;
  const hourlyKey = `${USAGE_PREFIX}:${keyId}:${date}:${hour}`;

  try {
    await redis.incr(dailyKey);
    await redis.expire(dailyKey, DAILY_TTL_SECONDS);
    await redis.incr(hourlyKey);
    await redis.expire(hourlyKey, HOURLY_TTL_SECONDS);
  } catch (err) {
    console.error("[usage] increment error:", err);
  }
}

/**
 * Increment error count for an API key (call from route on 5xx/4xx if desired).
 */
export async function incrementErrorCount(keyId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const date = dateKey();
  const key = `${USAGE_PREFIX}:${keyId}:${date}:errors`;

  try {
    await redis.incr(key);
    await redis.expire(key, DAILY_TTL_SECONDS);
  } catch (err) {
    console.error("[usage] error count increment:", err);
  }
}

/**
 * Get usage for a key: today's total, and hourly breakdown for today.
 * Used by developer portal charts.
 */
export async function getUsageForKey(keyId: string): Promise<{
  todayTotal: number;
  hourlyToday: { hour: string; count: number }[];
  dailyTotals: { date: string; count: number }[];
}> {
  const redis = getRedis();
  const date = dateKey();

  const result = {
    todayTotal: 0,
    hourlyToday: [] as { hour: string; count: number }[],
    dailyTotals: [] as { date: string; count: number }[],
  };

  if (!redis) return result;

  try {
    const dailyKey = `${USAGE_PREFIX}:${keyId}:${date}`;
    const todayCount = await redis.get<number>(dailyKey);
    result.todayTotal = typeof todayCount === "number" ? todayCount : 0;

    for (let h = 0; h < 24; h++) {
      const hourStr = String(h).padStart(2, "0");
      const key = `${USAGE_PREFIX}:${keyId}:${date}:${hourStr}`;
      const count = await redis.get<number>(key);
      result.hourlyToday.push({
        hour: hourStr,
        count: typeof count === "number" ? count : 0,
      });
    }

    // Last 7 days (excluding today we already have)
    for (let d = 1; d <= 6; d++) {
      const past = new Date();
      past.setUTCDate(past.getUTCDate() - d);
      const y = past.getUTCFullYear();
      const m = String(past.getUTCMonth() + 1).padStart(2, "0");
      const day = String(past.getUTCDate()).padStart(2, "0");
      const pastDateKey = `${y}${m}${day}`;
      const key = `${USAGE_PREFIX}:${keyId}:${pastDateKey}`;
      const count = await redis.get<number>(key);
      result.dailyTotals.push({
        date: pastDateKey,
        count: typeof count === "number" ? count : 0,
      });
    }
    result.dailyTotals.reverse();
  } catch (err) {
    console.error("[usage] getUsageForKey error:", err);
  }

  return result;
}
