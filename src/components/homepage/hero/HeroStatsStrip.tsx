import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";

type HeroStatsStripProps = {
  totals: PublicDirectoryTotals;
};

export function HeroStatsStrip({ totals }: HeroStatsStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4 py-6 lg:py-8">
      <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
        <span>
          <span className="tabular-nums">{totals.coffees}</span> coffees listed
        </span>
      </div>
      <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
        <span>
          <span className="tabular-nums">{totals.roasters}</span> Indian
          roasters
        </span>
      </div>
      <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
        Community-driven, not sponsored
      </div>
      <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
        Free to use
      </div>
    </div>
  );
}
