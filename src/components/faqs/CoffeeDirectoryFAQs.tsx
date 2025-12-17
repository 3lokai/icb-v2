// components/faqs/CoffeeDirectoryFAQ.tsx

import { FAQ } from "@/components/common/FAQ";
import StructuredData from "@/components/seo/StructuredData";
import { generateFAQSchema } from "@/lib/seo/schema";

export function CoffeeDirectoryFAQ() {
  const coffeeDirectoryFAQs = [
    {
      question: "What roast level is best for Indian coffee?",
      answer:
        "Medium to medium-dark roasts highlight Indian coffee's natural sweetness and body, especially for filter coffee preparations.",
    },
    {
      question:
        "What's the difference between Arabica and Robusta Indian coffee?",
      answer:
        "Indian Arabica offers complex flavors and acidity, while Robusta provides body and crema - many Indian blends combine both.",
    },
    {
      question: "How do I choose the right grind size?",
      answer:
        "Coarse for French press, medium for pour-over, fine for espresso, and medium-fine for traditional South Indian filter coffee.",
    },
    {
      question: "What are the common flavor notes in Indian coffee?",
      answer:
        "Indian coffees often feature notes of chocolate, caramel, spices, nuts, and sometimes subtle fruity or floral undertones, depending on the region and processing.",
    },
    {
      question: "How should I store my coffee beans?",
      answer:
        "Store coffee beans in an airtight container, away from light, heat, and moisture. Ideally, keep them in a cool, dark place, but avoid refrigeration as it can introduce moisture and odors.",
    },
    {
      question: "What is 'Monsooned Malabar' coffee?",
      answer:
        "Monsooned Malabar is a unique Indian coffee processed by exposing unroasted beans to monsoon winds and humidity, resulting in a distinct low-acid, bold, and earthy flavor profile.",
    },
  ];
  const schema = generateFAQSchema(coffeeDirectoryFAQs);

  return (
    <section className="section-spacing bg-background/50 backdrop-blur-sm">
      <div className="container-default">
        <StructuredData schema={schema} />
        <div className="mb-8">
          <h2 className="text-title">Frequently Asked Questions</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Find answers to common questions about Indian coffee.
          </p>
        </div>
        <FAQ className="my-0" items={coffeeDirectoryFAQs} />
      </div>
    </section>
  );
}
