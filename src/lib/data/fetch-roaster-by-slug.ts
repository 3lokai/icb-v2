import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { fetchCoffeeImages } from "./fetch-coffees";
import type { RoasterDetail } from "@/types/roaster-types";
import type { CoffeeSummary } from "@/types/coffee-types";

/**
 * Fetch a single roaster by slug with all related data
 * Returns null if roaster not found
 */
export async function fetchRoasterBySlug(
  slug: string
): Promise<RoasterDetail | null> {
  // Try to use service role client if available (bypasses RLS for server-side queries)
  // Fallback to regular client if service role key is not set
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  // Fetch roaster from roasters table
  const { data: roasterData, error: roasterError } = await supabase
    .from("roasters")
    .select("*")
    .eq("slug", slug)
    .single();

  if (roasterError || !roasterData) {
    return null;
  }

  const roasterId = roasterData.id;

  // Fetch coffees for this roaster and calculate stats in parallel
  const [coffeesResult, coffeeStatsResult] = await Promise.all([
    // Fetch coffees from coffee_summary view (limited to 15)
    supabase
      .from("coffee_summary")
      .select(
        "coffee_id, slug, name, roaster_id, status, process, process_raw, roast_level, roast_level_raw, roast_style_raw, direct_buy_url, has_250g_bool, has_sensory, in_stock_count, min_price_in_stock, best_variant_id, best_normalized_250g, weights_available, sensory_public, sensory_updated_at"
      )
      .eq("roaster_id", roasterId)
      .order("name", { ascending: true })
      .limit(15),

    // Fetch coffee stats for aggregation
    supabase
      .from("coffees")
      .select("id, status, rating_avg, rating_count")
      .eq("roaster_id", roasterId),
  ]);

  // Calculate stats
  const coffeeStats = coffeeStatsResult.data || [];
  const totalCoffeeCount = coffeeStats.length;
  const activeCoffeeCount = coffeeStats.filter(
    (c) => c.status === "active"
  ).length;

  // Calculate average coffee rating (weighted by rating_count)
  let avgCoffeeRating: number | null = null;
  let totalRatingSum = 0;
  let totalRatingCount = 0;

  for (const coffee of coffeeStats) {
    if (coffee.rating_avg && coffee.rating_count > 0) {
      totalRatingSum += coffee.rating_avg * coffee.rating_count;
      totalRatingCount += coffee.rating_count;
    }
  }

  if (totalRatingCount > 0) {
    avgCoffeeRating = totalRatingSum / totalRatingCount;
  }

  // Transform coffees data
  const coffeesData = coffeesResult.data || [];
  const coffeeIds = coffeesData
    .map((c) => c.coffee_id)
    .filter((id): id is string => Boolean(id));

  // Fetch additional coffee data and images in parallel
  const [coffeesEnrichResult, imagesMap] = await Promise.all([
    // Fetch additional fields from coffees table
    coffeeIds.length > 0
      ? supabase
          .from("coffees")
          .select(
            "id, decaf, is_limited, bean_species, rating_avg, rating_count, tags"
          )
          .in("id", coffeeIds)
      : { data: null, error: null },

    // Fetch images for all coffees
    coffeeIds.length > 0 ? fetchCoffeeImages(supabase, coffeeIds) : new Map(),
  ]);

  // Build coffees map for enrichment
  const coffeesMap = new Map();
  if (coffeesEnrichResult.data) {
    for (const coffee of coffeesEnrichResult.data) {
      coffeesMap.set(coffee.id, coffee);
    }
  }

  // Transform to CoffeeSummary array
  const coffees: CoffeeSummary[] = coffeesData.map((row) => {
    const coffeeId = row.coffee_id;
    const coffeeEnrich = coffeeId ? coffeesMap.get(coffeeId) : null;
    const imageUrl = coffeeId ? (imagesMap.get(coffeeId) ?? null) : null;

    return {
      coffee_id: coffeeId ?? null,
      slug: row.slug ?? null,
      name: row.name ?? null,
      roaster_id: row.roaster_id ?? null,
      status: row.status ?? null,
      process: row.process ?? null,
      process_raw: row.process_raw ?? null,
      roast_level: row.roast_level ?? null,
      roast_level_raw: row.roast_level_raw ?? null,
      roast_style_raw: row.roast_style_raw ?? null,
      direct_buy_url: row.direct_buy_url ?? null,
      has_250g_bool: row.has_250g_bool ?? null,
      has_sensory: row.has_sensory ?? null,
      in_stock_count: row.in_stock_count ?? null,
      min_price_in_stock: row.min_price_in_stock ?? null,
      best_variant_id: row.best_variant_id ?? null,
      best_normalized_250g: row.best_normalized_250g ?? null,
      weights_available: row.weights_available ?? null,
      sensory_public: row.sensory_public ?? null,
      sensory_updated_at: row.sensory_updated_at ?? null,
      decaf: coffeeEnrich?.decaf ?? false,
      is_limited: coffeeEnrich?.is_limited ?? false,
      bean_species: coffeeEnrich?.bean_species ?? null,
      rating_avg: coffeeEnrich?.rating_avg ?? null,
      rating_count: coffeeEnrich?.rating_count ?? 0,
      tags: coffeeEnrich?.tags ?? null,
      roaster_slug: roasterData.slug,
      roaster_name: roasterData.name,
      hq_city: roasterData.hq_city ?? null,
      hq_state: roasterData.hq_state ?? null,
      hq_country: roasterData.hq_country ?? null,
      website: roasterData.website ?? null,
      image_url: imageUrl,
    } as CoffeeSummary;
  });

  // Build RoasterDetail object
  const roasterDetail: RoasterDetail = {
    id: roasterData.id,
    slug: roasterData.slug,
    name: roasterData.name,
    description: roasterData.description ?? null,
    logo_url: roasterData.logo_url ?? null,
    website: roasterData.website ?? null,
    is_active: roasterData.is_active,
    hq_city: roasterData.hq_city ?? null,
    hq_state: roasterData.hq_state ?? null,
    hq_country: roasterData.hq_country ?? null,
    lat: roasterData.lat ?? null,
    lon: roasterData.lon ?? null,
    phone: roasterData.phone ?? null,
    support_email: roasterData.support_email ?? null,
    instagram_handle: roasterData.instagram_handle ?? null,
    social_json: roasterData.social_json ?? {},
    created_at: roasterData.created_at,
    updated_at: roasterData.updated_at,
    default_concurrency: roasterData.default_concurrency ?? null,
    avg_rating: roasterData.avg_rating ?? null,
    avg_customer_support: roasterData.avg_customer_support ?? null,
    avg_delivery_experience: roasterData.avg_delivery_experience ?? null,
    avg_packaging: roasterData.avg_packaging ?? null,
    avg_value_for_money: roasterData.avg_value_for_money ?? null,
    total_ratings_count: roasterData.total_ratings_count ?? null,
    recommend_percentage: roasterData.recommend_percentage ?? null,
    ratings_updated_at: roasterData.ratings_updated_at ?? null,
    coffees,
    coffee_count: totalCoffeeCount,
    active_coffee_count: activeCoffeeCount,
    avg_coffee_rating: avgCoffeeRating,
  };

  return roasterDetail;
}
