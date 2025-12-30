// components/faqs/ExpertRecipesFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

export const expertRecipesFAQs = [
  {
    question:
      "What makes these expert recipes different from regular coffee recipes?",
    answer:
      "These are championship-winning recipes used in international competitions by world barista champions and coffee experts. They've been tested under pressure and refined for exceptional flavor extraction.",
  },
  {
    question: "Do I need special equipment to follow expert recipes?",
    answer:
      "While basic brewing equipment works, expert recipes often require precision tools like accurate scales (0.1g), gooseneck kettles, and quality grinders. Some recipes specify particular filters or brewing devices.",
  },
  {
    question: "What is the Tetsu Kasuya 4:6 method?",
    answer:
      "The 4:6 method divides brewing water into phases: first 40% controls sweetness/acidity balance, remaining 60% controls strength. This systematic approach won the 2016 World Brewers Cup Championship.",
  },
  {
    question:
      "How do I choose between beginner, intermediate, and advanced recipes?",
    answer:
      "Beginner recipes are forgiving with simple techniques. Intermediate recipes require attention to timing and pour technique. Advanced recipes demand precision, specific equipment, and practiced movements.",
  },
  {
    question: "Can I modify expert recipes for my taste preferences?",
    answer:
      "Start by following recipes exactly to understand the intended flavor. Then make small adjustments: grind size for extraction, ratio for strength, or temperature for balance. Document changes for consistency.",
  },
];

export function ExpertRecipesFAQ() {
  return (
    <FAQSection
      badge="Brewing Mastery"
      description="Common questions about expert recipes, championship techniques, and brewing mastery."
      items={expertRecipesFAQs}
      overline="The Details"
      title={
        <>
          Frequently Asked{" "}
          <span className="text-accent italic">Questions.</span>
        </>
      }
    />
  );
}
