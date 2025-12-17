import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search/build-search-index";

export async function GET() {
  try {
    // Check if service role key is available
    if (!process.env.SUPABASE_SECRET_KEY) {
      console.error(
        "SUPABASE_SECRET_KEY is not set. Search index requires service role access."
      );
      return NextResponse.json(
        {
          error:
            "Search index is not configured. SUPABASE_SECRET_KEY environment variable is required.",
        },
        { status: 503 }
      );
    }

    const items = await buildSearchIndex();

    return NextResponse.json(items, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Future: add cache headers
        // "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to build search index:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to build search index";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
