import type { RoasterDetail } from "@/types/roaster-types";

export type FaqItem = { question: string; answer: string };

/** Join labels as "a, b and c". */
function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** kebab tag -> readable words, e.g. "single-origin" -> "single origin". */
const prettify = (s: string) => s.replace(/-/g, " ").trim();

/**
 * Build template-driven FAQs for a roaster profile from real roaster fields.
 * Each question is emitted only when its data exists, so no empty entries reach
 * the page or the FAQPage JSON-LD.
 */
export function buildRoasterFaqItems(roaster: RoasterDetail): FaqItem[] {
  const name = roaster.name;
  const faqs: FaqItem[] = [];

  // 1. Where they source from (regions_sourced is editorial prose; fall back to
  //    the broader sourcing_approach if regions aren't written up).
  const origin =
    roaster.regions_sourced?.trim() || roaster.sourcing_approach?.trim();
  if (origin) {
    faqs.push({
      question: `Where does ${name} source its coffee?`,
      answer: origin,
    });
  }

  // 2. What they specialize in (from focus / sourcing model / certifications).
  const focus = (roaster.specialty_focus ?? []).filter(Boolean).map(prettify);
  const sourcing = (roaster.sourcing_model ?? []).filter(Boolean).map(prettify);
  const certs = (roaster.certifications ?? []).filter(Boolean);
  if (focus.length || sourcing.length) {
    const clauses: string[] = [];
    if (focus.length) clauses.push(`${joinList(focus)} coffee`);
    if (sourcing.length) clauses.push(`${joinList(sourcing)} sourcing`);
    let answer = `${name} focuses on ${joinList(clauses)}.`;
    if (certs.length) {
      answer += ` They hold ${joinList(certs)} certification${certs.length > 1 ? "s" : ""}.`;
    }
    faqs.push({
      question: `What does ${name} specialize in?`,
      answer,
    });
  }

  // 3. Where / how to buy (online store, subscription, physical presence).
  if (
    roaster.website ||
    roaster.has_subscription ||
    roaster.has_physical_store
  ) {
    let answer = roaster.website
      ? `You can order online directly from ${name}'s store`
      : `You can buy directly from ${name}`;
    if (roaster.has_subscription) answer += ", including a subscription option";
    answer += ".";
    if (roaster.has_physical_store) {
      const cities = Array.from(
        new Set(
          (roaster.physical_locations ?? [])
            .map((l) => l.city)
            .filter((c): c is string => Boolean(c))
        )
      );
      answer += cities.length
        ? ` They also have a physical presence in ${joinList(cities)}.`
        : " They also operate a physical store.";
    }
    faqs.push({
      question: `Where can I buy from ${name}?`,
      answer,
    });
  }

  return faqs;
}
