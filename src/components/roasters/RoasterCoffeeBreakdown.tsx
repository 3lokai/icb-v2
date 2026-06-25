import { Stack } from "@/components/primitives/stack";
import {
  ROAST_LEVELS,
  PROCESSING_METHODS,
  type LookupOption,
} from "@/lib/utils/coffee-constants";

/* ─── Types ─── */

type DistributionItem = { value: string; count: number };

type RoasterCoffeeBreakdownProps = {
  roastDistribution?: DistributionItem[];
  processDistribution?: DistributionItem[];
};

/* ─── Helpers ─── */

/** Title-case an enum value as a fallback when it's not in the lookup map. */
function titleCase(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function labelFor(value: string, options: LookupOption[]): string {
  return options.find((o) => o.value === value)?.label ?? titleCase(value);
}

/**
 * Order roast buckets by canonical light→dark; anything unknown sinks to the end.
 */
function sortByRoast(items: DistributionItem[]): DistributionItem[] {
  const order = ROAST_LEVELS.map((o) => o.value);
  return [...items].sort((a, b) => {
    const ai = order.indexOf(a.value);
    const bi = order.indexOf(b.value);
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
  });
}

/* ─── Sub-component ─── */

function BreakdownColumn({
  title,
  items,
  options,
}: {
  title: string;
  items: DistributionItem[];
  options: LookupOption[];
}) {
  const total = items.reduce((sum, i) => sum + i.count, 0);
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="surface-1 rounded-xl p-4 border border-border/40">
      <Stack gap="3">
        <div className="flex items-baseline justify-between">
          <p className="text-overline tracking-[0.2em] text-muted-foreground">
            {title}
          </p>
          <span className="text-caption text-muted-foreground">
            {total} {total === 1 ? "coffee" : "coffees"}
          </span>
        </div>
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.value}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-foreground">
                  {labelFor(item.value, options)}
                </span>
                <span className="text-caption text-muted-foreground tabular-nums">
                  {item.count}
                </span>
              </div>
              <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Stack>
    </div>
  );
}

/* ─── Main Component ─── */

/**
 * At-a-glance breakdown of a roaster's coffees by roast level and process.
 * Counts cover the roaster's full public (active + seasonal) catalog — sourced
 * from the get_roaster_detail RPC's distribution aggregates, not the limited
 * coffees[] array shown as cards below.
 */
export function RoasterCoffeeBreakdown({
  roastDistribution,
  processDistribution,
}: RoasterCoffeeBreakdownProps) {
  const roast = sortByRoast(roastDistribution ?? []);
  const process = processDistribution ?? [];

  if (roast.length === 0 && process.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roast.length > 0 && (
        <BreakdownColumn
          title="Roast levels"
          items={roast}
          options={ROAST_LEVELS}
        />
      )}
      {process.length > 0 && (
        <BreakdownColumn
          title="Process"
          items={process}
          options={PROCESSING_METHODS}
        />
      )}
    </div>
  );
}
