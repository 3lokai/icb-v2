"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { CoffeeIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface CoffeeSpotlightProps {
  value: {
    coffeeId?: string;
    // Legacy support
    image?: any;
    name?: string;
    description?: string;
    tags?: string[];
    link?: string;
  };
}

// Sanity drafts carry authoring placeholders like "[DATA: Populate with a
// Karnataka washed lot]" in the legacy name/description fields. Rendering those
// produces a card that looks interactive but points nowhere, which is where the
// article dead-clicks came from — treat a placeholder as no data at all.
function isPlaceholder(text?: string): boolean {
  return /^\s*\[DATA[:\]]/i.test(text ?? "");
}

function SpotlightCard({
  data,
  isLegacy = false,
}: {
  data: any;
  isLegacy?: boolean;
}) {
  const displayName = isLegacy
    ? (data.name as string)
    : getCoffeeDisplayName(data);

  // fetchCoffeeBySlug returns a CoffeeDetail (nested `roaster`, `images[]`,
  // `flavor_notes[]`), but this card was written against the flat list/summary
  // shape (roaster_slug, image_url, flavor_notes_canonical). Read either, so the
  // card works whichever shape it is handed.
  const roasterName = data.roaster_name ?? data.roaster?.name;
  const roasterSlug = data.roaster_slug ?? data.roaster?.slug;
  const imageUrl = data.image_url ?? data.images?.[0]?.imagekit_url;
  const noteLabels: string[] =
    data.flavor_notes_canonical ??
    data.flavor_notes?.map((n: { label: string }) => n.label) ??
    [];

  // The card lifts and zooms on hover, so readers click the body, not just the
  // CTA. Make the whole card the link (matching CoffeeCard) and render the CTA
  // as a visual affordance, so there is no nested anchor.
  const href = isLegacy
    ? data.link || "#"
    : `/roasters/${roasterSlug}/coffees/${data.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="not-prose group my-12 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-lg transition-all hover:shadow-2xl hover:border-border/80"
    >
      <Link
        href={href}
        aria-label={`${displayName}${roasterName && !isLegacy ? ` by ${roasterName}` : ""} — view details`}
        className="flex flex-col gap-8 p-6 md:flex-row md:items-center lg:p-10"
      >
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-muted/50 md:w-48 lg:w-56 shadow-inner">
          {(isLegacy ? data.image : imageUrl) && (
            <Image
              src={
                isLegacy
                  ? urlFor(data.image).width(600).height(600).url()
                  : imageUrl
              }
              alt={displayName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-title font-bold text-foreground leading-tight tracking-tight">
                {displayName}
              </h2>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                Coffee
              </Badge>
            </div>
            <p className="text-body-large font-medium text-muted-foreground/80 italic font-serif">
              {isLegacy ? "Specialty Coffee" : roasterName}
            </p>
          </div>

          <p className="text-body text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3">
            {isLegacy
              ? data.description
              : `Experience the unique flavor profile of ${displayName}. This ${data.process || "carefully processed"} coffee offers a balanced and distinctive cup.`}
          </p>

          <div className="flex flex-wrap gap-2">
            {(isLegacy ? data.tags : noteLabels)
              ?.slice(0, 4)
              .map((note: string) => (
                <Badge
                  key={note}
                  variant="outline"
                  className="text-micro font-bold uppercase tracking-widest bg-muted/30 border-border/50 text-muted-foreground/80"
                >
                  {note}
                </Badge>
              ))}
          </div>

          <div className="pt-4">
            <span
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-xl shadow-md transition-all group-hover:translate-y-[-2px] group-hover:shadow-lg"
              )}
            >
              View Beans{" "}
              <Icon
                icon={CoffeeIcon}
                size={18}
                className="ml-2"
                data-icon="inline-end"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CoffeeSpotlight({ value }: CoffeeSpotlightProps) {
  const { data: coffee, isLoading } = useQuery({
    queryKey: queryKeys.blog.coffeeSpotlight(value.coffeeId),
    queryFn: async () => {
      if (!value.coffeeId) return null;
      const res = await fetch(`/api/coffees/${value.coffeeId}`);
      if (!res.ok) throw new Error("Failed to fetch coffee");
      return res.json();
    },
    enabled: !!value.coffeeId,
  });

  const hasLegacyContent =
    !!value.name &&
    !isPlaceholder(value.name) &&
    !isPlaceholder(value.description);

  if (value.coffeeId && isLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/50 border border-border/20" />
    );
  }

  if (value.coffeeId && coffee) {
    return <SpotlightCard data={coffee} />;
  }

  if (!value.coffeeId && hasLegacyContent) {
    return <SpotlightCard data={value} isLegacy />;
  }

  // Unresolved id, or a placeholder/empty legacy block: render nothing rather
  // than an empty card. An "in-article nothing found" box is reader-facing
  // noise and was itself a dead-click surface.
  return null;
}
