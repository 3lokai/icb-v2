import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Suspense fallback for FreshFromCommunitySection. The section's chrome (eyebrow,
 * heading, links) is static text, so it's rendered for real here — only the
 * data-dependent parts are skeletons. That keeps the header and footer rows
 * pixel-identical between fallback and resolved state.
 *
 * Measured against the live section (headless Chrome, dev): 710px vs 710px at
 * 1440w, 1313px vs 1314px at 390w. The quote-block min-heights below are what
 * make that line up — re-measure them if the card's padding, type scale, or the
 * 140-char comment truncation in FreshFromCommunitySection changes.
 *
 * ponytail: the one remaining shift is the RPC-failure path, where the section
 * resolves to null and this whole block collapses. Rare enough to leave alone.
 */
export function FreshFromCommunitySkeleton() {
  return (
    <Section spacing="default" id="fresh-from-community">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              Community voices
            </span>
          </div>
          <h2 className="text-title text-balance">
            Fresh from the <Accent>community.</Accent>
          </h2>
          <p className="text-body-large text-muted-foreground mt-3 max-w-2xl text-pretty">
            <Skeleton className="inline-block h-[1em] w-10 align-[-0.15em]" />
            {
              " new ratings in the last 30 days — here's what people are brewing and saying."
            }
          </p>
        </div>
        <span className="text-micro font-bold uppercase tracking-[0.15em] text-muted-foreground">
          All ratings →
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-5 rounded-xl border border-border/60 bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            {/* min-heights are empirical: they make the skeleton card match the
                real card's rendered height at each breakpoint (see file header). */}
            <div className="text-body-large flex-1 space-y-2 min-h-[129px] md:min-h-[165px]">
              <Skeleton className="h-[1em] w-full" />
              <Skeleton className="h-[1em] w-full" />
              <Skeleton className="h-[1em] w-full" />
              <Skeleton className="h-[1em] w-2/3" />
            </div>

            <div className="flex items-end justify-between gap-3 border-t border-border/40 pt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-body text-muted-foreground mt-10 text-center">
        <Skeleton className="inline-block h-[1em] w-16 align-[-0.15em]" />{" "}
        ratings and counting across the directory — add yours.
      </p>
    </Section>
  );
}
