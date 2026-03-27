"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type FloatingRateCTAProps = {
  /** Ref to the hero "Rate this..." button */
  heroButtonRef: React.RefObject<HTMLButtonElement | null>;
  /** Ref to the rating section */
  ratingSectionRef: React.RefObject<HTMLDivElement | null>;
  /** Entity type for labelling */
  entityType?: "coffee" | "roaster";
};

export function FloatingRateCTA({
  heroButtonRef,
  ratingSectionRef,
  entityType = "coffee",
}: FloatingRateCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = heroButtonRef.current;
    const ratingEl = ratingSectionRef.current;
    if (!heroEl || !ratingEl) return;

    let heroOut = false;
    let ratingVisible = false;

    const update = () => setVisible(heroOut && !ratingVisible);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroOut = !entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );

    const ratingObserver = new IntersectionObserver(
      ([entry]) => {
        ratingVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.1 }
    );

    heroObserver.observe(heroEl);
    ratingObserver.observe(ratingEl);

    return () => {
      heroObserver.disconnect();
      ratingObserver.disconnect();
    };
  }, [heroButtonRef, ratingSectionRef]);

  const handleClick = () => {
    const el = ratingSectionRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const label =
    entityType === "coffee" ? "Rate this coffee" : "Rate this roaster";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2 px-5 py-3",
        "bg-primary text-primary-foreground",
        "rounded-full shadow-xl",
        "font-medium text-sm",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-2xl active:scale-95",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <Icon name="Star" size={18} className="fill-amber-400 text-amber-400" />
      {label}
    </button>
  );
}
