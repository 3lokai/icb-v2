"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CoffeeIcon,
  FlaskIcon,
  GraphIcon,
  InfoIcon,
  MapPinIcon,
  TagIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/blog-types";
import { cn } from "@/lib/utils";

/**
 * Visual config for each pillar category.
 * Keys are category slugs from Sanity.
 * This maps CMS data to presentation details (icon, image, goal text).
 */
const pillarVisuals: Record<
  string,
  { icon: ComponentType<IconProps>; image: string }
> = {
  "origins-and-estates": {
    icon: MapPinIcon,
    image: "/images/learn/pillars/origins-and-estates.webp",
  },
  "processing-and-flavors": {
    icon: CoffeeIcon,
    image: "/images/learn/pillars/processing-and-flavors.webp",
  },
  "brewing-behaviour": {
    icon: FlaskIcon,
    image: "/images/learn/pillars/brewing-behaviour.webp",
  },
  "ecosystem-intelligence": {
    icon: GraphIcon,
    image: "/images/learn/pillars/ecosystem-intelligence.webp",
  },
  "field-notes-and-buying-guides": {
    icon: CheckCircleIcon,
    image: "/images/learn/pillars/field-notes-and-buying-guides.webp",
  },
};

/** Fallback visuals for any pillar not explicitly mapped above */
const defaultVisuals = {
  icon: TagIcon,
  image: "/images/collections/default-filter.webp",
};

interface FieldGuidePillarsProps {
  categories: Category[];
}

export function FieldGuidePillars({ categories }: FieldGuidePillarsProps) {
  // Only show categories that are pillars (belt-and-suspenders — the query already filters)
  const pillarCategories = categories.filter((c) => c.kind === "pillar");

  if (pillarCategories.length === 0) return null;

  // With an odd count, a 2-col mobile grid orphans the last card. Let it span
  // both columns (as a wide closing tile) only at that breakpoint.
  const isOddCount = pillarCategories.length % 2 === 1;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
      {pillarCategories.map((category, index) => (
        <PillarCard
          key={category._id}
          category={category}
          index={index}
          wide={isOddCount && index === pillarCategories.length - 1}
        />
      ))}
    </div>
  );
}

function PillarCard({
  category,
  index: _index,
  wide = false,
}: {
  category: Category;
  index: number;
  wide?: boolean;
}) {
  // Three independent triggers so the back face is reachable on every input:
  // hover (pointer), focus (keyboard), and an explicit toggle (touch).
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const prefersReduced = useReducedMotion();
  const visuals = pillarVisuals[category.slug] ?? defaultVisuals;
  const flipped = hovered || focused || pinned;
  const description = category.description || "Explore this knowledge layer.";

  return (
    <div
      className={cn(
        "group relative aspect-[3/4] w-full [perspective:1000px]",
        wide && "max-md:col-span-2 max-md:aspect-[16/10]"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setFocused(false);
      }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/50">
            <Image
              src={visuals.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5" />

            {category.articleCount !== undefined &&
              category.articleCount > 0 && (
                <Badge
                  variant="onMedia"
                  className="absolute top-3 right-3 sm:top-4 sm:right-4"
                >
                  {category.articleCount}{" "}
                  {category.articleCount === 1 ? "guide" : "guides"}
                </Badge>
              )}

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h3 className="text-subheading sm:text-heading font-semibold leading-tight text-balance drop-shadow-lg line-clamp-2">
                {category.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-full flex-col">
            <Stack gap="3" className="flex-1 overflow-hidden">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-accent/10 text-accent shrink-0">
                <Icon icon={visuals.icon} size={18} color="accent" />
              </div>

              <div className="min-w-0">
                <p className="text-body sm:text-subheading font-semibold mb-1 text-accent line-clamp-2">
                  {category.name}
                </p>
                <p className="text-caption sm:text-body text-muted-foreground leading-relaxed line-clamp-4 sm:line-clamp-none">
                  {description}
                </p>
              </div>
            </Stack>

            <div className="mt-3 sm:mt-4 flex items-center justify-between border-t pt-3 sm:pt-4 shrink-0">
              <span className="text-micro font-bold uppercase tracking-widest text-accent">
                Explore
              </span>
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-accent text-white flex items-center justify-center">
                <Icon icon={ArrowRightIcon} size={12} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stretched navigation target: covers the whole card, owns keyboard
          focus (which flips it via the container's onFocus), and carries the
          accessible name. */}
      <Link
        href={`/learn/category/${category.slug}`}
        aria-label={`${category.name} — explore this layer`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      {/* Touch affordance: reveals the back face without navigating. Only on
          devices that can't hover, so it never clutters the pointer UI. */}
      <button
        type="button"
        aria-label={
          flipped
            ? `Hide details for ${category.name}`
            : `Show details for ${category.name}`
        }
        aria-expanded={flipped}
        onClick={(e) => {
          e.preventDefault();
          setPinned((p) => !p);
        }}
        className="absolute bottom-3 right-3 z-20 hidden h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white [@media(hover:none)]:flex"
      >
        <Icon icon={flipped ? XIcon : InfoIcon} size={16} />
      </button>
    </div>
  );
}
