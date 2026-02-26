import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { incrementUsage } from "@/lib/api/usage";

const API_KEY_PREFIX = "icb_live_";

export type ValidateApiKeyResult =
  | { error: NextResponse }
  | { keyId: string; userId: string };

/**
 * Extract API key from request (Authorization: Bearer <key> or X-API-Key: <key>).
 */
function extractApiKey(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const key = authHeader.slice(7).trim();
    return key || null;
  }
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader?.trim()) {
    return apiKeyHeader.trim();
  }
  return null;
}

/**
 * SHA-256 hash of the raw key for lookup (raw key is never stored).
 */
function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey, "utf8").digest("hex");
}

function unauthorizedResponse(
  message = "Invalid or missing API key"
): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      error: "Rate limit exceeded",
      retry_after: retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

/**
 * Validate API key for /api/v1/* routes.
 * 1. Extract key from header, hash it, look up in api_keys.
 * 2. Check is_active and expires_at.
 * 3. Apply Upstash rate limit (per key, sliding window).
 * 4. Fire-and-forget: increment usage in Redis, update last_used_at in Supabase.
 * Returns either { error: NextResponse } (401 or 429) or { keyId, userId }.
 */
export async function validateApiKey(
  request: Request
): Promise<ValidateApiKeyResult> {
  const rawKey = extractApiKey(request);
  if (!rawKey || !rawKey.startsWith(API_KEY_PREFIX)) {
    return { error: unauthorizedResponse() };
  }

  const keyHash = hashApiKey(rawKey);
  const supabase = await createServiceRoleClient();

  const { data: keyRow, error: keyError } = await supabase
    .from("api_keys")
    .select("id, user_id, is_active, rate_limit_rpm, expires_at")
    .eq("key_hash", keyHash)
    .single();

  if (keyError || !keyRow) {
    return { error: unauthorizedResponse() };
  }

  if (!keyRow.is_active) {
    return { error: unauthorizedResponse("API key has been revoked") };
  }

  if (
    keyRow.expires_at &&
    new Date(keyRow.expires_at as string).getTime() < Date.now()
  ) {
    return { error: unauthorizedResponse("API key has expired") };
  }

  const keyId = keyRow.id as string;
  const rateLimitRpm = Math.max(
    1,
    Math.min(1000, Number(keyRow.rate_limit_rpm) || 60)
  );

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return {
      error: NextResponse.json(
        { error: "Rate limiting is not configured" },
        { status: 503 }
      ),
    };
  }

  const redis = new Redis({ url: redisUrl, token: redisToken });
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rateLimitRpm, "1 m"),
    prefix: "icb-api-rl",
  });

  const { success, reset } = await ratelimit.limit(keyId);

  if (!success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((reset - Date.now()) / 1000)
    );
    return { error: rateLimitResponse(retryAfterSeconds) };
  }

  // Fire-and-forget: update last_used_at and increment usage counters (non-blocking)
  Promise.all([
    supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyId),
    incrementUsage(keyId),
  ]).catch((err) => {
    console.error("[validateApiKey] usage/update error:", err);
  });

  return {
    keyId,
    userId: keyRow.user_id as string,
  };
}
