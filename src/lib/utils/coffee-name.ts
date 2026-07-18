import { decode } from "he";

/**
 * Coffee names were scraped from roaster storefronts and carry three kinds of
 * junk: un-decoded HTML entities, marketing/SEO suffixes, and inconsistent
 * casing. `cleanCoffeeName` is the single source of truth for turning a raw
 * scraped `coffees.name` into something renderable.
 *
 * Pure function — no I/O. Used by both the one-off backfill script and the
 * runtime fallback in `getCoffeeDisplayName`.
 */

/**
 * Tokens that keep their upper-case form through title-casing — grade codes,
 * varietal/lot codes, certifying bodies and brand acronyms. Title-casing these
 * ("AAA" -> "Aaa", "SKIA" -> "Skia") is wrong in a way users notice.
 *
 * Only applies when the source token was already upper-case, so ordinary words
 * that collide with a code are unaffected. Derived from a scan of all-caps
 * tokens appearing inside mixed-case names; plain words that were merely
 * shouted (NOIR, VELVET, THEORY, ROYALE...) are deliberately excluded so they
 * still get title-cased.
 */
const PRESERVE_UPPER = new Set([
  // Grades
  "A",
  "AA",
  "AAA",
  "AB",
  "PB",
  "SHG",
  // Varietal / lot / process codes
  "SL",
  "SLN",
  "CAT",
  "RC",
  "CUL",
  "PSD",
  "RDH",
  "RDNN",
  "YC",
  "YB",
  "PKC",
  "DG",
  "CM",
  "MS",
  "BR",
  "OT",
  "MRS",
  "HSD",
  "VLGE",
  "CIMA",
  // Bodies / certifications
  "SCA",
  "USDA",
  "NBC",
  // Brand acronyms
  "ABK",
  "SKIA",
  "MNEB",
  "BEWILD",
  "UFO",
  "RG",
]);

/**
 * Lower-case connector words, unless they lead or trail the name.
 *
 * ponytail: "a"/"an" are deliberately absent — a bare "A" in this dataset is
 * almost always a grade code ("Plantation A", 'Arabica "A"'), not an article.
 */
