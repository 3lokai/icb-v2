import { NextResponse } from "next/server";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { validateApiKey } from "@/lib/api/validate-api-key";

/**
 * GET /api/v1/coffees
 * Returns paginated list of coffees with filters and sorting.
 * Requires API key (Authorization: Bearer icb_live_xxx or X-API-Key).
 */
export async function GET(request: Request) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseCoffeeSearchParams(searchParams);

    const data = await fetchCoffees(filters, page, limit, sort);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API v1 /coffees] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch coffees",
      },
      { status: 500 }
    );
  }
}
