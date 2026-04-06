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
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;

    const supabase = createApiRouteClient();
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseRoasterSearchParams(searchParams);

    const roasterListResponse = await fetchRoasters(
      filters,
      page,
      limit,
      sort,
      supabase
    );
    return NextResponse.json(roasterListResponse);
  } catch (error) {
    console.error(
      "[API v1 /roasters] Unhandled error:",
      error,
      error instanceof Error ? error.stack : undefined
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
