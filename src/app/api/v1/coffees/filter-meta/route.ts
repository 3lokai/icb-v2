import { NextResponse } from "next/server";
import { fetchCoffeeFilterMetaWithFilters } from "@/lib/data/fetch-coffee-filter-meta-filtered";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { validateApiKey } from "@/lib/api/validate-api-key";

/**
 * GET /api/v1/coffees/filter-meta
 * Returns filter meta with counts. Requires API key.
 */
export async function GET(request: Request) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const { filters } = parseCoffeeSearchParams(searchParams);
    const meta = await fetchCoffeeFilterMetaWithFilters(filters);
    return NextResponse.json(meta);
  } catch (error) {
    console.error("[API v1 /coffees/filter-meta] Error:", error);
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
