import { Country } from "country-state-city";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const countries = Country.getAllCountries().map((c) => ({
    isoCode: c.isoCode,
    name: c.name,
  }));

  return NextResponse.json(countries, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
