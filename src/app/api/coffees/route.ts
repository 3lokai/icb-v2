import { NextResponse } from "next/server";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";

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

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /coffees] Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch coffees",
      },
      { status: 500 }
    );
  }
}
