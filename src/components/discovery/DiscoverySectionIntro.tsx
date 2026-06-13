import { Accent } from "@/components/primitives/accent";
import { splitEmphasisPair } from "@/lib/discovery/accent-emphasis";
import { cn } from "@/lib/utils";

type DiscoverySectionIntroProps = {
  overline: string;
  /** Plain string with a single `*accent*` pair, or any ReactNode */
  title: React.ReactNode;
  description?: React.ReactNode;
  rightAside?: React.ReactNode;
  /** Anchor the header with a hairline rule below it (editorial section break). */
  divider?: boolean;
  className?: string;
};

function TitleHeading({ children }: { children: React.ReactNode }) {
  if (typeof children === "string") {
    const parts = splitEmphasisPair(children);
    if (parts) {
      return (
        <h2 className="text-title text-balance leading-[1.08] tracking-tight">
          {parts.before}
          <Accent>{parts.accent}</Accent>
          {parts.after}
        </h2>
      );
    }
  }
  return (
    <h2 className="text-title text-balance leading-[1.08] tracking-tight">
      {children}
    </h2>
  );
}

/**
 * Shared editorial section header: a refined kicker (accent tick + overline),
 * a Fraunces title whose single accented word carries the colour, an optional
 * lead paragraph, and an optional right-aligned aside. Pass `divider` to anchor
 * the header with a hairline rule (the "field-guide section break").
 *
 * The brush-smear in the title is the one colour moment — the kicker stays
 * quiet so it doesn't compete.
 */
export function DiscoverySectionIntro({
  overline,
  title,
  description,
  rightAside,
  divider = false,
  className,
}: DiscoverySectionIntroProps) {
  return (
    <div className={cn("mx-auto max-w-6xl w-full px-4 md:px-0", className)}>
      <div
        className={cn(
          "grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-12 md:items-end",
          divider && "border-b border-border/40 pb-7"
        )}
      >
        <div className="md:col-span-8">
          <div className="flex flex-col gap-5">
            <span className="inline-flex items-center gap-3 text-overline font-medium tracking-[0.18em] text-muted-foreground">
              <span aria-hidden="true" className="h-px w-7 bg-accent" />
              {overline}
            </span>
            <TitleHeading>{title}</TitleHeading>
            {description ? (
              <div className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                {description}
              </div>
            ) : null}
          </div>
        </div>
        {rightAside ? (
          <div className="md:col-span-4 flex justify-start md:justify-end md:pb-1">
            {rightAside}
          </div>
        ) : null}
      </div>
    </div>
  );
}
