"use client";

import { ChartDownloadButton } from "./ChartDownloadButton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  id: string;
  title: string;
  subtitle: string;
  callout?: string;
  footnote?: string;
  fileName: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  id,
  title,
  subtitle,
  callout,
  footnote,
  fileName,
  children,
  className,
}: ChartCardProps) {
  const contentId = `chart-content-${id}`;

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 rounded-lg border border-border/60 bg-card overflow-hidden",
        className
      )}
    >
      {/* Chart header */}
      <div className="flex flex-col gap-1 border-b border-border/40 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading text-foreground">{title}</h2>
          <p className="text-caption">{subtitle}</p>
        </div>
        <div className="mt-2 shrink-0 sm:mt-0">
          <ChartDownloadButton targetId={contentId} fileName={fileName} />
        </div>
      </div>

      {/* Chart body — this is what gets exported */}
      <div id={contentId} className="bg-card px-6 py-6">
        {children}

        {callout && (
          <div className="mt-5 rounded-sm border-l-2 border-accent bg-accent/8 px-4 py-3">
            <p className="text-body leading-relaxed text-foreground/80">
              <span className="font-medium text-accent">↳ </span>
              {callout}
            </p>
          </div>
        )}
      </div>

      {footnote && (
        <div className="border-t border-border/30 px-6 py-3">
          <p className="text-caption italic text-muted-foreground/70">
            {footnote}
          </p>
        </div>
      )}
    </section>
  );
}
