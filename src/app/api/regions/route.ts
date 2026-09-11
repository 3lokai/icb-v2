import { NextResponse } from "next/server";
import { fetchRegions } from "@/lib/data/fetch-regions";
import { parseRegionSearchParams } from "@/lib/filters/region-url";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseRegionSearchParams(searchParams);

    const regionListResponse = await fetchRegions(filters, page, limit, sort);

    return NextResponse.json(regionListResponse, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error: any) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch regions" },
      { status: 500 }
    );
  }
}
