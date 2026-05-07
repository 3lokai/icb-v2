import { City } from "country-state-city";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("country");
  const stateCode = searchParams.get("state");

  if (!countryCode || !stateCode) {
    return NextResponse.json(
      { error: "Missing required query parameters: country, state" },
      { status: 400 }
    );
  }

  const cities = City.getCitiesOfState(countryCode, stateCode).map((c) => ({
    name: c.name,
  }));

  return NextResponse.json(cities, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
