import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { createApiRouteClient } from "@/lib/supabase/api-route";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/v1/coffees
 * Returns paginated list of coffees with filters and sorting.
 * Requires API key (Authorization: Bearer icb_live_xxx or X-API-Key).
 */
export async function GET(request: Request) {
  // Hoisted so every response after the key is accepted, errors included,
  // carries the rate-limit and quota headers.
  let headers: Record<string, string> | undefined;
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;
    headers = auth.headers;

    const supabase = createApiRouteClient();
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseCoffeeSearchParams(searchParams);

    const data = await fetchCoffees(
      filters,
      page,
      Math.min(limit, 100),
      sort,
      supabase
    );
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("[API v1 /coffees] Unhandled error:", error);
    return NextResponse.json(
      { error: safeErrorMessage(error, "Internal server error") },
      { status: 500, headers }
    );
  }
}