const MINOR_WORDS = new Set([
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

/**
 * Title-case a single word, respecting internal punctuation:
 *   "maillard's" -> "Maillard's"   (not "Maillard'S")
 *   "co-ferment" -> "Co-Ferment"
 *   "100%"       -> "100%"
 */
function titleCaseWord(word: string): string {
  // Preserve only tokens that were ALREADY upper-case in the source. Matching
  // case-insensitively would uppercase innocent lower-case words that collide
  // with a code ("wild cat blend" -> "Wild CAT Blend").
  const letters = word.replace(/[^A-Za-z0-9]/g, "");
  if (
    letters &&
    letters === letters.toUpperCase() &&
    PRESERVE_UPPER.has(letters.toUpperCase())
  ) {
    return word;
  }

  // Capitalise after start, hyphen, opening bracket, opening quote, or "&".
  // A WORD-INITIAL apostrophe is consumed by the `^` branch ("'man" -> "'Man"),
  // but a mid-word one is not, so possessives stay lower-case:
  // "maillard’s" -> "Maillard’s", never "Maillard’S".
  //
  // \p{Ll} rather than [a-z] so non-ASCII names recase correctly ("ārabhi").
  const cased = word
    .toLowerCase()
    .replace(
      /(^['’]?|[-–—/([“"&])(\p{Ll})/gu,
      (_, sep: string, ch: string) => sep + ch.toUpperCase()
    );

  // Unit/lot codes attached to a number keep their upper-case form:
  // fermentation hours ("62H", "120H"), grades ("86+"), sizes. Lower-casing
  // these reads as a typo ("62h").
  return cased.replace(
    /(\d)([a-z])\b/g,
    (_, d: string, ch: string) => d + ch.toUpperCase()
  );
}

function toTitleCase(name: string): string {
  const words = name.split(" ");

  return words
    .map((word, i) => {
      if (!word) return word;
      const cased = titleCaseWord(word);
      const isEdge = i === 0 || i === words.length - 1;
      if (!isEdge && MINOR_WORDS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return cased;
    })
    .join(" ");
}

/** Escape a string for literal use inside a RegExp. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Strip the roaster's own name when it TRAILS the coffee name — it is always
 * rendered alongside the coffee, so repeating it is noise:
 *   "Mysore Nuggets - Red Sirocco"                  -> "Mysore Nuggets"
 *   "Vienna Roast - By Fraction 9 Coffee Roasters"  -> "Vienna Roast"
 *
 * ponytail: trailing only. Leading roaster names ("Mercara Gold Estate Peaberry
 * Plantation Robusta") are left alone — stripping those empties names like
 * "Shodh Coffee" outright and strips real product-line context from others.
 */
function stripTrailingRoaster(
  name: string,
  roaster: string | null | undefined
): string {
  if (!roaster?.trim()) return name;

  const core = escapeRegExp(roaster.trim());
  // Allow an optional trailing "Roasters"/"Coffee"/"Coffee Roasters" that the
  // storefront appended but the roaster record omits, and an optional "by".
  const pattern = new RegExp(
    `[\\s–—-]+(?:by\\s+)?${core}(?:'s)?(?:\\s+(?:coffee\\s+)?roaster(?:s|y)?)?(?:\\s+coffee)?\\s*$`,
    "i"
  );

  const stripped = name.replace(pattern, "").trim();
  // Never let the roaster rule empty a name (e.g. coffee literally named
  // after its roaster) — keep the original in that case.
  return stripped.length >= 3 ? stripped : name;
}

/**
 * Clean a raw scraped coffee name for display.
 *
 * Order matters: entities decode first so that a literal `&#8211;` becomes a
 * real en-dash, which the trailing-separator trim can then see and strip.
 *
 * `roasterName` is optional — pass it to also drop a redundant trailing roaster
 * name. Omitting it simply skips that rule.
 */
export function cleanCoffeeName(
  raw: string | null | undefined,
  roasterName?: string | null
): string {
  if (!raw) return "";

  let name = decode(raw);

  // Emoji / pictographs ("MOST WANTED DOPE 🚨🚨🚨"), plus the variation
  // selectors and ZWJ that glue emoji sequences together.
  //
  // ™ ® © are deliberately kept — they are legal marks, not decoration, and
  // "Shodh Coffee™" reads as intended. Indic scripts are untouched: the class
  // matches pictographs only, never letters or combining marks.
  name = name.replace(
    /(?![™®©])\p{Extended_Pictographic}|[\u{FE0F}\u{20E3}\u{200D}]/gu,
    ""
  );

  // SEO tail some storefronts append wholesale:
  //   "... Coffee Price in India - Buy ... online at https://example.com"
  name = name.replace(/\s+price\s+in\s+india\b.*$/i, "");

  // Marketing / SEO suffix: everything from the first pipe onward.
  // Spaces around the pipe are optional — real data has "India |Tariero Coffees".
  name = name.replace(/\s*\|.*$/s, "");

  // Parenthesised weight: "(250g)", "( 500 g )". Stripped ANYWHERE, not just
  // at the end — "Vienna Roast (250 gm) - By Fraction 9" has it mid-string.
  // Must also run BEFORE the bare-weight rule below, which would otherwise
  // consume "250g)" and strand the opening bracket ("A1 Naturals (").
  name = name.replace(/\s*\(\s*\d+\s?(?:g|gm|gms|kg|grams)\s*\)/gi, "");

  // Trailing weight, incl. an optional "Pack of" / "Net wt" lead-in:
  //   "- Pack of 250g", "– 500g", "250g", "- 1kg", "200 gm"
  name = name.replace(
    /[\s–—-]*(?:pack\s+of\s+|pack\s+|net\s+wt\.?\s*)?\d+\s?(?:g|gm|gms|kg|grams)\b.*$/i,
    ""
  );

  // A preceding strip can cut inside a bracketed group and leave it unclosed
  // ("...Coffee Bags (5 Sachets"). Drop the dangling fragment.
  name = name.replace(/\s*\([^)]*$/, "");

  // Collapse whitespace, then shave stray separators left behind by the strips.
  name = name.replace(/\s+/g, " ").trim();
  name = name.replace(/^[–—\-|:,]+\s*/, "").replace(/\s*[–—\-|:,]+$/, "");
  name = name.replace(/\s+/g, " ").trim();

  // Runs after the separator trim so "Vienna Roast (250 gm) - By Fraction 9"
  // has already lost its weight and is a clean "... - By Fraction 9".
  name = stripTrailingRoaster(name, roasterName);
  name = name.replace(/\s*[–—\-|:,]+$/, "").trim();

  return toTitleCase(name);
}

/**
 * Display name for a coffee. Prefers the backfilled `display_name` column and
 * falls back to cleaning `name` at runtime, so rows inserted since the last
 * backfill still render correctly.
 */
export function getCoffeeDisplayName(
  coffee:
    | {
        display_name?: string | null;
        name?: string | null;
        roaster_name?: string | null;
        // supabase-js types an embedded FK as an array even for a to-one
        // relation (which returns a single object at runtime). Accept both so
        // callers don't each need a cast.
        roasters?: { name?: string | null } | { name?: string | null }[] | null;
      }
    | null
    | undefined
): string {
  if (!coffee) return "";
  if (coffee.display_name?.trim()) return coffee.display_name.trim();

  // Roaster name is used when the caller happens to have it; absent is fine.
  const embedded = Array.isArray(coffee.roasters)
    ? coffee.roasters[0]?.name
    : coffee.roasters?.name;
  const roaster = coffee.roaster_name ?? embedded ?? null;
  return cleanCoffeeName(coffee.name, roaster);
}
