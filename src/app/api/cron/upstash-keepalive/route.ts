import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * POST /api/cron/upstash-keepalive
 * Sends a lightweight Redis request to prevent inactivity expiry.
 * Secure with CRON_SECRET.
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

  try {
    const redis = new Redis({ url: redisUrl, token: redisToken });
    const key = "keepalive:upstash";
    const now = new Date().toISOString();

    // Lightweight write + short expiry keeps the instance active.
    await redis.set(key, now);
    await redis.expire(key, 60 * 10);

    return NextResponse.json({ ok: true, timestamp: now });
  } catch (error) {
    console.error("[cron/upstash-keepalive] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upstash keepalive failed",
      },
      { status: 500 }
    );
  }
}
