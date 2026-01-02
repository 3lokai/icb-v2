import { NextResponse } from "next/server";
import { fetchRoasterFilterMetaWithFilters } from "@/lib/data/fetch-roaster-filter-meta-filtered";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";

/**
 * GET /api/roasters/filter-meta
 * Returns filter meta with counts filtered by active filters
 * Used for dynamic filter count updates
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search params to get filters
    const { filters } = parseRoasterSearchParams(searchParams);

    // Fetch filtered meta
    const meta = await fetchRoasterFilterMetaWithFilters(filters);

    // Log in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("[API /roasters/filter-meta]", {
        filters,
        totalRoasters: meta.totals.roasters,
      });
    }

    return NextResponse.json(meta);
  } catch (error) {
    console.error("[API /roasters/filter-meta] Error:", error);

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
