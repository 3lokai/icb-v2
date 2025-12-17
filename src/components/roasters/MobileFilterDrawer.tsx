"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RoasterFilterContent } from "./RoasterFilterSidebar";
import type { RoasterFilterMeta } from "@/types/roaster-types";

type MobileFilterDrawerProps = {
  filterMeta: RoasterFilterMeta;
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
        className="overflow-y-auto md:hidden"
        side="left"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <RoasterFilterContent filterMeta={filterMeta} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

