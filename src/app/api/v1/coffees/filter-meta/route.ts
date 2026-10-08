import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { fetchCoffeeFilterMetaWithFilters } from "@/lib/data/fetch-coffee-filter-meta-filtered";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { createApiRouteClient } from "@/lib/supabase/api-route";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/v1/coffees/filter-meta
 * Returns filter meta with counts. Requires API key.
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
    const { filters } = parseCoffeeSearchParams(searchParams);
    const meta = await fetchCoffeeFilterMetaWithFilters(filters, supabase);
    return NextResponse.json(meta, { headers });
  } catch (error) {
    console.error("[API v1 /coffees/filter-meta] Unhandled error:", error);
    return NextResponse.json(
      { error: safeErrorMessage(error, "Internal server error") },
      { status: 500, headers }
    );
  }
}
