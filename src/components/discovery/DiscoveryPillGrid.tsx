"use client";

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { brewMethodPages } from "@/lib/discovery/landing-pages/brew-method-pages";
import { discoveryPagePath } from "@/lib/discovery/landing-pages/paths";
import { brewSlugToLabel } from "@/lib/discovery/brew-method-labels";
import { cn } from "@/lib/utils";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Icon, type IconName } from "@/components/common/Icon";
export type DiscoveryPillRow = {
  title: string;
  pills: Array<{ label: string; href: string }>;
};

const brewMethodPills = brewMethodPages.map((page) => ({
  label: brewSlugToLabel(page.slug),
  href: discoveryPagePath(page.slug),
}));

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
    pills: brewMethodPills,
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
  image: string;
  /** Short line under the title (about 3–5 words) */
  subtext: string;
};

const CATEGORY_STYLE_MAP: Record<string, CategoryMeta> = {
  Roast: {
    icon: "Fire",
    gradient: "from-orange-500/10 via-transparent to-transparent",
    accent: "text-orange-500/70",
    image: "/images/discovery/roast.avif",
    subtext: "Light, medium, or bold cups",
  },
  "Brew method": {
    icon: "Coffee",
    gradient: "from-blue-500/10 via-transparent to-transparent",
    accent: "text-blue-500/70",
    image: "/images/discovery/brew.avif",
    subtext: "Filters, presses, and more",
  },
  Process: {
    icon: "Plant",
    gradient: "from-green-500/10 via-transparent to-transparent",
    accent: "text-green-500/70",
    image: "/images/discovery/process.avif",
    subtext: "Washed, natural, and beyond",
  },
  Budget: {
    icon: "CurrencyInr",
    gradient: "from-amber-500/10 via-transparent to-transparent",
    accent: "text-amber-500/70",
    image: "/images/discovery/budget.avif",
    subtext: "Great coffee at every price",
  },
  Region: {
    icon: "MapPin",
    gradient: "from-purple-500/10 via-transparent to-transparent",
    accent: "text-purple-500/70",
    image: "/images/discovery/region.avif",
    subtext: "Origins across India",
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

function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setPrefersHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return prefersHover;
}

function DiscoveryPillCategoryCard({
  row,
  index,
  meta,
}: {
  row: DiscoveryPillRow;
  index: number;
  meta: CategoryMeta;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersHover = usePrefersHover();
  const prefersReducedMotion = useReducedMotion();
  const pillCount = row.pills.length;
  const flipDuration = prefersReducedMotion ? 0 : 0.6;

  useEffect(() => {
    if (!isFlipped) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFlipped(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFlipped]);

  const handleCardClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("a")) return;
      if (!prefersHover) {
        setIsFlipped((f) => !f);
      }
    },
    [prefersHover]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (isFlipped) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsFlipped(true);
      }
    },
    [isFlipped]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex h-full"
    >
      <div
        className="group relative aspect-[3/4] w-full cursor-pointer [perspective:1000px]"
        onMouseEnter={() => {
          if (prefersHover) setIsFlipped(true);
        }}
        onMouseLeave={() => {
          if (prefersHover) setIsFlipped(false);
        }}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="group"
        tabIndex={isFlipped ? -1 : 0}
        aria-label={`${row.title}. ${meta.subtext}. ${pillCount} discovery lists.`}
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: flipDuration, ease: "easeInOut" }}
        >
          {/* Front */}
          <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
            <div
              className={cn(
                "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/40 transition-all duration-500",
                "bg-card/40 backdrop-blur-[2px] shadow-sm group-hover:border-border/80 group-hover:shadow-xl"
              )}
            >
              {/* Image Background */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={meta.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 flex h-full flex-col p-4 sm:p-5">
                <div className="flex flex-col mt-auto">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20 ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-5 w-5" name={meta.icon} size={20} />
                  </div>

                  <h3 className="text-subheading font-semibold leading-tight text-white drop-shadow-lg sm:text-heading">
                    {row.title}
                  </h3>
                  <div className="my-2 h-0.5 w-8 rounded-full bg-accent/80 transition-all duration-500 group-hover:w-12" />
                  <p className="text-pretty text-micro leading-snug text-white/80 drop-shadow-md line-clamp-2">
                    {meta.subtext}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                    <span className="text-micro font-bold uppercase tracking-widest text-accent">
                      Explore
                    </span>
                    <Icon name="ArrowRight" size={10} color="accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back — pills */}
          <div className="absolute inset-0 h-full w-full rounded-xl border border-border/40 bg-card/95 p-4 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] backdrop-blur-sm sm:p-5">
            <Stack gap="4" className="h-full min-h-0">
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon name={meta.icon} size={16} color="accent" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-body font-semibold leading-none text-accent sm:text-subheading">
                    {row.title}
                  </h3>
                  <div className="mt-1 h-0.5 w-6 rounded-full bg-accent/30" />
                </div>
              </div>
              <Cluster
                gap="2"
                className="min-h-0 flex-1 flex-wrap content-start justify-start overflow-y-auto"
              >
                {row.pills.map((pill) => (
                  <Link
                    key={pill.href}
                    href={pill.href}
                    className={cn(
                      "inline-flex max-w-full items-center rounded-full border border-accent/10 bg-accent/5 px-3 py-1 text-micro font-medium text-muted-foreground",
                      "transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-foreground hover:scale-105 active:scale-95"
                    )}
                  >
                    {pill.label}
                  </Link>
                ))}
              </Cluster>
            </Stack>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

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
            <div className="mb-2 flex items-center gap-3">
              <span className="h-px w-6 bg-accent/60" />
              <p className="text-overline text-muted-foreground tracking-[0.15em]">
                {overline}
              </p>
            </div>
          ) : null}
          <h2 className="text-title font-serif leading-tight tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-body text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {DISCOVERY_PILL_ROWS.map((row, index) => {
          const meta = CATEGORY_STYLE_MAP[row.title] ?? {
            icon: "MagnifyingGlass" as IconName,
            gradient: "from-muted/10 via-transparent to-transparent",
            accent: "text-muted-foreground",
            image: "/images/discovery/roast.avif",
            subtext: "Curated lists to explore",
          };

          return (
            <DiscoveryPillCategoryCard
              key={row.title}
              row={row}
              index={index}
              meta={meta}
            />
          );
        })}
      </div>
    </div>
  );
}
