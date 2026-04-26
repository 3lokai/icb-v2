"use client";

import {
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Cluster } from "@/components/primitives/cluster";
import { Icon, type IconName } from "@/components/common/Icon";
import {
  DISCOVERY_PILL_ROWS,
  type DiscoveryPillRow,
} from "@/components/discovery/DiscoveryPillGrid";

type DiscoveryAccordionGridProps = {
  className?: string;
  showHeading?: boolean;
  overline?: string;
  title?: ReactNode;
  description?: string;
};

type CategoryMeta = {
  icon: IconName;
  image: string;
  subtext: string;
};

const CATEGORY_STYLE_MAP: Record<string, CategoryMeta> = {
  Roast: {
    icon: "Fire",
    image: "/images/discovery/roast.avif",
    subtext: "Light, medium, or bold cups",
  },
  "Brew method": {
    icon: "Coffee",
    image: "/images/discovery/brew.avif",
    subtext: "Filters, presses, and more",
  },
  Process: {
    icon: "Plant",
    image: "/images/discovery/process.avif",
    subtext: "Washed, natural, and beyond",
  },
  Budget: {
    icon: "CurrencyInr",
    image: "/images/discovery/budget.avif",
    subtext: "Great coffee at every price",
  },
  Region: {
    icon: "MapPin",
    image: "/images/discovery/region.avif",
    subtext: "Origins across India",
  },
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

function DiscoveryAccordionCard({
  row,
  index,
  meta,
  isActive,
  prefersHover,
  onActivate,
  onDeactivate,
  onToggle,
}: {
  row: DiscoveryPillRow;
  index: number;
  meta: CategoryMeta;
  isActive: boolean;
  prefersHover: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const flexDuration = prefersReducedMotion ? 0 : 0.65;
  const revealDuration = prefersReducedMotion ? 0 : 0.35;

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
    if (e.key === "Escape" && isActive) {
      e.preventDefault();
      onDeactivate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      animate={{ flexGrow: isActive ? 2.5 : 1 }}
      className="relative flex min-h-[110px] flex-1 border-b border-border/30 md:border-b-0 md:border-r md:last:border-r-0"
      style={{ willChange: "flex-grow" }}
    >
      <div
        className="group relative flex h-full w-full cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        onMouseEnter={() => {
          if (prefersHover) onActivate();
        }}
        onMouseLeave={() => {
          if (prefersHover) onDeactivate();
        }}
        onClick={() => {
          if (!prefersHover) onToggle();
        }}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        aria-label={`${row.title}. ${meta.subtext}. ${row.pills.length} discovery lists.`}
      >
        <Image
          src={meta.image}
          alt=""
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isActive ? "scale-105 opacity-75" : "opacity-50"
          )}
          sizes="(max-width: 767px) 100vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />

        <motion.div
          className="relative z-10 mt-auto flex w-full flex-col p-4 sm:p-5"
          transition={{
            duration: flexDuration,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-lg shadow-accent/20 ring-1 ring-white/20">
            <Icon className="h-4 w-4" name={meta.icon} size={16} />
          </div>

          <h3 className="text-subheading font-semibold leading-tight text-white sm:text-heading">
            {row.title}
          </h3>
          <motion.div
            className="my-2 h-0.5 rounded-full bg-accent/80"
            animate={{ width: isActive ? 48 : 32 }}
            transition={{ duration: 0.25 }}
          />
          <p className="text-micro leading-snug text-white/80">
            {meta.subtext}
          </p>

          <AnimatePresence initial={false}>
            {isActive ? (
              <motion.div
                key="pills"
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: revealDuration, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <Cluster gap="2" className="items-start">
                  {row.pills.map((pill) => (
                    <Link
                      key={pill.href}
                      href={pill.href}
                      className={cn(
                        "inline-flex max-w-full items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-micro font-medium text-white/90",
                        "transition-all duration-200 hover:border-white/50 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      {pill.label}
                    </Link>
                  ))}
                </Cluster>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function DiscoveryAccordionGrid({
  className,
  showHeading = true,
  overline = "Explore by category",
  title = "Find coffee your way",
  description = "Jump to curated lists by roast, brew method, process, budget, or region.",
}: DiscoveryAccordionGridProps) {
  const prefersHover = usePrefersHover();
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

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

      <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm">
        <div className="flex flex-col md:h-[440px] md:flex-row">
          {DISCOVERY_PILL_ROWS.map((row, index) => {
            const meta = CATEGORY_STYLE_MAP[row.title] ?? {
              icon: "MagnifyingGlass" as IconName,
              image: "/images/discovery/roast.avif",
              subtext: "Curated lists to explore",
            };
            const isActive = activeTitle === row.title;
            return (
              <DiscoveryAccordionCard
                key={row.title}
                row={row}
                index={index}
                meta={meta}
                isActive={isActive}
                prefersHover={prefersHover}
                onActivate={() => setActiveTitle(row.title)}
                onDeactivate={() =>
                  setActiveTitle((current) =>
                    current === row.title ? null : current
                  )
                }
                onToggle={() =>
                  setActiveTitle((current) =>
                    current === row.title ? null : row.title
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
