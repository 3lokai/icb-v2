import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { submitToIndexNow } from "@/lib/seo/indexnow";

/**
 * POST /api/webhooks/indexnow
 *
 * Pushes recently-changed coffee and roaster URLs to IndexNow. Called by:
 *  - the Supabase `refresh_coffee_directory_mv()` pg_net hook (fires after the
 *    scraper refreshes the directory), and
 *  - a daily Vercel cron fallback.
 *
 * Authorized with INDEXNOW_WEBHOOK_SECRET or CRON_SECRET (Bearer token).
 *
 * A Redis high-water mark (`indexnow:last_run`) tracks the last submission so we
 * only push rows changed since then; overlap is harmless (IndexNow de-dupes).
 */

const LAST_RUN_KEY = "indexnow:last_run";
// Fallback window when no high-water mark exists yet (first run / Redis reset).
const DEFAULT_LOOKBACK_MS = 24 * 60 * 60 * 1000;
// Throttle the endpoint (the DB hook + cron need only a handful of calls/min).
const RATE_LIMIT_PER_MIN = 20;

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
}

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  const secrets = [
    process.env.INDEXNOW_WEBHOOK_SECRET,
    process.env.CRON_SECRET,
  ].filter(Boolean);
  if (secrets.length === 0) return false;
  return secrets.some((s) => authHeader === `Bearer ${s}`);
}

type CoffeeRow = {
  slug: string | null;
  roasters: { slug?: string } | null;
};

function roasterSlugOf(c: CoffeeRow): string | null {
  return (
    (c.roasters && typeof c.roasters === "object" && !Array.isArray(c.roasters)
      ? c.roasters.slug
      : null) ?? null
  );
}

async function handleSubmit(request: Request) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redis =
    redisUrl && redisToken
      ? new Redis({ url: redisUrl, token: redisToken })
      : null;

  // Throttle before auth so token-guessing is rate-limited too. Best-effort:
  // a limiter outage must not take the endpoint down.
  if (redis) {
    try {
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_PER_MIN, "1 m"),
        prefix: "icb-indexnow-rl",
      });
      const { success } = await ratelimit.limit(clientIp(request));
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    } catch (err) {
      console.error("[IndexNow] Rate limiter unavailable:", err);
    }
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let since = new Date(now.getTime() - DEFAULT_LOOKBACK_MS);
  // Best-effort: optional Redis state must not fail the request.
  if (redis) {
    try {
      const stored = await redis.get<string>(LAST_RUN_KEY);
      if (stored) {
        const parsed = new Date(stored);
        if (!Number.isNaN(parsed.getTime())) since = parsed;
      }
    } catch (err) {
      console.error("[IndexNow] Failed to read watermark:", err);
    }
  }
  const sinceIso = since.toISOString();

  const supabase = await createServiceRoleClient();
  const site = baseUrl().replace(/\/$/, "");

  const [coffeesResult, roastersResult] = await Promise.all([
    supabase
      .from("coffees")
      .select("slug, roasters(slug)")
      .in("status", ["active", "seasonal"])
      .not("slug", "is", null)
      .gte("updated_at", sinceIso),
    supabase
      .from("roasters")
      .select("slug")
      .eq("is_active", true)
      .not("slug", "is", null)
      .gte("updated_at", sinceIso),
  ]);

  if (coffeesResult.error || roastersResult.error) {
    return NextResponse.json(
      {
        error:
          coffeesResult.error?.message ??
          roastersResult.error?.message ??
          "Query failed",
      },
      { status: 500 }
    );
  }

  const coffeeUrls = ((coffeesResult.data as CoffeeRow[] | null) ?? [])
    .filter((c) => c.slug && roasterSlugOf(c))
    .map((c) => `${site}/roasters/${roasterSlugOf(c)}/coffees/${c.slug}`);

  const roasterUrls = (roastersResult.data ?? [])
    .filter((r) => r.slug)
    .map((r) => `${site}/roasters/${r.slug}`);

  const urls = [...coffeeUrls, ...roasterUrls];

  if (urls.length > 0) {
    await submitToIndexNow(urls);
  }

  // The MV refresh that triggers this webhook is also the moment directory data
  // changed, so purge the tag-based caches (roaster/coffee listings + details).
  // Without this the no-TTL listing caches stay stuck indefinitely — a new coffee
  // never appears and roaster cards keep a stale count. See fetch-roasters.ts /
  // fetch-coffees.ts (both tagged, and now revalidate: 86400 as a fallback).
  revalidateTag("coffees", "max");
  revalidateTag("roasters", "max");

  // Advance the high-water mark only after a successful run. Best-effort.
  if (redis) {
    try {
      await redis.set(LAST_RUN_KEY, now.toISOString());
    } catch (err) {
      console.error("[IndexNow] Failed to write watermark:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    since: sinceIso,
    submitted: urls.length,
    coffees: coffeeUrls.length,
    roasters: roasterUrls.length,
  });
}

// POST: Supabase MV-refresh pg_net hook. GET: Vercel cron fallback.
export async function POST(request: Request) {
  return handleSubmit(request);
}

export async function GET(request: Request) {
  return handleSubmit(request);
}
