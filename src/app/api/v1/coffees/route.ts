import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { createApiRouteClient } from "@/lib/supabase/api-route";

/**
 * GET /api/v1/coffees
 * Returns paginated list of coffees with filters and sorting.
 * Requires API key (Authorization: Bearer icb_live_xxx or X-API-Key).
 */
export async function GET(request: Request) {
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;

    const supabase = createApiRouteClient();
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseCoffeeSearchParams(searchParams);

    const data = await fetchCoffees(filters, page, limit, sort, supabase);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API v1 /coffees] Unhandled error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
