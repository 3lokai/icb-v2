import { NextResponse } from "next/server";
import { fetchEstateBySlug } from "@/lib/data/fetch-estate-by-slug";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/estates/[slug]
 * Returns a single estate by slug with all related data
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

    const estate = await fetchEstateBySlug(slug);

    if (!estate) {
      return NextResponse.json({ error: "Estate not found" }, { status: 404 });
    }

    return NextResponse.json(estate);
  } catch (error) {
    console.error("[API /estates/[slug]] Error:", error);

    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch estate") },
      { status: 500 }
    );
  }
}
