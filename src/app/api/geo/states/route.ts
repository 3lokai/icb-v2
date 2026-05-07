import { State } from "country-state-city";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("country");

  if (!countryCode) {
    return NextResponse.json(
      { error: "Missing required query parameter: country" },
      { status: 400 }
    );
  }

  const states = State.getStatesOfCountry(countryCode).map((s) => ({
    isoCode: s.isoCode,
    name: s.name,
  }));

  return NextResponse.json(states, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
