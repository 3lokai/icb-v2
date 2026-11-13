// Design-only alternative. The shipped CoffeeCard is intentionally untouched.
// All fields come from the same CoffeeSummary objects used by the real card.
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { coffeeImagePresets } from "@/lib/imagekit";
import { formatPrice } from "@/lib/utils/coffee-utils";
import { formatFlavorLabels } from "@/lib/utils/coffee-card-utils";
import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import type { CoffeeSummary } from "@/types/coffee-types";

type Props = {
  coffee: CoffeeSummary;
  userRating?: number | null;
};

export function MinimalCoffeeCardPreview({ coffee, userRating }: Props) {
  if (!coffee.slug || !coffee.name || !coffee.roaster_slug) return null;

  const name = getCoffeeDisplayName(coffee);
  const href = coffeeDetailHref(coffee.roaster_slug, coffee.slug);
  const notes = formatFlavorLabels(coffee.flavor_keys, 3).join(" · ").toLowerCase();
  const formattedPrice =
    coffee.best_normalized_250g != null
      ? formatPrice(coffee.best_normalized_250g)
      : null;
  const hasCommunityRating =
    coffee.rating_avg != null && coffee.rating_avg > 0 && coffee.rating_count > 0;

  return (
    <article className="group flex h-full w-full max-w-[300px] flex-col" aria-label={`${name} by ${coffee.roaster_name}`}>
      <Link href={href} className="flex flex-1 flex-col">
        {/* Same pressed-paper treatment as the current card, with a square
            frame and a non-cropping image. No wash over original packaging. */}
        <span className="relative block aspect-square w-full overflow-hidden rounded-xl border border-b-[3px] border-border bg-[#F6EFE3] p-2 shadow-[inset_0_0_0_4px_rgb(251_246_236/0.6),0_3px_7px_rgb(45_21_14/0.11)] transition-colors group-hover:border-foreground/30 motion-reduce:transition-none dark:bg-[#E2D4BE]">
          <span className="relative block size-full overflow-hidden rounded-lg">
            <Image
              alt={`${name} by ${coffee.roaster_name}`}
              className="object-contain"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              src={coffeeImagePresets.coffeeCard(coffee.image_url)}
              unoptimized
            />
          </span>
          {coffee.origin_country && (
            <span className="absolute top-2 left-2 rounded-full bg-background/95 px-2 py-1 text-xs text-foreground">
              {coffee.origin_country} origin
            </span>
          )}
        </span>
        <h3 className="mt-3 line-clamp-2 text-heading text-balance underline-offset-4 group-hover:underline">
          {name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-ui-meta">{coffee.roaster_name}</p>
        {notes && (
          <p className="mt-2 line-clamp-1 font-serif text-body italic leading-snug" title={notes}>
            {notes}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-3 text-ui-meta tabular-nums">
          <span className="whitespace-nowrap text-foreground font-medium">
            {formattedPrice ? `${formattedPrice} / 250g` : "Price unavailable"}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap" aria-label={hasCommunityRating ? `${coffee.rating_avg!.toFixed(1)} out of 5 from ${coffee.rating_count} ratings` : "No ratings yet"}>
            {hasCommunityRating ? (
              <>
                <StarIcon aria-hidden className="size-3.5 text-rating" weight="fill" />
                <span>{coffee.rating_avg!.toFixed(1)} ({coffee.rating_count})</span>
              </>
            ) : (
              <span>Not yet rated</span>
            )}
          </span>
        </div>
      </Link>
      {/* This is a visual comparison, not a live submission control.
          IDs are intentionally null. Production's QuickRating is untouched. */}
      <div className="mt-2 flex min-h-11 items-center justify-end border-t border-border/40">
        <span className="text-ui-label text-accent">
          {userRating ? `Yours: ${userRating}` : "Rate it"}
        </span>
      </div>
    </article>
  );
}
