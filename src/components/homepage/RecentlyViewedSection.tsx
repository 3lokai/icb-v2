"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { useRecentlyViewedCoffees } from "@/hooks/use-recently-viewed-coffees";
import { coffeeImagePresets } from "@/lib/imagekit";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { cn } from "@/lib/utils";

const sectionSurfaceClassName =
  "bg-background relative overflow-hidden border-y border-border/40";

export default function RecentlyViewedSection() {
  const { data: coffees, isLoading, isError } = useRecentlyViewedCoffees(12);

  if (isLoading) {
    return (
      <Section spacing="loose" className={sectionSurfaceClassName}>
        <div className="relative z-10 flex min-h-[200px] items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Section>
    );
  }

  if (isError || !coffees?.length) {
    return null;
  }

  return (
    <Section spacing="loose" className={sectionSurfaceClassName}>
      <div className="absolute -left-24 -top-24 opacity-[0.04] select-none pointer-events-none">
        <Icon name="Eye" size={320} strokeWidth={1} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stack gap="6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <span className="text-overline text-accent font-semibold tracking-[0.2em]">
                  CONTINUE
                </span>
              </div>
              <h2 className="text-title text-balance leading-tight">
                Recently{" "}
                <span className="font-serif italic text-accent">viewed.</span>
              </h2>
              <p className="mt-2 max-w-xl text-body text-muted-foreground">
                Pick up where you left off—based on coffees you opened on this
                device.
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {coffees.map((c) => {
              const href = coffeeDetailHref(c.roasterSlug, c.coffeeSlug);
              const img =
                c.imageUrl != null
                  ? coffeeImagePresets.coffeeThumbnail(c.imageUrl)
                  : null;
              return (
                <li key={c.coffeeId}>
                  <Link
                    href={href}
                    className={cn(
                      "group flex gap-4 rounded-xl border border-border/60 bg-card/50 p-3 transition-colors",
                      "hover:border-accent/40 hover:bg-card"
                    )}
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {img ? (
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Icon
                            name="Coffee"
                            size={28}
                            className="opacity-40"
                          />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <p className="text-label font-medium leading-snug text-foreground group-hover:text-accent">
                        {c.name}
                      </p>
                      <p className="mt-1 truncate text-caption text-muted-foreground">
                        {c.roasterName}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Stack>
      </div>
    </Section>
  );
}
