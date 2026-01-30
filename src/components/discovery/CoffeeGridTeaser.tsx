// src/components/discovery/CoffeeGridTeaser.tsx
import Link from "next/link";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";

type CoffeeGridTeaserProps = {
  filters: CoffeeFilters;
  sortOrder: CoffeeSort;
  limit?: number;
  overline: string;
  title: string;
  description: string;
  seeAllLabel?: string;
  nudge?: string;
};

/**
 * CoffeeGridTeaser - Server component
 * Fetches and displays a limited grid of coffees with "See All" CTA
 * Follows NewArrivalsSection structure pattern
 */
export async function CoffeeGridTeaser({
  filters,
  sortOrder,
  limit = 12,
  overline,
  title,
  description,
  seeAllLabel = "See All Coffees",
  nudge,
}: CoffeeGridTeaserProps) {
  // Fetch coffees server-side
  const result = await fetchCoffees(filters, 1, limit, sortOrder);
  const coffees = result.items.slice(0, limit);

  // Build "See All" link with filters applied
  const queryString = buildCoffeeQueryString(filters, 1, sortOrder, 15);
  const seeAllHref = `/coffees?${queryString}`;

  if (coffees.length === 0) {
    return (
      <Section spacing="default" contained={false}>
        <div className="py-16 text-center">
          <h2 className="mb-4 text-heading text-primary">{title}</h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
          <p className="text-body text-muted-foreground">
            No coffees found matching these criteria.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section spacing="default" contained={false}>
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  {overline}
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                {title.includes("*") ? (
                  <>
                    {title.split("*")[0]}
                    <span className="text-accent italic">
                      {title.split("*")[1]}
                    </span>
                    {title.split("*")[2]}
                  </>
                ) : (
                  title
                )}
              </h2>
              <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Stack>
          </div>
          <div className="md:col-span-4 flex md:justify-end pb-2">
            <Link className="hidden md:block" href={seeAllHref}>
              <Button className="group" variant="outline">
                {seeAllLabel}
                <Icon
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  name="ArrowRight"
                />
              </Button>
            </Link>
            <div className="flex md:hidden items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              {result.total} Available
              <span className="h-1 w-1 rounded-full bg-accent/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Nudge - Subtle guidance above coffee grid */}
      {nudge && (
        <div className="mb-6">
          <p className="text-caption text-muted-foreground italic">{nudge}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coffees.map((coffee) => (
          <CoffeeCard
            coffee={coffee}
            key={
              coffee.coffee_id || coffee.slug || `coffee-${coffee.coffee_id}`
            }
          />
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href={seeAllHref}>
          <Button className="group w-full sm:w-auto" variant="outline">
            {seeAllLabel}
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
