import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { fetchRoasters } from "@/lib/data/fetch-roasters";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";
import { createApiRouteClient } from "@/lib/supabase/api-route";

/**
 * GET /api/v1/roasters
 * Returns paginated list of roasters. Requires API key.
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
      parseRoasterSearchParams(searchParams);
    // The shared parser defaults to 100 so the /roasters hub ships every profile
    // link in server HTML. Public API consumers keep the 15 they were built on.
    const apiLimit = searchParams.get("limit") ? Math.min(limit, 100) : 15;

    const roasterListResponse = await fetchRoasters(
      filters,
      page,
      apiLimit,
      sort,
      supabase
    );
    return NextResponse.json(roasterListResponse, { headers });
  } catch (error) {
    console.error(
      "[API v1 /roasters] Unhandled error:",
      error,
      error instanceof Error ? error.stack : undefined
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
