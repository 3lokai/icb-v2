"use client";

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  coffeeId: string | null | undefined;
  /** `icon` — bare heart (positioned by the parent, e.g. over a card image).
   *  `button` — labelled button for the coffee detail page. */
  variant?: "icon" | "button";
  className?: string;
};

/**
 * Save/unsave a coffee to the wishlist. Renders for everyone; signed-out users
 * get a "sign in" toast on click (handled in useWishlist), no redirect.
 */
export function WishlistButton({
  coffeeId,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();

  if (!coffeeId) return null;

  const saved = isWishlisted(coffeeId);
  const label = saved ? "Remove from wishlist" : "Add to wishlist";

  // Card is a <Link>; swallow the click so it doesn't navigate.
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(coffeeId);
  };

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant={saved ? "secondary" : "outline"}
        onClick={handleClick}
        aria-pressed={saved}
        className={cn("gap-2", className)}
      >
        <Icon name="Heart" size={18} color={saved ? "destructive" : "muted"} />
        {saved ? "In your wishlist" : "Add to wishlist"}
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          aria-label={label}
          aria-pressed={saved}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1.5",
            "transition-transform hover:scale-110 focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "motion-reduce:transition-none motion-reduce:hover:scale-100",
            className
          )}
        >
          <Icon
            name="Heart"
            size={20}
            color={saved ? "destructive" : "primary"}
            className="inline-block drop-shadow-[0_1px_2px_rgb(0_0_0/0.45)]"
            // Sits over photos: keep the unsaved heart white in both themes.
            {...(saved
              ? {}
              : {
                  style: {
                    "--ph-primary": "#fff",
                    "--ph-secondary": "rgb(255 255 255 / 0.5)",
                  } as React.CSSProperties,
                })}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
