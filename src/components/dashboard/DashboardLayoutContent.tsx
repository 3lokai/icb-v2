"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMobileDrawer } from "./DashboardMobileDrawer";

type DashboardLayoutContentProps = {
  children: React.ReactNode;
};

/**
 * Dashboard Layout Content Component
 * Wraps dashboard pages with sidebar and mobile drawer
 * Similar to how CoffeeDirectory and RoasterDirectory work
 * Note: PageShell is already applied in layout.tsx
 */
export function DashboardLayoutContent({
  children,
}: DashboardLayoutContentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="py-8 md:py-12">
      {/* Mobile Sidebar Toggle Button */}
      <div className="mb-4 md:hidden">
        <Button
          aria-label="Open dashboard menu"
          className="w-full justify-start"
          onClick={() => setIsDrawerOpen(true)}
          variant="outline"
        >
          <Icon className="mr-2" name="List" size={16} />
          Dashboard Menu
        </Button>
      </div>

      {/* Mobile Drawer */}
      <DashboardMobileDrawer
        onOpenChange={setIsDrawerOpen}
        open={isDrawerOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Page Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
