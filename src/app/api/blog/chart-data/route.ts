import { NextResponse } from "next/server";
import { fetchChartData } from "@/lib/data/fetch-chart-data";

/**
 * GET /api/blog/chart-data
 * Returns aggregated data for blog charts.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataKey = searchParams.get("dataKey");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!dataKey) {
      return NextResponse.json(
        { error: "Missing 'dataKey' parameter" },
        { status: 400 }
      );
    }

    const data = await fetchChartData(dataKey, limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /blog/chart-data] Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch chart data",
      },
      { status: 500 }
    );
  }
}
