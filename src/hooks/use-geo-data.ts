"use client";

import { useState, useEffect, startTransition } from "react";

export type GeoCountry = { isoCode: string; name: string };
export type GeoState = { isoCode: string; name: string };
export type GeoCity = { name: string };

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchJson<GeoCountry[]>("/api/geo/countries")
      .then((data) => {
        setCountries(data);
        setError(null);
      })
      .catch((err: unknown) => {
        const normalizedError =
          err instanceof Error ? err : new Error("failed to load countries");
        setError(normalizedError);
        console.error(normalizedError);
      });
  }, []);

  useEffect(() => {
    if (!countryCode) {
      startTransition(() => setStates([]));
      return;
    }
    const controller = new AbortController();
    fetchJson<GeoState[]>(
      `/api/geo/states?country=${countryCode}`,
      controller.signal
    )
      .then((data) => startTransition(() => setStates(data)))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        startTransition(() => setStates([]));
      });

    return () => controller.abort();
  }, [countryCode]);

  useEffect(() => {
    if (!countryCode || !stateCode) {
      startTransition(() => setCities([]));
      return;
    }
    const controller = new AbortController();
    fetchJson<GeoCity[]>(
      `/api/geo/cities?country=${countryCode}&state=${stateCode}`,
      controller.signal
    )
      .then((data) => startTransition(() => setCities(data)))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        startTransition(() => setCities([]));
      });

    return () => controller.abort();
  }, [countryCode, stateCode]);

  return { countries, states, cities, error };
}
