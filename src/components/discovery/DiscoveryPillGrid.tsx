"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Cluster } from "@/components/primitives/cluster";
import { Icon, type IconName } from "@/components/common/Icon";

export type DiscoveryPillRow = {
  title: string;
  pills: Array<{ label: string; href: string }>;
};

/** Shared rows: roast / method / process / budget — links to /coffees/[slug] */
export const DISCOVERY_PILL_ROWS: DiscoveryPillRow[] = [
  {
    title: "Roast",
    pills: [
      { label: "Light", href: "/coffees/light-roast" },
      { label: "Light-Medium", href: "/coffees/light-medium-roast" },
      { label: "Medium", href: "/coffees/medium-roast" },
      { label: "Medium-Dark", href: "/coffees/medium-dark-roast" },
      { label: "Dark", href: "/coffees/dark-roast" },
    ],
  },
  {
    title: "Brew method",
    pills: [
      { label: "AeroPress", href: "/coffees/aeropress" },
      { label: "V60", href: "/coffees/v60" },
      { label: "Chemex", href: "/coffees/chemex" },
      { label: "Kalita", href: "/coffees/kalita" },
      { label: "French Press", href: "/coffees/french-press" },
    ],
  },
  {
    title: "Process",
    pills: [
      { label: "Natural", href: "/coffees/natural" },
      { label: "Washed", href: "/coffees/washed" },
      { label: "Honey", href: "/coffees/honey" },
      { label: "Anaerobic", href: "/coffees/anaerobic" },
      { label: "Monsooned Malabar", href: "/coffees/monsooned-malabar" },
    ],
  },
  {
    title: "Budget",
    pills: [
      { label: "Under ₹500", href: "/coffees/budget" },
      { label: "₹500–₹1000", href: "/coffees/mid-range" },
    ],
  },
  {
    title: "Region",
    pills: [
      { label: "Chikmagalur", href: "/coffees/chikmagalur" },
      { label: "Coorg", href: "/coffees/coorg" },
      { label: "Araku", href: "/coffees/araku" },
      { label: "Koraput (Odisha)", href: "/coffees/koraput" },
      { label: "Northeast India", href: "/coffees/northeast-india" },
      { label: "Nilgiris", href: "/coffees/nilgiris" },
      { label: "Wayanad", href: "/coffees/wayanad" },
    ],
  },
];

type CategoryMeta = {
  icon: IconName;
  gradient: string;
  accent: string;
};

const CATEGORY_STYLE_MAP: Record<string, CategoryMeta> = {
  Roast: {
    icon: "Fire",
    gradient: "from-orange-500/10 via-transparent to-transparent",
    accent: "text-orange-500/70",
  },
  "Brew method": {
    icon: "Coffee",
    gradient: "from-blue-500/10 via-transparent to-transparent",
    accent: "text-blue-500/70",
  },
  Process: {
    icon: "Plant",
    gradient: "from-green-500/10 via-transparent to-transparent",
    accent: "text-green-500/70",
  },
  Budget: {
    icon: "CurrencyInr",
    gradient: "from-amber-500/10 via-transparent to-transparent",
    accent: "text-amber-500/70",
  },
  Region: {
    icon: "MapPin",
    gradient: "from-purple-500/10 via-transparent to-transparent",
    accent: "text-purple-500/70",
  },
};

type DiscoveryPillGridProps = {
  className?: string;
  /** When false, only pill rows (e.g. homepage provides its own section title) */
  showHeading?: boolean;
  /** Optional section heading (directory page uses defaults; homepage can override) */
  overline?: string;
  title?: ReactNode;
  description?: string;
};

/**
 * Premium Pill-style navigation to discovery landing pages under /coffees/[slug]
 */
export function DiscoveryPillGrid({
  className,
  showHeading = true,
  overline = "Explore by category",
  title = "Find coffee your way",
  description = "Jump to curated lists by roast, brew method, process, budget, or region.",
}: DiscoveryPillGridProps) {
  return (
    <div className={cn("w-full transition-all duration-500", className)}>
      {showHeading ? (
        <div className="mb-10">
          {overline ? (
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-6 bg-accent/60" />
              <p className="text-overline text-muted-foreground tracking-[0.15em]">
                {overline}
              </p>
            </div>
          ) : null}
          <h2 className="text-title font-serif tracking-tight leading-tight">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-body text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {DISCOVERY_PILL_ROWS.map((row, index) => {
          const meta = CATEGORY_STYLE_MAP[row.title] || {
            icon: "MagnifyingGlass",
            gradient: "from-muted/10 via-transparent to-transparent",
            accent: "text-muted-foreground",
          };

          return (
            <motion.div
              key={row.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex h-full"
            >
              <div
                className={cn(
                  "group relative w-full flex flex-col overflow-hidden rounded-xl border border-border/40 p-4 transition-all duration-300 hover:border-border/80",
                  "bg-card/40 backdrop-blur-[2px] shadow-sm hover:shadow-md"
                )}
              >
                {/* Gradient Background */}
                <div
                  className={cn(
                    "absolute inset-0 z-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    meta.gradient
                  )}
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <Icon
                      className={cn("h-4 w-4", meta.accent)}
                      name={meta.icon as IconName}
                    />
                    <span className="text-micro font-bold uppercase tracking-widest text-muted-foreground/30 group-hover:text-accent/60 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-3 text-caption font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                    {row.title}
                  </h3>

                  <Cluster gap="1" className="flex-wrap mt-auto">
                    {row.pills.map((pill) => (
                      <Link
                        key={pill.href}
                        href={pill.href}
                        className={cn(
                          "inline-flex items-center rounded-full border border-border/40 bg-background/50 px-2.5 py-0.5 text-micro font-medium text-muted-foreground",
                          "transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 hover:text-foreground hover:scale-105 active:scale-95"
                        )}
                      >
                        {pill.label}
                      </Link>
                    ))}
                  </Cluster>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
