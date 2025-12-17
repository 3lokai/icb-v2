import type { CoffeeCardData, CoffeeSummary } from "@/types/coffee-types";

/**
 * Maps CoffeeSummary (from DB/view) to CoffeeCardData (for UI)
 * This keeps the UI layer decoupled from database schema changes
 */
export function mapCoffeeSummaryToCard(summary: CoffeeSummary): CoffeeCardData {
  return {
    // Identity
    slug: summary.slug ?? "",
    name: summary.name ?? "",
    roasterSlug: summary.roaster_slug ?? "",
    roasterName: summary.roaster_name ?? "",

    // Location
    roasterCity: summary.hq_city ?? null,
    roasterCountry: summary.hq_country ?? null,

    // Display
    imageUrl: summary.image_url ?? null,
    roastLevel: summary.roast_level ?? null,
    process: summary.process ?? null,

    // Commerce
    minPriceInStock: summary.min_price_in_stock ?? null,
    bestNormalized250g: summary.best_normalized_250g ?? null,
    has250g: summary.has_250g_bool ?? null,
    inStockCount: summary.in_stock_count ?? null,
    directBuyUrl: summary.direct_buy_url ?? null,

    // Flags / badges
    decaf: summary.decaf,
    isLimited: summary.is_limited,
    hasSensory: summary.has_sensory ?? null,

    // Social proof
    ratingAvg: summary.rating_avg ?? null,
    ratingCount: summary.rating_count,
  };
}
