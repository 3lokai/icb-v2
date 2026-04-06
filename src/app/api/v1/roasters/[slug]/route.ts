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
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createApiRouteClient();
    const roaster = await fetchRoasterBySlug(slug, supabase);

    if (!roaster) {
      return NextResponse.json({ error: "Roaster not found" }, { status: 404 });
    }

    return NextResponse.json(roaster);
  } catch (error) {
    console.error(
      "[API v1 /roasters/[slug]] Unhandled error:",
      error,
      error instanceof Error ? error.stack : undefined
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
