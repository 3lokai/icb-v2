"use client";

// src/components/home/NewArrivalsSection.tsx
import Link from "next/link";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Icon } from "@/components/common/Icon";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { useNewArrivalCoffees } from "@/hooks/useHomePageQueries";

export default function NewArrivalsSection() {
  const { data, isLoading } = useNewArrivalCoffees(6);
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
      {/* Subtle organic background shape */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="text-left mb-16">
          <Stack gap="4" className="items-start">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 bg-accent/40" />
              <span className="text-overline text-muted-foreground tracking-[0.2em]">
                JUST LANDED
              </span>
              <span className="h-px w-8 bg-accent/40" />
            </div>
            <h2 className="text-title lg:text-display text-balance leading-[1.1] tracking-tight">
              New{" "}
              <span className="text-accent italic font-serif">Arrivals.</span>
            </h2>
            <p className="max-w-xl text-body text-muted-foreground leading-relaxed mt-4">
              The latest additions to our roster of exceptional Indian coffee
              beans, featuring freshly roasted delights from across the country.
            </p>
          </Stack>
        </div>

        {/* Card Container - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="relative">
          {/* Subtle "Shelf" background strip for desktop depth */}
          <div className="absolute top-1/2 left-0 right-0 h-[70%] bg-muted/10 -translate-y-1/2 rounded-[2.5rem] -z-10 hidden md:block" />

          <div className="flex overflow-x-auto pb-8 md:pb-0 scrollbar-hide md:grid md:grid-cols-4 gap-6 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory">
            {coffees.map((coffee) => (
              <div
                key={coffee.slug || coffee.coffee_id}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center transition-transform duration-300 hover:scale-[1.02] md:hover:scale-100"
              >
                <CoffeeCard coffee={coffee} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
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
