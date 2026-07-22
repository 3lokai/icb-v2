import Link from "next/link";
import { Accent } from "@/components/primitives/accent";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import CoffeeCard from "@/components/cards/CoffeeCard";
import type { CoffeeSummary } from "@/types/coffee-types";

type MoreFromRoasterProps = {
  coffees: CoffeeSummary[];
  roasterName: string;
  roasterSlug: string;
};

/**
 * "More from this roaster" — cross-links sibling coffee SKU pages from the same
 * roaster. This flattens crawl depth (SKU ↔ SKU links) and keeps every SKU page
 * well-linked even though the roaster lineup listing page is noindexed.
 */
export function MoreFromRoaster({
  coffees,
  roasterName,
  roasterSlug,
}: MoreFromRoasterProps) {
  if (!coffees || coffees.length === 0) {
    return null;
  }

  return (
    <Stack gap="6">
      <div>
        <div className="inline-flex items-center gap-4 mb-3">
          <span className="h-px w-8 bg-accent/60" />
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            Same roaster
          </span>
        </div>
        <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
          More from <Accent>{roasterName}</Accent>
        </h2>
        <p className="text-caption text-muted-foreground">
          Other coffees in this roaster&apos;s lineup
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {coffees.map((c) => (
          <CoffeeCard key={c.coffee_id} coffee={c} variant="similar" />
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" asChild>
          <Link href={`/roasters/${roasterSlug}`}>
            View {roasterName}&apos;s profile
          </Link>
        </Button>
      </div>
    </Stack>
  );
}
