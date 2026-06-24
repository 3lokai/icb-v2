import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
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
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redis =
    redisUrl && redisToken
      ? new Redis({ url: redisUrl, token: redisToken })
      : null;

  const now = new Date();
  let since = new Date(now.getTime() - DEFAULT_LOOKBACK_MS);
  if (redis) {
    const stored = await redis.get<string>(LAST_RUN_KEY);
    if (stored) {
      const parsed = new Date(stored);
      if (!Number.isNaN(parsed.getTime())) since = parsed;
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

  // Advance the high-water mark only after a successful run.
  if (redis) {
    await redis.set(LAST_RUN_KEY, now.toISOString());
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
