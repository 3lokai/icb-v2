"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CoffeeFilterContent } from "./CoffeeFilterSidebar";
import { cn } from "@/lib/utils";
import type { CoffeeFilterMeta } from "@/types/coffee-types";

type MobileFilterDrawerProps = {
  filterMeta: CoffeeFilterMeta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Mobile Filter Drawer Component
 * Sheet drawer for mobile filter sidebar
 * Only visible on mobile devices (< 768px)
 */
export function MobileFilterDrawer({
  filterMeta,
  open,
  onOpenChange,
}: MobileFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn("surface-2 overflow-y-auto md:hidden")}
        side="left"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 px-4 pb-8">
          <CoffeeFilterContent
            filterMeta={filterMeta}
            showHeader={false}
            isVisible={open}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
