import { NextResponse } from "next/server";
import { fetchEstates } from "@/lib/data/fetch-estates";
import { parseEstateSearchParams } from "@/lib/filters/estate-url";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseEstateSearchParams(searchParams);

    const estateListResponse = await fetchEstates(filters, page, limit, sort);

    return NextResponse.json(estateListResponse, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error: any) {
    console.error("Error fetching estates:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch estates" },
      { status: 500 }
    );
  }
}
