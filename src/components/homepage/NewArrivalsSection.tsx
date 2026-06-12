"use client";

// src/components/home/NewArrivalsSection.tsx
import Link from "next/link";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Icon } from "@/components/common/Icon";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Accent } from "@/components/primitives/accent";
import { Decor } from "@/components/primitives/decor";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { useNewArrivalCoffees } from "@/hooks/useHomePageQueries";

export default function NewArrivalsSection() {
  const { data, isLoading } = useNewArrivalCoffees(5);
  const coffees = data?.items || [];

  if (isLoading) {
    return (
      <Section spacing="default">
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </Section>
    );
  }

  if (coffees.length === 0) {
    return (
      <Section spacing="default">
        <div className="py-16 text-center">
          <h2 className="mb-4 text-heading text-primary">New Arrivals</h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
          <p className="text-body text-muted-foreground">
            New arrivals coming soon...
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      spacing="default"
      className="relative overflow-hidden group/arrivals"
    >
      <Decor wash />

      <div className="relative z-10">
        <div className="text-left mb-12">
          <Stack gap="4" className="items-start">
            <h2 className="text-title lg:text-display text-balance leading-[1.1] tracking-tight">
              New <Accent>Arrivals.</Accent>
            </h2>
            <p className="max-w-xl text-body text-muted-foreground leading-relaxed">
              The latest additions to our roster of exceptional Indian coffee
              beans, featuring freshly roasted delights from across the country.
            </p>
          </Stack>
        </div>

        {/* Horizontal shelf: equal cards, scroll-snap — a distinct rhythm from the static grids */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 -mx-4 pb-4 scrollbar-hide md:px-0 md:mx-0">
          {coffees.map((coffee) => (
            <div
              key={coffee.slug || coffee.coffee_id}
              className="w-[280px] shrink-0 snap-start sm:w-[300px]"
            >
              <CoffeeCard coffee={coffee} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/coffees">
            <Button
              variant="ghost"
              className="group text-overline font-bold tracking-[0.15em] uppercase hover:bg-transparent hover:text-accent transition-all"
            >
              Explore all additions
              <Icon
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                name="ArrowRight"
              />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
