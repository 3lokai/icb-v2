// components/faqs/CoffeeDirectoryFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

const coffeeDirectoryFAQs = [
  {
    question: "How do I find coffees by brew method, roast, or flavor on ICB?",
    answer:
      "Use the filters and grouping options to browse coffees by brew method, roast level, processing method, or flavor profile. You can compare coffees across roasters and save time by narrowing to styles you already enjoy.",
  },
  {
    question: "What does “process” mean on a coffee listing?",
    answer:
      "Processing is how the coffee fruit is handled after harvest (for example: washed, natural, honey). It can strongly influence taste — naturals often feel fruitier, washed coffees often feel cleaner, and honey can sit in-between.",
  },
  {
    question: "What roast level should I choose for my brew method?",
    answer:
      "Light roasts tend to highlight acidity and fruit, medium roasts balance sweetness and clarity, and darker roasts emphasize body and roastiness. Espresso often works well with medium to medium-dark, while pour-over and AeroPress can shine with lighter roasts depending on your taste.",
  },
  {
    question: "What’s the difference between Indian Arabica and Robusta?",
    answer:
      "Arabica is often more aromatic and complex, while Robusta typically adds body, bitterness, and crema (especially in espresso). Many Indian blends combine both to balance sweetness, body, and strength.",
  },
  {
    question: "How do ratings and reviews help recommendations on ICB?",
    answer:
      "When you rate coffees you’ve brewed, ICB learns what you like (roast, process, and flavor patterns) and can suggest similar coffees. Reviews and brew details also help other coffee drinkers compare coffees more accurately.",
  },
  {
    question: "What is Monsooned Malabar coffee?",
    answer:
      "Monsooned Malabar is an Indian processing style where green coffee is exposed to monsoon winds and humidity. It typically produces a low-acid cup with heavier body and earthy, woody notes — often used in espresso blends.",
  },
  {
    question: "How should I store coffee beans for best flavor?",
    answer:
      "Store beans in an airtight container away from light, heat, and moisture. A cool, dark cupboard is ideal. Avoid refrigeration because moisture and food odors can affect flavor once the bag is opened.",
  },
];

export function CoffeeDirectoryFAQ() {
  return (
    <FAQSection
      badge="Brewing Wisdom"
      description="Quick answers on choosing, filtering, and rating Indian coffees — plus the basics that actually matter for flavor."
      items={coffeeDirectoryFAQs}
      overline="Coffee Guide"
      title={
        <>
          Common <span className="text-accent italic">Curiosities.</span>
        </>
      }
    />
  );
}
