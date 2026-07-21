import Image from "next/image";
import Link from "next/link";
import { CoffeeIcon, StackIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import {
  BEAN_CATEGORY_LINKS,
  BEAN_SPECIES_VISUALS,
  type BeanSpeciesVisual,
} from "@/lib/discovery/landing-pages/bean-species-visuals";
import { discoveryPagePath } from "@/lib/discovery/landing-pages";
import { cn } from "@/lib/utils";

type BeanTypeComparisonGridProps = {
  activeSlug: string;
  className?: string;
};

const CARD_BASE =
  "surface-1 group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300";

function BeanCardInner({ species }: { species: BeanSpeciesVisual }) {
  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        <Image
          src={species.image}
          alt={`${species.label} coffee bean`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-body-large font-serif font-medium text-foreground">
          {species.label}
        </p>
        <p className="text-caption text-muted-foreground leading-relaxed">
          {species.shape}
        </p>
      </div>
    </>
  );
}

export function BeanTypeComparisonGrid({
  activeSlug,
  className,
}: BeanTypeComparisonGridProps) {
  return (
    <div className={cn(className)}>
      <div className="flex items-center gap-2 mb-6">
        <Icon icon={CoffeeIcon} className="h-5 w-5 text-accent/70" />
        <h3 className="text-heading">Bean types at a glance</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BEAN_SPECIES_VISUALS.map((species) => {
          const isActive = species.slug === activeSlug;

          if (isActive) {
            return (
              <div
                key={species.slug}
                aria-current="page"
                className={cn(
                  CARD_BASE,
                  "ring-2 ring-accent/50 shadow-xl shadow-primary/5"
                )}
              >
                <span className="absolute right-3 top-3 z-10 rounded-full bg-accent px-2.5 py-0.5 text-micro font-semibold uppercase tracking-widest text-accent-foreground">
                  You&apos;re here
                </span>
                <BeanCardInner species={species} />
              </div>
            );
          }

          return (
            <Link
              key={species.slug}
              href={discoveryPagePath(species.slug)}
              className={cn(
                CARD_BASE,
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:ring-1 hover:ring-accent/30"
              )}
            >
              <BeanCardInner species={species} />
            </Link>
          );
        })}
      </div>

      {/* Categorical bean types — no morphology image, shown as link pills */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Icon icon={StackIcon} className="h-4 w-4 text-muted-foreground/60" />
          <p className="text-label uppercase">Also browse</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {BEAN_CATEGORY_LINKS.map((category) => {
            const isActive = category.slug === activeSlug;
            const pillClass =
              "rounded-full border px-4 py-1.5 text-caption font-medium transition-colors";

            if (isActive) {
              return (
                <span
                  key={category.slug}
                  aria-current="page"
                  className={cn(
                    pillClass,
                    "border-accent/40 bg-accent/10 text-accent"
                  )}
                >
                  {category.label}
                </span>
              );
            }

            return (
              <Link
                key={category.slug}
                href={discoveryPagePath(category.slug)}
                className={cn(
                  pillClass,
                  "border-transparent bg-muted/30 text-foreground/80 hover:border-accent/30 hover:bg-transparent"
                )}
              >
                {category.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
