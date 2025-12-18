"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DashboardSidebarContent } from "./DashboardSidebar";

type DashboardMobileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Dashboard Mobile Drawer Component
 * Sheet drawer for mobile dashboard sidebar
 * Only visible on mobile devices (< 768px)
 */
export function DashboardMobileDrawer({
  open,
  onOpenChange,
}: DashboardMobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto md:hidden" side="left">
        <SheetHeader>
          <SheetTitle>Dashboard</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <DashboardSidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
