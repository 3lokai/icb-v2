import "server-only";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/data/auth";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type {
  HeroRatedCoffee,
  HeroSegment,
  HeroSegmentPayload,
} from "@/types/hero-segment";
import {
  applyDevHeroSegmentPreview,
  parseDevHeroSegmentParam,
} from "@/lib/data/hero-segment-dev-preview";
import { fetchRecentlyViewedCoffees } from "@/lib/data/fetch-recently-viewed-coffees";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/** Greeting for hero eyebrow: first word of full_name, else username. */
async function fetchHeroDisplayNameShort(
  userId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("full_name, username")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const full = data.full_name?.trim();
  if (full) {
    const first = full.split(/\s+/)[0];
    return first || null;
  }

  const u = data.username?.trim();
  return u || null;
}

function resolveSegment(
  isAuthenticated: boolean,
  ratingCount: number,
  hasViews: boolean
): HeroSegment {
  if (isAuthenticated && ratingCount >= 3) {
    return "authenticated_profile";
  }
  if (!isAuthenticated && ratingCount >= 3) {
    return "anon_conversion";
  }
  if (ratingCount >= 1 && ratingCount <= 2) {
    return "rating_progress";
  }
  if (ratingCount === 0 && hasViews) {
    return "returning_browser";
  }
  return "discovery";
}

async function fetchCoffeeRatingCount(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  filter: { userId: string } | { anonId: string }
): Promise<number> {
  let q = supabase
    .from("latest_reviews_per_identity")
    .select("entity_id", { count: "exact", head: true })
    .eq("entity_type", "coffee")
    .not("rating", "is", null);

  if ("userId" in filter) {
    q = q.eq("user_id", filter.userId);
  } else {
    q = q.eq("anon_id", filter.anonId);
  }

  const { count, error } = await q;

  if (error) {
    console.error("[fetchHeroSegment] rating count:", error);
    return 0;
  }

  return count ?? 0;
}

async function fetchRatedCoffeeRowsLimited(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  filter: { userId: string } | { anonId: string },
  limit: number
): Promise<
  { entity_id: string; rating: number | null; created_at: string | null }[]
> {
  let q = supabase
    .from("latest_reviews_per_identity")
    .select("entity_id, rating, created_at")
    .eq("entity_type", "coffee")
    .not("rating", "is", null);

  if ("userId" in filter) {
    q = q.eq("user_id", filter.userId);
  } else {
    q = q.eq("anon_id", filter.anonId);
  }

  // Newest submission first — hero cards follow this order end-to-end.
  const { data, error } = await q
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fetchHeroSegment] reviews:", error);
    return [];
  }

  return (data ?? []).filter(
    (r): r is typeof r & { entity_id: string } =>
      r.entity_id != null && typeof r.entity_id === "string"
  );
}

/** Supabase may type `roasters` as a single row or an array for the same relation. */
function roasterFromJoin(
  roasters: unknown
): { name: string; slug: string } | null {
  if (roasters == null) return null;
  const row = Array.isArray(roasters) ? roasters[0] : roasters;
  if (!row || typeof row !== "object") return null;
  const o = row as { name?: unknown; slug?: unknown };
  if (o.name == null || o.slug == null) return null;
  return { name: String(o.name), slug: String(o.slug) };
}

/**
 * Enriches review rows with coffee/roaster/image. Preserves `rows` order
 * (newest review first when rows are from fetchRatedCoffeeRowsLimited).
 */
