"use client";

import { useEffect, useState } from "react";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import type { CoffeeSummary, CoffeeFilters } from "@/types/coffee-types";
import type { ProcessEnum, RoastLevelEnum } from "@/types/db-enums";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";

type SimilarCoffeesProps = {
  currentCoffeeId: string;
  regionIds?: string[];
  process?: string;
  roastLevel?: string;
};

export function SimilarCoffees({
  currentCoffeeId,
  regionIds,
  process,
  roastLevel,
}: SimilarCoffeesProps) {
  const [coffees, setCoffees] = useState<CoffeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchReason, setMatchReason] = useState<string>("");

  useEffect(() => {
    async function getSimilar() {
      try {
        setLoading(true);
        // Strategy: Try matching by region first, then process, then roast
        let filters: CoffeeFilters;
        let reason = "";

        if (regionIds && regionIds.length > 0) {
          filters = { region_ids: regionIds };
          reason = "Chikmagalur region"; // Simplified for now, in real app would lookup region name
        } else if (process) {
          filters = { processes: [process as unknown as ProcessEnum] };
          reason = `${process} process`;
        } else if (roastLevel) {
          filters = { roast_levels: [roastLevel as unknown as RoastLevelEnum] };
          reason = `${roastLevel} roast`;
        } else {
          filters = {};
        }

        const response = await fetchCoffees(filters, 1, 4, "relevance");
        // Filter out current coffee
        const filtered = (response.items || []).filter(
          (c) => c.coffee_id !== currentCoffeeId
        );
        setCoffees(filtered.slice(0, 3));
        setMatchReason(reason);
      } catch (error) {
        console.error("Failed to fetch similar coffees", error);
      } finally {
        setLoading(false);
      }
    }

    getSimilar();
  }, [currentCoffeeId, regionIds, process, roastLevel]);

  if (!loading && coffees.length === 0) return null;

  return (
    <Stack gap="6">
      <div>
        <div className="inline-flex items-center gap-4 mb-3">
          <span className="h-px w-8 bg-accent/60" />
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            Discovery
          </span>
        </div>
        <h3 className="text-title font-serif italic mb-2">
          Explore coffees like this
        </h3>
        <p className="text-caption text-muted-foreground">
          Based on shared attributes, not recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-lg bg-muted animate-pulse"
              />
            ))
          : coffees.map((coffee) => (
              <div key={coffee.coffee_id} className="group flex flex-col gap-2">
                <CoffeeCard coffee={coffee} variant="compact" />
                <div className="flex items-center gap-1.5 px-3">
                  <Icon name="Check" size={12} className="text-accent" />
                  <span className="text-micro font-medium uppercase tracking-wider text-muted-foreground/80">
                    Matches: {matchReason}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </Stack>
  );
}
