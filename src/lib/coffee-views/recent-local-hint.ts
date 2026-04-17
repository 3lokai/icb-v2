/**
 * Bounded client-side hint for recently viewed coffee ids (not source of truth).
 * Server `coffee_views` wins; this supports fast invalidation and future optimistic UI.
 */

const STORAGE_KEY = "icb_recent_coffee_views";
const MAX_ENTRIES = 20;

export type RecentCoffeeViewHint = {
  coffeeId: string;
  lastViewedAt: string;
};

function parseHints(raw: string | null): RecentCoffeeViewHint[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is RecentCoffeeViewHint =>
          typeof x === "object" &&
          x !== null &&
          "coffeeId" in x &&
          typeof (x as RecentCoffeeViewHint).coffeeId === "string" &&
          "lastViewedAt" in x &&
          typeof (x as RecentCoffeeViewHint).lastViewedAt === "string"
      )
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function readRecentCoffeeViewHints(): RecentCoffeeViewHint[] {
  if (typeof window === "undefined") return [];
  try {
    return parseHints(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/**
 * Record a view hint after a successful server `recordCoffeeView`.
 * Newest first, deduped by `coffeeId`, capped at MAX_ENTRIES.
 */
export function pushRecentCoffeeViewHint(coffeeId: string): void {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  try {
    const prev = parseHints(localStorage.getItem(STORAGE_KEY));
    const next: RecentCoffeeViewHint[] = [
      { coffeeId, lastViewedAt: now },
      ...prev.filter((h) => h.coffeeId !== coffeeId),
    ].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // private mode / quota
  }
}
