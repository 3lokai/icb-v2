"use client";

import * as React from "react";
import type { CoffeeVariant } from "@/types/coffee-component-types";
import type { GrindEnum } from "@/types/db-enums";
import { formatPrice } from "@/lib/utils/coffee-utils";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { GRIND_TYPES } from "@/lib/utils/coffee-constants";

type CoffeeVariantSelectorProps = {
  variants: CoffeeVariant[];
  className?: string;
  onSelect?: (variant: CoffeeVariant) => void;
  directBuyUrl?: string | null;
  roasterName?: string | null;
};

const grindIconMap: Record<string, IconName> = {
  whole: "CoffeeBean",
  filter: "DotsNine",
  espresso: "Square",
  channi: "DotsNine",
  french_press: "CirclesFour",
  pour_over: "DotsNine",
  cold_brew: "CirclesFour",
  moka_pot: "Square",
};

const getGrindInfo = (grindValue: GrindEnum | null) => {
  const lookupValue = grindValue || "whole";
  const option = GRIND_TYPES.find((t) => t.value === lookupValue);
  const icon: IconName = grindIconMap[lookupValue.toLowerCase()] || "Dot";

  return {
    label: option?.label || lookupValue,
    icon,
  };
};

const formatWeight = (g: number) => (g >= 1000 ? `${g / 1000}kg` : `${g}g`);

export function CoffeeVariantSelector({
  variants,
  className,
  onSelect,
  directBuyUrl,
  roasterName,
}: CoffeeVariantSelectorProps) {
  // ─── Initial variant calculation (for useState defaults) ───
  const initialVariant = React.useMemo(() => {
    if (variants.length === 0) return null;
    const inStockSorted = [...variants]
      .filter((v) => v.in_stock)
      .sort((a, b) => (a.price_current || 0) - (b.price_current || 0));
    return inStockSorted[0] || variants[0];
  }, [variants]);

  const [selectedWeight, setSelectedWeight] = React.useState<number>(
    initialVariant?.weight_g ?? 0
  );
  const [selectedGrind, setSelectedGrind] = React.useState<GrindEnum | null>(
    initialVariant?.grind ?? null
  );

  // ─── Derived data (computed every render, but needed for hooks) ───
  const availableGrindsForWeight = React.useMemo(() => {
    return Array.from(
      new Set(
        variants
          .filter((v) => v.weight_g === selectedWeight)
          .map((v) => v.grind)
          .filter((g): g is GrindEnum => g !== null && g !== "other")
      )
    );
  }, [variants, selectedWeight]);

  const currentVariant = React.useMemo(() => {
    return (
      variants.find(
        (v) => v.weight_g === selectedWeight && v.grind === selectedGrind
      ) || variants.find((v) => v.weight_g === selectedWeight)
    );
  }, [variants, selectedWeight, selectedGrind]);

  // Synchronization: if selected grind is not available for new weight, pick first available
  React.useEffect(() => {
    if (
      selectedGrind &&
      availableGrindsForWeight.length > 0 &&
      !availableGrindsForWeight.includes(selectedGrind)
    ) {
      setSelectedGrind(availableGrindsForWeight[0] || null);
    }
  }, [selectedWeight, availableGrindsForWeight, selectedGrind]);

  // Notify parent on change
  React.useEffect(() => {
    if (currentVariant && onSelect) {
      onSelect(currentVariant);
    }
  }, [currentVariant, onSelect]);

  // ─── Early return after all hooks ───
  if (variants.length === 0) return null;

  // ─── Data Extraction ───

  // Unique weights, sorted
  const weights = Array.from(new Set(variants.map((v) => v.weight_g))).sort(
    (a, b) => a - b
  );

  // Check if a weight has any in-stock variants
  const isWeightInStock = (weight: number) =>
    variants.some((v) => v.weight_g === weight && v.in_stock);

  // Check if a grind option is in stock for the selected weight
  const isGrindInStock = (grind: GrindEnum | null) =>
    variants.some(
      (v) => v.weight_g === selectedWeight && v.grind === grind && v.in_stock
    );

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)}>
      {/* ─── Bag Size Selection ─── */}
      <div className="flex flex-col gap-2">
        <label className="text-overline text-muted-foreground">Bag Size</label>
        <div className="flex flex-wrap gap-2">
          {weights.map((w) => {
            const inStock = isWeightInStock(w);
            const isSelected = selectedWeight === w;

            return (
              <button
                key={w}
                onClick={() => setSelectedWeight(w)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-caption font-medium transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : inStock
                      ? "bg-muted/60 text-foreground hover:bg-muted"
                      : "bg-muted/30 text-muted-foreground/50"
                )}
              >
                {formatWeight(w)}
                {!inStock && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Grind Selection ─── */}
      <div className="flex flex-col gap-2">
        <label className="text-overline text-muted-foreground">
          Grind Setting
        </label>

        <div className="flex flex-wrap gap-2">
          {availableGrindsForWeight.map((g) => {
            const info = getGrindInfo(g);
            const isSelected = selectedGrind === g;
            const inStock = isGrindInStock(g);

            return (
              <button
                key={String(g)}
                onClick={() => setSelectedGrind(g)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : inStock
                      ? "bg-card border-border/60 text-foreground hover:border-border"
                      : "bg-muted/30 border-border/30 text-muted-foreground/50"
                )}
              >
                <Icon
                  name={info.icon}
                  size={14}
                  color={isSelected ? "glass" : inStock ? "accent" : "muted"}
                />
                <span
                  className={cn(
                    "text-overline",
                    isSelected
                      ? "text-primary-foreground"
                      : inStock
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                  )}
                >
                  {info.label}
                </span>
                {!inStock && (
                  <span className="ml-1 text-micro text-destructive/70">
                    (Sold out)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Pricing & Availability ─── */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-title font-serif text-foreground">
            {currentVariant?.price_current
              ? formatPrice(currentVariant.price_current)
              : "—"}
          </span>
          {currentVariant?.compare_at_price &&
            currentVariant.compare_at_price >
              (currentVariant.price_current || 0) && (
              <span className="text-caption line-through">
                {formatPrice(currentVariant.compare_at_price)}
              </span>
            )}
        </div>

        {currentVariant?.in_stock ? (
          <span className="badge bg-green-500/10 text-green-700 dark:text-green-400">
            In Stock
          </span>
        ) : (
          <span className="badge bg-destructive/10 text-destructive">
            Out of Stock
          </span>
        )}
      </div>

      {/* ─── Actions ─── */}
      <div className="flex items-center gap-3 pt-2">
        {directBuyUrl ? (
          <Button
            asChild
            size="lg"
            className={cn(
              "flex-1 rounded-xl h-12 md:h-14 shadow-md transition-all",
              !currentVariant?.in_stock && "opacity-50 pointer-events-none"
            )}
            disabled={!currentVariant?.in_stock}
          >
            <a href={directBuyUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Buy from {roasterName || "roaster"}
            </a>
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-xl h-12 md:h-14 opacity-50 cursor-not-allowed"
            disabled
          >
            Not available online
          </Button>
        )}
      </div>
    </div>
  );
}
