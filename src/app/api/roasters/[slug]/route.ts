import { NextResponse } from "next/server";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";

/**
 * GET /api/roasters/[slug]
 * Returns a single roaster by slug with all related data
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    // Log in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("[API /roasters/[slug]]", {
        slug,
        roasterId: roaster.id,
        name: roaster.name,
      });
    }

    return NextResponse.json(roaster);
  } catch (error) {
    console.error("[API /roasters/[slug]] Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch roaster",
      },
      { status: 500 }
    );
  }
}
