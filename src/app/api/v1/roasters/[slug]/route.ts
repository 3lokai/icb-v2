import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";
import { createApiRouteClient } from "@/lib/supabase/api-route";

/**
 * GET /api/v1/roasters/[slug]
 * Returns a single roaster by slug. Requires API key.
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
    const roaster = await fetchRoasterBySlug(slug, {
      supabaseClient: supabase,
    });

    if (!roaster) {
      return NextResponse.json(
        { error: "Roaster not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(roaster, { headers });
  } catch (error) {
    console.error(
      "[API v1 /roasters/[slug]] Unhandled error:",
      error,
      error instanceof Error ? error.stack : undefined
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
