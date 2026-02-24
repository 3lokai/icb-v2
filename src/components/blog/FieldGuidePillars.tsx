"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Icon, IconName } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Category } from "@/types/blog-types";

/**
 * Visual config for each pillar category.
 * Keys are category slugs from Sanity.
 * This maps CMS data to presentation details (icon, image, goal text).
 */
const pillarVisuals: Record<string, { icon: IconName; image: string }> = {
  "origins-and-estates": {
    icon: "MapPin",
    image: "/images/learn/pillars/origins-and-estates.webp",
  },
  "processing-and-flavors": {
    icon: "Coffee",
    image: "/images/learn/pillars/processing-and-flavors.webp",
  },
  "brewing-behaviour": {
    icon: "Flask",
    image: "/images/learn/pillars/brewing-behaviour.webp",
  },
  "ecosystem-intelligence": {
    icon: "Graph",
    image: "/images/learn/pillars/ecosystem-intelligence.webp",
  },
  "field-notes-and-buying-guides": {
    icon: "CheckCircle",
    image: "/images/learn/pillars/field-notes-and-buying-guides.webp",
  },
};

/** Fallback visuals for any pillar not explicitly mapped above */
const defaultVisuals = {
  icon: "Tag" as IconName,
  image: "/images/collections/default-filter.webp",
};

interface FieldGuidePillarsProps {
  categories: Category[];
}

export function FieldGuidePillars({ categories }: FieldGuidePillarsProps) {
  // Only show categories that are pillars (belt-and-suspenders — the query already filters)
  const pillarCategories = categories.filter((c) => c.kind === "pillar");

  if (pillarCategories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
      {pillarCategories.map((category, index) => (
        <PillarCard key={category._id} category={category} index={index} />
      ))}
    </div>
  );
}

function PillarCard({
  category,
  index: _index,
}: {
  category: Category;
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const visuals = pillarVisuals[category.slug] ?? defaultVisuals;

  return (
    <Link
      href={`/learn/category/${category.slug}`}
      className="group relative aspect-[3/4] w-full [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
          <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-2xl border border-border/50">
            <Image
              src={visuals.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h3 className="text-subheading sm:text-heading font-semibold leading-tight text-balance drop-shadow-lg line-clamp-2">
                {category.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 h-full w-full rounded-lg sm:rounded-2xl border border-border bg-card p-4 sm:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl">
          <div className="flex h-full flex-col">
            <Stack gap="3" className="flex-1 overflow-hidden">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-accent/10 text-accent shrink-0">
                <Icon name={visuals.icon} size={18} color="accent" />
              </div>

              <div className="min-w-0">
                <h3 className="text-body sm:text-subheading font-semibold mb-1 text-accent line-clamp-2">
                  {category.name}
                </h3>
                <p className="text-caption sm:text-body-small text-muted-foreground leading-relaxed line-clamp-4 sm:line-clamp-none">
                  {category.description || "Explore this knowledge layer."}
                </p>
              </div>
            </Stack>

            <div className="mt-3 sm:mt-4 flex items-center justify-between border-t pt-3 sm:pt-4 shrink-0">
              <span className="text-micro font-bold uppercase tracking-widest text-accent">
                Explore
              </span>
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
                <Icon name="ArrowRight" size={12} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
