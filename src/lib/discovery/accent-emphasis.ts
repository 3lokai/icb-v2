/**
 * Parse the first `*emphasized*` segment in a plain string.
 * Returns null if there is no complete pair (e.g. lone `*` or empty `**`).
 */
export function splitEmphasisPair(text: string): {
  before: string;
  accent: string;
  after: string;
} | null {
  const m = /\*(.+?)\*/.exec(text);
  if (!m || m.index === undefined) {
    return null;
  }
  return {
    before: text.slice(0, m.index),
    accent: m[1],
    after: text.slice(m.index + m[0].length),
  };
}
