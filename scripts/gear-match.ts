/**
 * Name → gear_catalog matching for roaster store listings (raw_products).
 *
 * An alias matches when every one of its words appears in the listing name. The most
 * specific alias (most words) wins, so "aeropress go" beats "aeropress" and
 * "aeropress filter" beats both. A tie between two products is ambiguous and goes to the
 * review CSV instead of being guessed. Only the words before "for" count: "Cloth Filters
 * for AeroPress" is a cloth filter, not an AeroPress.
 *
 * ponytail: word-subset alias matching. Upgrade to trigram/embeddings only if the
 * unmatched CSV stays large after two alias rounds; GTIN matching once retailers supply
 * barcodes.
 */

/**
 * A listing containing any of these words is never auto-matched, unless the alias itself
 * uses the word. Bundles, merch, spare parts, and clone brands that name the product
 * they copy.
 */
const STOP_WORDS = new Set([
  "set",
  "kit",
  "combo",
  "bundle",
  "with",
  "style",
  "type",
  "tee",
  "shirt",
  "badge",
  "sticker",
  "storage",
  "holder",
  "stand",
  "cloth",
  "sample",
  // replacement parts name the product they fit
  "replacement",
  "spare",
  "part",
  "gasket",
  "seal",
  "cap",
  "bincoo",
  "espressa",
  "ikape",
  "mhw",
  "3bomber",
  "muvna",
]);

/** Lowercase, strip punctuation/emoji/pre-order prefixes, join split model names, naive singular. */
export function normalizeWords(name: string): string[] {
  const s = name
    .toLowerCase()
    .replace(/&#?\w+;/g, " ") // html entities from store feeds (&#8211;)
    .replace(/[\[(]?\b(pre[\s-]?order|coming soon|new)\b[\])]?/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bv 60\b/g, "v60")
    .replace(/\b1 zpresso\b/g, "1zpresso")
    .replace(/\baero press\b/g, "aeropress")
    .replace(/\borgami\b/g, "origami")
    .trim();
  if (!s) return [];
  return s
    .split(" ")
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
}

export type MatchTarget = { slug: string; aliases: string[] };

export type MatchResult =
  | { kind: "match"; slug: string; alias: string }
  | { kind: "ambiguous"; slugs: string[] }
  | { kind: "stopword"; word: string }
  | { kind: "none" };

export function matchName(name: string, targets: MatchTarget[]): MatchResult {
  const all = normalizeWords(name);
  const cut = all.indexOf("for");
  const words = new Set(cut === -1 ? all : all.slice(0, cut));

  let best = 0;
  let hits: { slug: string; alias: string; aliasWords: string[] }[] = [];
  for (const t of targets) {
    for (const alias of t.aliases) {
      const aliasWords = normalizeWords(alias);
      if (aliasWords.length === 0 || !aliasWords.every((w) => words.has(w)))
        continue;
      if (aliasWords.length > best) {
        best = aliasWords.length;
        hits = [];
      }
      if (aliasWords.length === best)
        hits.push({ slug: t.slug, alias, aliasWords });
    }
  }
  if (hits.length === 0) return { kind: "none" };

  const slugs = [...new Set(hits.map((h) => h.slug))];
  if (slugs.length > 1) return { kind: "ambiguous", slugs };

  const allowed = new Set(hits.flatMap((h) => h.aliasWords));
  const stop = [...words].find((w) => STOP_WORDS.has(w) && !allowed.has(w));
  if (stop) return { kind: "stopword", word: stop };

  return { kind: "match", slug: slugs[0], alias: hits[0].alias };
}
