import type { CoffeeDetail } from "@/types/coffee-types";
import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";

export type FaqItem = { question: string; answer: string };

/** Join labels as "a, b and c". */
function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Build 2-3 data-templated FAQs for a coffee SKU. Each question is emitted only
 * when the data it needs exists, so no empty/placeholder entries reach the page
 * or the FAQPage JSON-LD.
 */
export function buildCoffeeFaqItems(coffee: CoffeeDetail): FaqItem[] {
  const name = getCoffeeDisplayName(coffee);
  const faqs: FaqItem[] = [];

  // 1. Tasting notes
  if (coffee.flavor_notes.length > 0) {
    const notes = joinList(coffee.flavor_notes.slice(0, 4).map((f) => f.label));
    const who = coffee.roaster?.name
      ? `${coffee.roaster.name}'s`
      : "The roaster's";
    faqs.push({
      question: `What does ${name} taste like?`,
      answer: `${who} tasting notes for ${name} lean toward ${notes}. Flavor is subjective and shifts with roast freshness, grind size, and brew method, so your cup may vary.`,
    });
  }

  // 2. Single-origin vs blend.
  // ponytail: derived from estate/region count (get_coffee_detail RPC has no
  // is_single_origin). Swap to that column if the RPC ever exposes it.
  const originCount = Math.max(coffee.estates.length, coffee.regions.length);
  if (originCount >= 1) {
    const isBlend = originCount > 1;
    faqs.push({
      question: `Is ${name} single-origin or a blend?`,
      answer: isBlend
        ? `${name} is a blend, combining beans from more than one origin. Blends are built for a consistent, balanced cup across seasons.`
        : `${name} is a single-origin coffee, sourced from one origin rather than blended, so it reflects the character of that specific place.`,
    });
  }

  // 3. Grind size for the suggested brew methods
  if (coffee.brew_methods.length > 0) {
    const methods = joinList(coffee.brew_methods.map((b) => b.label));
    faqs.push({
      question: `What grind size should I use for ${name}?`,
      answer: `${name} is suggested for ${methods}. As a rule of thumb: espresso needs a fine grind, pour-over and drip a medium grind, and French press or cold brew a coarse grind. Dial in from there to taste.`,
    });
  }

  return faqs;
}
