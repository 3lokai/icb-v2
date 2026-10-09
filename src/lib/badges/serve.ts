import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { captureServerEvent } from "@/lib/posthog-server";
import { fetchBadgeRoasterCached } from "@/lib/data/fetch-badge-data";
import {
  badgeDestinationPath,
  isValidSlug,
  parseBadgeParams,
  renderBadgeSvg,
  type BadgeData,
  type BadgeTarget,
} from "./badges";

const BOT_UA = /bot|crawl|spider|slurp|preview|fetch|monitor|headless/i;

function toTarget(roasterSlug: string, coffeeSlug?: string): BadgeTarget {
  return coffeeSlug
    ? { entity: "coffee", roasterSlug, coffeeSlug }
    : { entity: "roaster", roasterSlug };
}

/**
 * Badge data, or null. A DB failure keeps the graceful fallback (plain badge,
 * redirect to /roasters) but is logged so it isn't mistaken for a missing roaster.
 */
async function loadRoaster(slug: string) {
  try {
    return await fetchBadgeRoasterCached(slug);
  } catch (error) {
    console.error(`Badge data fetch failed for roaster "${slug}":`, error);
    return null;
  }
}

/** GET /badges/… — the hosted SVG behind every embed. */
export async function serveBadgeSvg(
  req: NextRequest,
  roasterSlug: string,
  coffeeSlug?: string
): Promise<Response> {
  if (
    !isValidSlug(roasterSlug) ||
    (coffeeSlug !== undefined && !isValidSlug(coffeeSlug))
  ) {
    return new Response("Not found", { status: 404 });
  }
  const target = toTarget(roasterSlug, coffeeSlug);
  const { type, theme, size } = parseBadgeParams(
    target.entity,
    req.nextUrl.searchParams
  );

  const roaster = await loadRoaster(roasterSlug);
  const coffee = coffeeSlug
    ? roaster?.coffees.find((c) => c.slug === coffeeSlug)
    : undefined;

  // Missing/delisted entity: still draw a plain "Listed" badge rather than a
  // broken image on the merchant's page. No numbers, so nothing is invented.
  const found = coffeeSlug ? coffee : roaster;
  const data: BadgeData = !found
    ? { ratingAvg: null, ratingCount: 0 }
    : coffee
      ? { ratingAvg: coffee.ratingAvg, ratingCount: coffee.ratingCount }
      : {
          ratingAvg: roaster!.ratingAvg,
          ratingCount: roaster!.ratingCount,
          coffeeCount: roaster!.coffees.length,
        };

  const svg = renderBadgeSvg({
    entity: target.entity,
    type: found ? type : "listed",
    theme,
    size,
    data,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Security-Policy":
        "default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

/** GET /go/… — tracked, on-site-only redirect for badge clicks. */
export async function serveBadgeRedirect(
  req: NextRequest,
  roasterSlug: string,
  coffeeSlug?: string
): Promise<Response> {
  const redirect = (path: string) => {
    const res = NextResponse.redirect(new URL(path, req.url), 302);
    res.headers.set("Cache-Control", "no-store");
    return res;
  };

  if (
    !isValidSlug(roasterSlug) ||
    (coffeeSlug !== undefined && !isValidSlug(coffeeSlug))
  ) {
    return redirect("/roasters");
  }
  const target = toTarget(roasterSlug, coffeeSlug);
  const params = req.nextUrl.searchParams;
  const { type, placement } = parseBadgeParams(target.entity, params);
  const source = params.get("source") === "qr" ? "qr" : "badge";

  const roaster = await loadRoaster(roasterSlug);
  if (!roaster) return redirect("/roasters");
  const coffee = coffeeSlug
    ? roaster.coffees.find((c) => c.slug === coffeeSlug)
    : undefined;

  // Delisted coffee → its roaster, not a 404.
  const resolved: BadgeTarget =
    coffeeSlug && !coffee ? { entity: "roaster", roasterSlug } : target;
  const [path, hash = ""] = badgeDestinationPath(resolved, type).split("#");
  const utm = new URLSearchParams({
    utm_source: source,
    utm_medium: "referral",
    utm_campaign: "roaster-badges",
    utm_content: `${target.entity}-${type}-${placement}`,
  });
  const destination = `${path}?${utm}${hash ? `#${hash}` : ""}`;

  if (!BOT_UA.test(req.headers.get("user-agent") ?? "")) {
    let referrerHost: string | null = null;
    try {
      referrerHost = new URL(req.headers.get("referer") ?? "").host || null;
    } catch {}
    // Anonymous, person-less event: enough for per-roaster partner reports
    // (§14) without minting a PostHog person per merchant-site visitor.
    captureServerEvent(crypto.randomUUID(), "badge_clicked", {
      $process_person_profile: false,
      entity_type: target.entity,
      roaster_id: roaster.id,
      roaster_slug: roaster.slug,
      coffee_id: coffee?.id ?? null,
      coffee_slug: coffee?.slug ?? null,
      badge_type: type,
      placement,
      source,
      destination: path,
      referrer_host: referrerHost,
    });
  }

  return redirect(destination);
}
