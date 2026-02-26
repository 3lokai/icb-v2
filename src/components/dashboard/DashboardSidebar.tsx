"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "SquaresFour",
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: "User",
  },
  {
    title: "Coffee Preferences",
    url: "/dashboard/preferences",
    icon: "Coffee",
  },
  {
    title: "My Reviews",
    url: "/dashboard/my-reviews",
    icon: "Star",
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: "Bell",
  },
  {
    title: "Privacy & Data",
    url: "/dashboard/privacy",
    icon: "Shield",
  },
  {
    title: "Developer",
    url: "/dashboard/developer",
    icon: "Code",
  },
] as const;

type DashboardSidebarContentProps = {
  showHeader?: boolean;
};

/**
 * Dashboard Sidebar Content Component
 * Reusable navigation content used in both sidebar and mobile drawer
 * Matches filter sidebar design patterns from CoffeeFilterSidebar and RoasterFilterSidebar
 */
export function DashboardSidebarContent({
  showHeader = true,
}: DashboardSidebarContentProps) {
  const pathname = usePathname();

  return (
    <Stack gap="8" className="w-full">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <h2 className="text-subheading font-bold uppercase tracking-widest text-foreground/80">
            Navigation
          </h2>
        </div>
      )}

      {/* Navigation Items */}
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="navigation-menu"
        >
          Menu
        </label>
        <Stack gap="1" className="pr-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(item.url));

            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "group flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 transition-colors",
                  isActive
                    ? "text-accent font-medium"
                    : "text-foreground hover:text-accent"
                )}
              >
                <Icon
                  name={item.icon as IconName}
                  size={16}
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground group-hover:text-accent"
                  )}
                />
                <span className="text-caption font-medium transition-colors">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}

/**
 * Dashboard Sidebar Component
 * Simple navigation sidebar similar to filter sidebars on other pages
 * Hidden on mobile, visible on desktop
 */
export function DashboardSidebar() {
  return (
    <aside className="hidden w-full md:block md:w-64">
      <DashboardSidebarContent />
    </aside>
  );
}
