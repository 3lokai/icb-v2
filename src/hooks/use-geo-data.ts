"use client";

import { useState, useEffect, startTransition } from "react";

export type GeoCountry = { isoCode: string; name: string };
export type GeoState = { isoCode: string; name: string };
export type GeoCity = { name: string };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`geo fetch failed: ${url}`);
  return res.json() as Promise<T>;
}

// Pre-seed with India so the Select renders "India" immediately on first paint,
// before the full countries list arrives from the API.
const INDIA_SEED: GeoCountry[] = [{ isoCode: "IN", name: "India" }];

export function useGeoData(countryCode: string, stateCode: string) {
  const [countries, setCountries] = useState<GeoCountry[]>(INDIA_SEED);
  const [states, setStates] = useState<GeoState[]>([]);
  const [cities, setCities] = useState<GeoCity[]>([]);

  useEffect(() => {
    fetchJson<GeoCountry[]>("/api/geo/countries")
      .then(setCountries)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!countryCode) {
      startTransition(() => setStates([]));
      return;
    }
    fetchJson<GeoState[]>(`/api/geo/states?country=${countryCode}`)
      .then((data) => startTransition(() => setStates(data)))
      .catch(() => startTransition(() => setStates([])));
  }, [countryCode]);

  useEffect(() => {
    if (!countryCode || !stateCode) {
      startTransition(() => setCities([]));
      return;
    }
    fetchJson<GeoCity[]>(
      `/api/geo/cities?country=${countryCode}&state=${stateCode}`
    )
      .then((data) => startTransition(() => setCities(data)))
      .catch(() => startTransition(() => setCities([])));
  }, [countryCode, stateCode]);

  return { countries, states, cities };
}
