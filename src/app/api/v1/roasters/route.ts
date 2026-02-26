import { NextResponse } from "next/server";
import { fetchRoasters } from "@/lib/data/fetch-roasters";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";
import { validateApiKey } from "@/lib/api/validate-api-key";

/**
 * GET /api/v1/roasters
 * Returns paginated list of roasters. Requires API key.
 */
export async function GET(request: Request) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseRoasterSearchParams(searchParams);

    const roasterListResponse = await fetchRoasters(filters, page, limit, sort);
    return NextResponse.json(roasterListResponse);
  } catch (error) {
    console.error("[API v1 /roasters] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch roasters",
      },
      { status: 500 }
    );
  }
}
