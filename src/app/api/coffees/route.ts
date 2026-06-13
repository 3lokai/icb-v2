import { NextResponse } from "next/server";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/coffees
 * Returns paginated list of coffees with filters and sorting
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search params using the same helper as page.tsx
    const { filters, page, limit, sort } =
      parseCoffeeSearchParams(searchParams);

    // Fetch coffees using the single data access function
    const data = await fetchCoffees(filters, page, limit, sort);

    // Log in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("[API /coffees]", {
        filters,
        page,
        limit,
        sort,
        resultCount: data.items.length,
        total: data.total,
      });
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("[API /coffees] Error:", error);

    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch coffees") },
      { status: 500 }
    );
  }
}
