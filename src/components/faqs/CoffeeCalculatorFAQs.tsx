// components/faqs/CoffeeCalculatorFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

export const coffeeCalculatorFAQs = [
  {
    question: "What is the golden ratio for coffee brewing?",
    answer:
      "The golden ratio is 1:15 to 1:17 (1 gram coffee to 15-17 grams water), recommended by the Specialty Coffee Association. This translates to about 60-70g coffee per liter of water.",
  },
  {
    question: "How do I calculate coffee ratios for different brewing methods?",
    answer:
      "Different methods use different ratios: Pour over 1:15-1:17, French press 1:12-1:15, Espresso 1:2-1:3, Cold brew 1:4-1:8. Our calculator automatically adjusts for each method.",
  },
  {
    question: "Why does grind size matter for coffee ratios?",
    answer:
      "Grind size affects extraction speed. Finer grinds extract faster and may need coarser adjustments or shorter brew times. Coarser grinds need longer extraction times or stronger ratios.",
  },
  {
    question: "How accurate should my coffee measurements be?",
    answer:
      "Use a digital scale accurate to 0.1g for best results. Volumetric measurements (scoops, tablespoons) are inconsistent because coffee density varies by roast level and origin.",
  },
  {
    question: "What water temperature should I use for different roasts?",
    answer:
      "Light roasts: 95-100°C for full extraction, Medium roasts: 90-93°C for balanced flavor, Dark roasts: 87-90°C to avoid over-extraction and bitterness.",
  },
];

export function CoffeeCalculatorFAQ() {
  return (
    <FAQSection
      badge="Brewing Science"
      description="Common questions about coffee ratios, brewing techniques, and our calculator."
      items={coffeeCalculatorFAQs}
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
