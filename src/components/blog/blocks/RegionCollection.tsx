"use client";

import Link from "next/link";
import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface RegionCollectionProps {
  value: {
    title?: string;
    description?: string;
    type?: "dynamic" | "manual";
    regionIds?: string[];
    // Filters
    states?: string[];
    climate?: string[];
    mainVarieties?: string[];
    isFeatured?: boolean;
    isPopular?: boolean;
    limit?: number;
    columns?: number;
    showMoreButton?: boolean;
    moreUrl?: string;
    moreText?: string;
  };
}

export function RegionCollection({ value }: RegionCollectionProps) {
  const {
    title,
    description,
    showMoreButton = true,
    moreUrl,
    moreText = "Explore All Regions",
  } = value;

  // The whole panel lifts and scales on hover, so readers click it, not just the
  // CTA. Make the panel the link and render the CTA as a visual affordance. With
  // the CTA hidden there is no click target, so drop the hover affordance too.
  const href = showMoreButton ? moreUrl || "/regions" : null;

  const body = (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
          <Icon icon={MapPinIcon} size={32} />
        </div>
      </motion.div>

      <h2 className="font-bold text-title mb-4 text-foreground tracking-tight underline decoration-accent/30 decoration-4 underline-offset-8">
        {title || "Coffee Regions"}
      </h2>

      <p className="text-body-large text-muted-foreground/90 mb-8 max-w-xl mx-auto italic font-serif leading-relaxed">
        {description ||
          "Explore the unique terroirs and flavors from across India's coffee-growing states, from Baba Budangiri to Araku Valley."}
      </p>

      {href && (
        <span
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-xl bg-emerald-600 shadow-md transition-all group-hover:translate-y-[-2px] px-10 font-bold"
          )}
        >
          {moreText} <Icon icon={ArrowRightIcon} size={18} className="ml-2" />
        </span>
      )}

      <div className="absolute top-0 left-0 -ml-16 -mt-16 size-64 rounded-full bg-emerald-500/5 blur-3xl" />
    </>
  );

  const className = cn(
    "not-prose my-16 block overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-emerald-500/[0.02] to-transparent p-8 lg:p-12 text-center",
    href && "group transition-all hover:shadow-xl hover:border-emerald-500/40"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="not-prose"
    >
      {href ? (
        <Link href={href} aria-label={moreText} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.div>
  );
}
