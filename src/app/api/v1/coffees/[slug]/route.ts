import { NextResponse } from "next/server";
import { fetchCoffeeBySlug } from "@/lib/data/fetch-coffee-by-slug";
import { validateApiKey } from "@/lib/api/validate-api-key";

/**
 * GET /api/v1/coffees/[slug]
 * Returns a single coffee by slug. Requires API key.
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

    const coffee = await fetchCoffeeBySlug(slug);

    if (!coffee) {
      return NextResponse.json({ error: "Coffee not found" }, { status: 404 });
    }

    return NextResponse.json(coffee);
  } catch (error) {
    console.error("[API v1 /coffees/[slug]] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch coffee",
      },
      { status: 500 }
    );
  }
}
