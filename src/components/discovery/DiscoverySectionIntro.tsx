import { splitEmphasisPair } from "@/lib/discovery/accent-emphasis";
import { cn } from "@/lib/utils";

type DiscoverySectionIntroProps = {
  overline: string;
  /** Plain string with a single `*accent*` pair, or any ReactNode */
  title: React.ReactNode;
  description?: React.ReactNode;
  rightAside?: React.ReactNode;
  className?: string;
};

function TitleHeading({ children }: { children: React.ReactNode }) {
  if (typeof children === "string") {
    const parts = splitEmphasisPair(children);
    if (parts) {
      return (
        <h2 className="text-title text-balance leading-[1.1] tracking-tight">
          {parts.before}
          <span className="text-accent italic">{parts.accent}</span>
          {parts.after}
        </h2>
      );
    }
  }
  return (
    <h2 className="text-title text-balance leading-[1.1] tracking-tight">
      {children}
    </h2>
  );
}

/**
 * Shared “tools page” section header: accent line, overline, title, optional body + right column.
 */
export function DiscoverySectionIntro({
  overline,
  title,
  description,
  rightAside,
  className,
}: DiscoverySectionIntroProps) {
  return (
    <div className={cn("mx-auto max-w-6xl w-full px-4 md:px-0", className)}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                {overline}
              </span>
            </div>
            <TitleHeading>{title}</TitleHeading>
            {description ? (
              <div className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                {description}
              </div>
            ) : null}
          </div>
        </div>
        {rightAside ? (
          <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
            {rightAside}
          </div>
        ) : null}
      </div>
    </div>
  );
}