async function enrichRatedCoffees(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  rows: { entity_id: string; rating: number | null }[]
): Promise<HeroRatedCoffee[]> {
  const slice = rows.slice(0, 3);
  if (slice.length === 0) return [];

  const ids = slice.map((r) => r.entity_id);
  const { data: coffeesData, error: coffeesError } = await supabase
    .from("coffees")
    .select(
      `
      id,
      name,
      slug,
      roaster_id,
      roasters!inner(
        name,
        slug
      )
    `
    )
    .in("id", ids);

  const coffeeMap = new Map(
    (coffeesError || !coffeesData?.length ? [] : coffeesData).map((c) => [
      c.id,
      c,
    ])
  );

  const { data: imageRows } = await supabase
    .from("coffee_images")
    .select("coffee_id, imagekit_url, url")
    .in("coffee_id", ids)
    .order("sort_order", { ascending: true });

  const imageByCoffee = new Map<string, string>();
  for (const imageRow of imageRows ?? []) {
    const href = imageRow.imagekit_url || imageRow.url;
    if (imageRow.coffee_id && href && !imageByCoffee.has(imageRow.coffee_id)) {
      imageByCoffee.set(imageRow.coffee_id, href);
    }
  }

  return slice.map((row) => {
    const coffee = coffeeMap.get(row.entity_id);
    const roaster = roasterFromJoin(coffee?.roasters);
    const missing = !coffee;
    return {
      coffeeId: row.entity_id,
      name: missing ? "Coffee unavailable" : (coffee?.name ?? "Coffee"),
      coffeeSlug: coffee?.slug ?? "",
      roasterSlug: roaster?.slug ?? "",
      roasterName: roaster?.name ?? "",
      imageUrl: imageByCoffee.get(row.entity_id) ?? null,
      rating: row.rating,
    };
  });
}

const DISCOVERY_FALLBACK: HeroSegmentPayload = {
  segment: "discovery",
  ratingCount: 0,
  recentlyViewed: [],
  ratedCoffees: [],
  isAuthenticated: false,
  displayNameShort: null,
};

export type FetchHeroSegmentOptions = {
  /** Raw `heroSegment` query value; only applied in development */
  devSegmentParam?: string | null;
};

/**
 * Server-only hero segment + v1 lists (ratings count, recently viewed, rated coffee cards).
 * On any failure, returns discovery-safe defaults (SEO / Rule 3).
 */
export async function fetchHeroSegment(
  options?: FetchHeroSegmentOptions
): Promise<HeroSegmentPayload> {
  try {
    const user = await getCurrentUser();
    const supabase = await createServiceRoleClient();

    const [recentlyViewedRaw, displayNameShort] = await Promise.all([
      fetchRecentlyViewedCoffees(3),
      user ? fetchHeroDisplayNameShort(user.id) : Promise.resolve(null),
    ]);

    const recentlyViewed = recentlyViewedRaw.slice(0, 3);
    const hasViews = recentlyViewed.length > 0;

    let ratingCount = 0;
    let reviewRows: {
      entity_id: string;
      rating: number | null;
      created_at: string | null;
    }[] = [];

    if (user) {
      ratingCount = await fetchCoffeeRatingCount(supabase, {
        userId: user.id,
      });
      if (ratingCount > 0) {
        reviewRows = await fetchRatedCoffeeRowsLimited(
          supabase,
          { userId: user.id },
          3
        );
      }
    } else {
      const cookieStore = await cookies();
      const anonId = cookieStore.get("icb_anon_id")?.value ?? null;
      if (anonId && isUuid(anonId)) {
        ratingCount = await fetchCoffeeRatingCount(supabase, { anonId });
        if (ratingCount > 0) {
          reviewRows = await fetchRatedCoffeeRowsLimited(
            supabase,
            { anonId },
            3
          );
        }
      }
    }

    const segment = resolveSegment(!!user, ratingCount, hasViews);

    const ratedCoffees = await enrichRatedCoffees(supabase, reviewRows);

    const payload: HeroSegmentPayload = {
      segment,
      ratingCount: Math.max(0, ratingCount),
      recentlyViewed,
      ratedCoffees,
      isAuthenticated: !!user,
      displayNameShort,
    };

    if (process.env.NODE_ENV === "development") {
      const devSeg = parseDevHeroSegmentParam(options?.devSegmentParam ?? null);
      if (devSeg) {
        return applyDevHeroSegmentPreview(payload, devSeg);
      }
    }

    return payload;
  } catch (e) {
    console.error("[fetchHeroSegment]", e);
    return { ...DISCOVERY_FALLBACK };
  }
}
