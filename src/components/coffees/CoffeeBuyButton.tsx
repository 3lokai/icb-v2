"use client";

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CoffeeDetail } from "@/types/coffee-types";
import { trackCoffeePurchaseIntent } from "@/lib/analytics/enhanced-tracking";

type CoffeeBuyButtonProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeBuyButton({ coffee, className }: CoffeeBuyButtonProps) {
  const buyUrl = coffee.direct_buy_url || coffee.summary.direct_buy_url;

  const handleClick = () => {
    if (buyUrl && coffee.id && coffee.roaster_id) {
      // Track purchase intent with enhanced tracking
      const coffeePrice = coffee.summary.best_normalized_250g;
      trackCoffeePurchaseIntent(
        coffee.id,
        coffee.roaster_id,
        "purchase_link_click",
        coffeePrice ? coffeePrice * 4 : undefined // Convert 250g to 1kg for value estimation
      );
      window.open(buyUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!buyUrl) {
    return (
      <Button
        className={cn("w-full", className)}
        disabled
        size="lg"
        type="button"
      >
        Buy Now
      </Button>
    );
  }

  return (
    <Button
      className={cn("w-full", className)}
      onClick={handleClick}
      size="lg"
      type="button"
    >
      Buy Now
      <Icon name="ArrowSquareOut" size={16} className="ml-2 h-4 w-4" />
    </Button>
  );
}
