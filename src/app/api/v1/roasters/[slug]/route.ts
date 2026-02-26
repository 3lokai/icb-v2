import { NextResponse } from "next/server";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";
import { validateApiKey } from "@/lib/api/validate-api-key";

/**
 * GET /api/v1/roasters/[slug]
 * Returns a single roaster by slug. Requires API key.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const roaster = await fetchRoasterBySlug(slug);

    if (!roaster) {
      return NextResponse.json({ error: "Roaster not found" }, { status: 404 });
    }

    return NextResponse.json(roaster);
  } catch (error) {
    console.error("[API v1 /roasters/[slug]] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch roaster",
      },
      { status: 500 }
    );
  }
}
