import { NextResponse } from "next/server";
import { fetchRegionBySlug } from "@/lib/data/fetch-region-by-slug";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/regions/[slug]
 * Returns a single region by slug with all related data
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

    const region = await fetchRegionBySlug(slug);

    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    return NextResponse.json(region);
  } catch (error) {
    console.error("[API /regions/[slug]] Error:", error);

    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch region") },
      { status: 500 }
    );
  }
}
