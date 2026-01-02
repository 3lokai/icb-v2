import { NextResponse } from "next/server";
import { fetchCoffeeFilterMetaWithFilters } from "@/lib/data/fetch-coffee-filter-meta-filtered";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";

/**
 * GET /api/coffees/filter-meta
 * Returns filter meta with counts filtered by active filters
 * Used for dynamic filter count updates
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search params to get filters
    const { filters } = parseCoffeeSearchParams(searchParams);

    // Fetch filtered meta
    const meta = await fetchCoffeeFilterMetaWithFilters(filters);

    // Log in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("[API /coffees/filter-meta]", {
        filters,
        totalCoffees: meta.totals.coffees,
      });
    }

    return NextResponse.json(meta);
  } catch (error) {
    console.error("[API /coffees/filter-meta] Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch filter meta",
      },
      { status: 500 }
    );
  }
}
