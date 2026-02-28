"use client";

import Link from "next/link";
import type { CoffeeDetail } from "@/types/coffee-types";
import { useSimilarCoffees } from "@/hooks/use-similar-coffees";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";

type SimilarCoffeesProps = {
  coffee: CoffeeDetail; // Pass full coffee for all match data
};

export function SimilarCoffees({ coffee }: SimilarCoffeesProps) {
  const { data: similarCoffees, isLoading } = useSimilarCoffees(coffee);

  if (isLoading) {
    return (
      <Stack gap="6">
        <div>
          <div className="inline-flex items-center gap-4 mb-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              Discovery
            </span>
          </div>
          <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
            Explore coffees like{" "}
            <span className="text-accent italic">this</span>
          </h2>
          <p className="text-caption text-muted-foreground">
            Based on shared attributes, not recommendations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </Stack>
    );
  }

  if (!similarCoffees || similarCoffees.length === 0) {
    return null;
  }

  // Build "View more" URL with filters (prefer slugs for shareable URLs)
  const buildViewMoreUrl = (): string => {
    const params = new URLSearchParams();

    // Add flavor filters: prefer slugs, fallback to IDs
    if (coffee.canon_flavor_slugs && coffee.canon_flavor_slugs.length > 0) {
      params.set("flavors", coffee.canon_flavor_slugs.join(","));
    } else if (
      coffee.canon_flavor_node_ids &&
      coffee.canon_flavor_node_ids.length > 0
    ) {
      params.set("canonFlavorIds", coffee.canon_flavor_node_ids.join(","));
    }

    // Add roast level
    if (coffee.roast_level) {
      params.set("roastLevels", coffee.roast_level);
    }

    // Add process
    if (coffee.process) {
      params.set("processes", coffee.process);
    }

    return `/coffees?${params.toString()}`;
  };

  return (
    <Stack gap="6">
      <div>
        <div className="inline-flex items-center gap-4 mb-3">
          <span className="h-px w-8 bg-accent/60" />
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            Discovery
          </span>
        </div>
        <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
          Explore coffees like <span className="text-accent italic">this</span>
        </h2>
        <p className="text-caption text-muted-foreground">
          Based on shared attributes, not recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {similarCoffees.map((match) => {
          // Build match chips (max 3)
          const chips: string[] = [];

          // Add flavor labels (up to 2)
          if (match.overlap_flavor_labels.length > 0) {
            chips.push(...match.overlap_flavor_labels.slice(0, 2));
          }

          // Add roast level if it matches
          if (match.roast_match && coffee.roast_level) {
            const roastLabel = capitalizeFirstLetter(
              coffee.roast_level_raw || coffee.roast_level
            );
            if (!chips.includes(roastLabel) && chips.length < 3) {
              chips.push(roastLabel);
            }
          }

          // Add process if it matches
          if (match.process_match && coffee.process) {
            const processLabel = capitalizeFirstLetter(
              coffee.process_raw || coffee.process
            );
            if (!chips.includes(processLabel) && chips.length < 3) {
              chips.push(processLabel);
            }
          }

          // Add origin if it matches (as fallback)
          if (match.origin_match && chips.length < 3) {
            const originLabel =
              coffee.estates?.[0]?.name ||
              coffee.regions?.[0]?.display_name ||
              coffee.regions?.[0]?.subregion;
            if (originLabel && !chips.includes(originLabel)) {
              chips.push(originLabel);
            }
          }

          return (
            <CoffeeCard
              key={match.coffee.coffee_id}
              coffee={match.coffee}
              variant="similar"
              matchInfo={{
                matchType: match.match_type,
                chips: chips.slice(0, 3),
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" asChild>
          <Link href={buildViewMoreUrl()}>View more similar coffees</Link>
        </Button>
      </div>
    </Stack>
  );
}
