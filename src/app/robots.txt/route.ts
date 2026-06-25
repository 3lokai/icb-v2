import { NextResponse } from "next/server";

export const dynamic = "force-static";

const CONTENT_SIGNAL = "ai-train=yes, search=yes, ai-input=yes";

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com"
).replace(/\/$/, "");

/** Build robots.txt with crawl rules and the sitemap URL. */
function buildRobotsTxt(): string {
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
