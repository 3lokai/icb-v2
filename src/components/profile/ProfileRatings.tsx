"use client";

import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";

type Rating = {
  id: string;
  name: string;
  roaster: string;
  rating: number;
  date: string;
  comment?: string;
  image?: string;
  coffeeSlug?: string;
  roasterSlug?: string;
};

type ProfileRatingsProps = {
  ratings: Rating[];
  isOwner?: boolean;
  isAnonymous?: boolean;
};

export function ProfileRatings({
  ratings,
  isOwner = false,
  isAnonymous = false,
}: ProfileRatingsProps) {
  return (
    <Stack gap="8">
      <Cluster align="center">
        <Stack gap="6">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              RATINGS
            </span>
          </div>
          <Stack gap="1">
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              Recent <span className="text-accent italic">Ratings.</span>
            </h2>
            <p className="text-caption">
              {isAnonymous
                ? "Your local coffee record. Sign up to save it permanently."
                : "My chronological coffee record."}
            </p>
          </Stack>
        </Stack>
        {isOwner && (
          <Button asChild size="sm" className="rounded-full shadow-md ml-auto">
            <Link href="/coffees">
              <Icon name="Plus" size={14} className="mr-2" />
              {isAnonymous ? "Rate more coffees" : "Rate a coffee"}
            </Link>
          </Button>
        )}
      </Cluster>

      {ratings.length === 0 ? (
        <Card className="py-20 border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center py-20 gap-0">
          <Icon
            name="Coffee"
            size={32}
            className="text-muted-foreground/30 mb-4"
          />
          <p className="text-body-muted italic">
            “No ratings yet. Start rating coffees to build your profile.”
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ratings.slice(0, 6).map((rating) => {
            const cardContent = (
              <CardContent className="p-5">
                <Stack gap="3">
                  <Cluster align="start">
                    <Stack gap="1">
                      <h3
                        className={
                          rating.roasterSlug && rating.coffeeSlug
                            ? "text-body font-serif font-medium leading-tight group-hover:text-accent transition-colors"
                            : "text-body font-serif font-medium leading-tight"
                        }
                      >
                        {rating.name}
                      </h3>
                      <p className="text-micro text-muted-foreground uppercase tracking-tight">
                        {rating.roaster}
                      </p>
                    </Stack>
                    <div className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded text-micro font-bold flex items-center gap-0.5 border border-amber-500/20">
                      <Icon name="Star" size={10} className="fill-amber-600" />
                      {rating.rating.toFixed(1)}
                    </div>
                  </Cluster>

                  {rating.comment && (
                    <p className="text-caption line-clamp-2 italic text-muted-foreground/80 leading-snug">
                      &quot;{rating.comment}&quot;
                    </p>
                  )}

                  <p className="text-micro text-muted-foreground/60">
                    {rating.date}
                  </p>
                </Stack>
              </CardContent>
            );

            return (
              <Card
                key={rating.id}
                className="border-border/40 hover:border-accent/40 hover:bg-muted/5 transition-all group rounded-2xl"
              >
                {rating.roasterSlug && rating.coffeeSlug ? (
                  <Link
                    href={coffeeDetailHref(
                      rating.roasterSlug,
                      rating.coffeeSlug
                    )}
                    className="block"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </Card>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
