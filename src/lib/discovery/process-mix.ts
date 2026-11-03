import type { ProcessEnum } from "@/types/db-enums";

/** The processes worth naming in a region's live split; the long tail stays in the total. */
export const PROCESS_MIX_KEYS = [
  "washed",
  "natural",
  "honey",
  "anaerobic",
] as const satisfies readonly ProcessEnum[];

export type ProcessMixKey = (typeof PROCESS_MIX_KEYS)[number];

/**
 * One live sentence on how a region's in-stock lots split by process, e.g.
 * "On ICB, 12 of the 30 in-stock Koraput lots are washed, with 5 natural and 3 honey."
 * Returns undefined when the sample is too small to say anything useful.
 */
export function processMixSentence(
  label: string,
  total: number,
  counts: Record<ProcessMixKey, number>
): string | undefined {
  const parts = PROCESS_MIX_KEYS.map((k) => [k, counts[k]] as const)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  if (total < 5 || parts.length === 0) return undefined;

  const [[lead, leadCount], ...rest] = parts;
  const tail = rest.map(([k, n]) => `${n} ${k}`);
  const list =
    tail.length > 1
      ? `${tail.slice(0, -1).join(", ")} and ${tail[tail.length - 1]}`
      : tail[0];
  return `On ICB, ${leadCount} of the ${total} in-stock ${label} lots are ${lead}${list ? `, with ${list}` : ""}.`;
}
