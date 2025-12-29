"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/common/Icon";
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
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: "Bell",
  },
  {
    title: "Privacy & Data",
    url: "/dashboard/privacy",
    icon: "Shield",
  },
] as const;

/**
 * Dashboard Sidebar Content Component
 * Reusable navigation content used in both sidebar and mobile drawer
 */
export function DashboardSidebarContent() {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-subheading">Dashboard</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url));

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-caption transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon
                name={item.icon as IconName}
                size={16}
                className="h-4 w-4"
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Dashboard Sidebar Component
 * Simple navigation sidebar similar to filter sidebars on other pages
 * Hidden on mobile, visible on desktop
 */
export function DashboardSidebar() {
  return (
    <aside className="hidden w-full space-y-6 md:block md:w-64">
      <DashboardSidebarContent />
    </aside>
  );
}
