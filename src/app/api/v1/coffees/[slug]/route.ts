import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { fetchCoffeeBySlug } from "@/lib/data/fetch-coffee-by-slug";
import { createApiRouteClient } from "@/lib/supabase/api-route";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/v1/coffees/[slug]
 * Returns a single coffee by slug. Requires API key.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Hoisted so every response after the key is accepted, errors included,
  // carries the rate-limit and quota headers.
  let headers: Record<string, string> | undefined;
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;
    headers = auth.headers;

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400, headers }
      );
    }

    const supabase = createApiRouteClient();
    const coffee = await fetchCoffeeBySlug(slug, supabase);

    if (!coffee) {
      return NextResponse.json(
        { error: "Coffee not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(coffee, { headers });
  } catch (error) {
    console.error("[API v1 /coffees/[slug]] Unhandled error:", error);
    return NextResponse.json(
      { error: safeErrorMessage(error, "Internal server error") },
      { status: 500, headers }
    );
  }
}
