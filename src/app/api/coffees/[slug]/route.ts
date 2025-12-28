import { NextResponse } from "next/server";
import { fetchCoffeeBySlug } from "@/lib/data/fetch-coffee-by-slug";

/**
 * GET /api/coffees/[slug]
 * Returns a single coffee by slug with all related data
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

    const coffee = await fetchCoffeeBySlug(slug);

    if (!coffee) {
      return NextResponse.json({ error: "Coffee not found" }, { status: 404 });
    }

    // Log in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("[API /coffees/[slug]]", {
        slug,
        coffeeId: coffee.id,
        name: coffee.name,
      });
    }

    return NextResponse.json(coffee);
  } catch (error) {
    console.error("[API /coffees/[slug]] Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch coffee",
      },
      { status: 500 }
    );
  }
}
