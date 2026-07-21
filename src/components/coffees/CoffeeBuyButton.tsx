"use client";

import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CoffeeDetail } from "@/types/coffee-types";

type CoffeeBuyButtonProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeBuyButton({ coffee, className }: CoffeeBuyButtonProps) {
  const buyUrl = coffee.direct_buy_url || coffee.summary.direct_buy_url;

  const handleClick = () => {
    if (buyUrl) {
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
      <Icon icon={ArrowSquareOutIcon} size={16} className="ml-2 h-4 w-4" />
    </Button>
  );
}
