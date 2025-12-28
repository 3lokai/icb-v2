"use client";

import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl" | "full";
  className?: string;
};

/**
 * PageShell - Main content container
 *
 * Use ONCE per page to wrap your primary content area.
 * Provides consistent max-width and horizontal padding.
 *
 * @example
 * // In your page component:
 * <main>
 *   <PageShell>
 *     <Section>...</Section>
 *   </PageShell>
 * </main>
 */
export function PageShell({
  children,
  maxWidth = "7xl",
  className,
}: PageShellProps) {
  const maxWidthClasses = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        // CRITICAL: This is the ONLY horizontal padding scale for the entire site.
        // DO NOT create custom padding elsewhere. All pages must use PageShell.
        "mx-auto px-4 md:px-6 lg:px-8",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
