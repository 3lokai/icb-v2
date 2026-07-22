import type { ReactNode } from "react";
import { Stack } from "@/components/primitives/stack";

type DashboardPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
};

/**
 * Shared "magazine-style" page header used across dashboard pages
 * (profile, preferences, notifications, privacy, my-reviews, overview).
 */
export function DashboardPageHeader({
  eyebrow,
  title,
  description,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <Stack gap="6">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                {eyebrow}
              </span>
            </div>
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              {title}
            </h2>
            <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
              {description}
            </p>
          </Stack>
        </div>
      </div>
    </div>
  );
}
