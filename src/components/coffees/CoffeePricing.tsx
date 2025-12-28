import type { CoffeeDetail } from "@/types/coffee-types";
import { formatPrice } from "@/lib/utils/coffee-utils";
import { cn } from "@/lib/utils";

type CoffeePricingProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeePricing({ coffee, className }: CoffeePricingProps) {
  if (coffee.variants.length === 0) {
    return null;
  }

  // Group variants by weight for better display
  const variantsByWeight = coffee.variants.reduce(
    (acc, variant) => {
      const weight = variant.weight_g;
      if (!acc[weight]) {
        acc[weight] = [];
      }
      acc[weight].push(variant);
      return acc;
    },
    {} as Record<number, typeof coffee.variants>
  );

  return (
    <div className={cn("stack-sm", className)}>
      <h2 className="text-subheading">Pricing</h2>
      <div className="stack-xs">
        {Object.entries(variantsByWeight)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([weight, variants]) => (
            <div key={weight} className="surface-1 card-padding rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body font-medium">
                  {Number(weight) / 1000}kg
                </span>
                {variants.some((v) => v.in_stock) && (
                  <span className="text-caption text-green-600 dark:text-green-400">
                    In Stock
                  </span>
                )}
              </div>
              <div className="stack-xs">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {variant.grind && (
                        <span className="text-caption text-muted-foreground">
                          {variant.grind}
                        </span>
                      )}
                      {variant.pack_count > 1 && (
                        <span className="text-caption text-muted-foreground">
                          Pack of {variant.pack_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {variant.compare_at_price &&
                        variant.compare_at_price >
                          (variant.price_current || 0) && (
                          <span className="text-caption text-muted-foreground line-through">
                            {formatPrice(variant.compare_at_price)}
                          </span>
                        )}
                      <span className="text-body font-semibold">
                        {variant.price_current
                          ? formatPrice(variant.price_current)
                          : "Price not available"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
