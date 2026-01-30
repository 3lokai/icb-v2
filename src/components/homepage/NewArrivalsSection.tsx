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
    <Section spacing="default">
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Freshly Harvested
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                New <span className="text-accent italic">Arrivals.</span>
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                The latest additions to our roster of exceptional Indian coffee
                beans, featuring freshly roasted delights from across the
                country.
              </p>
            </Stack>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
            <Link className="hidden md:block" href="/coffees">
              <Button className="group" variant="outline">
                Browse All Coffees
                <Icon
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  name="ArrowRight"
                />
              </Button>
            </Link>
            <div className="flex md:hidden items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              Just Roasted
              <span className="h-1 w-1 rounded-full bg-accent/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {coffees.map((coffee) => (
          <CoffeeCard coffee={coffee} key={coffee.slug || coffee.coffee_id} />
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href="/coffees">
          <Button className="group w-full sm:w-auto" variant="outline">
            Browse All Coffees
            <Icon
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              name="ArrowRight"
            />
          </Button>
        </Link>
      </div>
    </Section>
  );
}
