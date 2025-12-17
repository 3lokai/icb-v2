import { NextResponse } from "next/server";
import { fetchRoasters } from "@/lib/data/fetch-roasters";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { filters, page, limit, sort } =
      parseRoasterSearchParams(searchParams);

    const roasterListResponse = await fetchRoasters(filters, page, limit, sort);

    return NextResponse.json(roasterListResponse);
  } catch (error: any) {
    console.error("Error fetching roasters:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch roasters" },
      { status: 500 }
    );
  }
}
