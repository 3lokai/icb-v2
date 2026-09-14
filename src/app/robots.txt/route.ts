import { NextResponse } from "next/server";

export const dynamic = "force-static";

const CONTENT_SIGNAL = "ai-train=yes, search=yes, ai-input=yes";

/** Read-only endpoints documented in public/llms.txt. Keep the two in sync. */
const DISCOVERY_API_PATHS = ["/api/coffees", "/api/roasters"];

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com"
).replace(/\/$/, "");

// A staging copy of a 1,252-URL site is an index-pollution risk, not a secrecy one:
// left crawlable it competes with production for the same queries. Belt to the
// X-Robots-Tag: noindex brace in next.config.ts — this one does not depend on a
// header gate being wired correctly. Deliberately NOT basic auth: a 401 is
// uncacheable, and verifying `cf-cache-status: HIT` is the point of staging.
const IS_PRODUCTION = (process.env.APP_ENV ?? process.env.VERCEL_ENV) === "production";

/** Build robots.txt with crawl rules and the sitemap URL. */
function buildRobotsTxt(): string {
  if (!IS_PRODUCTION) {
    return ["User-agent: *", "Disallow: /", ""].join("\n");
  }
  return [
    "User-agent: CCBot",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    "Allow: /api/",
    "Disallow: /dashboard/",
    "Disallow: /auth/",
    "",
    "User-agent: *",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    "Disallow: /dashboard/",
    "Disallow: /api/",
    "Disallow: /auth/",
    // llms.txt advertises these read-only JSON endpoints for programmatic
    // discovery — a blanket `Disallow: /api/` pointed every crawler at URLs it
    // was forbidden to fetch. Longest-match wins, so these re-open exactly the
    // documented ones; /api/auth, /api/cron, /api/webhooks stay blocked.
    ...DISCOVERY_API_PATHS.map((path) => `Allow: ${path}`),
    "",
    `Sitemap: ${APP_URL}/sitemap.xml`,
    "",
  ].join("\n");
}

/** Serve the static robots.txt response. */
export function GET() {
  return new NextResponse(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
