import type { CoffeeVariant } from "@/types/coffee-component-types";
import { formatPrice } from "@/lib/utils/coffee-utils";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

type CoffeePricingTableProps = {
  variants: CoffeeVariant[];
  className?: string;
};

export function CoffeePricingTable({
  variants,
  className,
}: CoffeePricingTableProps) {
  if (variants.length === 0) {
    return null;
  }

  // Sort variants: in-stock first, then by weight, then by price
  const sortedVariants = [...variants].sort((a, b) => {
    // In stock first
    if (a.in_stock !== b.in_stock) return a.in_stock ? -1 : 1;
    // Then by weight
    if (a.weight_g !== b.weight_g) return a.weight_g - b.weight_g;
    // Then by price
    return (a.price_current || 0) - (b.price_current || 0);
  });

  // Format weight for display
  const formatWeight = (weightG: number) => {
    if (weightG >= 1000) {
      return `${weightG / 1000}kg`;
    }
    return `${weightG}g`;
  };

  // Calculate discount percentage
  const getDiscount = (current: number | null, compareAt: number | null) => {
    if (!current || !compareAt || compareAt <= current) return null;
    return Math.round(((compareAt - current) / compareAt) * 100);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/40",
        className
      )}
    >
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/30 border-b border-border/40">
            <th className="px-4 py-3 text-label uppercase tracking-wider font-semibold">
              Size
            </th>
            <th className="px-4 py-3 text-label uppercase tracking-wider font-semibold">
              Options
            </th>
            <th className="px-4 py-3 text-label uppercase tracking-wider font-semibold text-right">
              Price
            </th>
            <th className="px-4 py-3 text-label uppercase tracking-wider font-semibold text-center">
              Stock
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {sortedVariants.map((variant) => {
            const discount = getDiscount(
              variant.price_current,
              variant.compare_at_price
            );

            return (
              <tr
                key={variant.id}
                className={cn(
                  "transition-colors",
                  variant.in_stock
                    ? "hover:bg-muted/20"
                    : "opacity-50 bg-muted/10"
                )}
              >
                {/* Weight */}
                <td className="px-4 py-3">
                  <span className="text-body font-medium">
                    {formatWeight(variant.weight_g)}
                  </span>
                  {variant.pack_count > 1 && (
                    <span className="text-caption text-muted-foreground ml-2">
                      × {variant.pack_count}
                    </span>
                  )}
                </td>

                {/* Grind Option */}
                <td className="px-4 py-3">
                  {variant.grind ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/40 text-caption text-muted-foreground">
                      {variant.grind}
                    </span>
                  ) : (
                    <span className="text-caption text-muted-foreground/50">
                      —
                    </span>
                  )}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {discount && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-caption font-semibold bg-green-500/10 text-green-600 dark:text-green-400">
                        -{discount}%
                      </span>
                    )}
                    <div className="flex flex-col items-end">
                      {variant.compare_at_price &&
                        variant.compare_at_price >
                          (variant.price_current || 0) && (
                          <span className="text-caption text-muted-foreground/60 line-through">
                            {formatPrice(variant.compare_at_price)}
                          </span>
                        )}
                      <span
                        className={cn(
                          "font-semibold",
                          variant.in_stock
                            ? "text-body"
                            : "text-muted-foreground"
                        )}
                      >
                        {variant.price_current
                          ? formatPrice(variant.price_current)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Stock Status */}
                <td className="px-4 py-3 text-center">
                  {variant.in_stock ? (
                    <span className="inline-flex items-center gap-1 text-caption text-green-600 dark:text-green-400">
                      <Icon name="Check" size={14} />
                      <span className="sr-only sm:not-sr-only">In Stock</span>
                    </span>
                  ) : (
                    <span className="text-caption text-muted-foreground/60">
                      Out of stock
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
