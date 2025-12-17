import type { CoffeeSummary } from "@/types/coffee-types";

/**
 * Format price in INR currency
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price) {
    return "";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Compute ribbon badge for coffee based on various criteria
 */
export function computeCoffeeRibbon(
  coffee: CoffeeSummary
): "featured" | "new" | "editors-pick" | "seasonal" | null {
  // Check if coffee has featured tag
  if (coffee.tags?.includes("featured")) {
    return "featured";
  }

  // Check if coffee is new (created within last 30 days)
  // Note: This would require created_at field which might not be in CoffeeSummary
  // For now, we'll check tags
  if (coffee.tags?.includes("new")) {
    return "new";
  }

  // Check for editor's pick tag
  if (coffee.tags?.includes("editors-pick")) {
    return "editors-pick";
  }

  // Check for seasonal tag
  if (coffee.tags?.includes("seasonal")) {
    return "seasonal";
  }

  return null;
}
