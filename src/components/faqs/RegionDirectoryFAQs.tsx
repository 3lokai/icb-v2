// components/faqs/RegionDirectoryFAQ.tsx

import { FAQ } from "@/components/common/FAQ";
import StructuredData from "@/components/seo/StructuredData";
import { generateFAQSchema } from "@/lib/seo/schema";

export function RegionDirectoryFAQ() {
  const regionDirectoryFAQs = [
    {
      question: "Which Indian states grow the best coffee?",
      answer:
        "Karnataka, Tamil Nadu, and Kerala are the primary coffee-growing states, with Karnataka producing about 70% of India's coffee.",
    },
    {
      question: "What makes each coffee region unique?",
      answer:
        "Each region has distinct climate, altitude, and soil conditions that create unique flavor profiles - from Karnataka's balanced cups to Kerala's spiced notes.",
    },
    {
      question:
        "Are there specific coffee festivals or events in these regions?",
      answer:
        "Yes, many coffee-growing regions host annual festivals and events celebrating their harvest and unique coffee culture. Check local tourism boards or our events section for details.",
    },
    {
      question: "Can I visit coffee plantations in India?",
      answer:
        "Absolutely! Many plantations in Karnataka, Kerala, and Tamil Nadu offer guided tours and stays, providing an immersive experience into coffee cultivation. It's recommended to book in advance.",
    },
    {
      question: "What are the main coffee varieties grown in India?",
      answer:
        "India primarily grows Arabica and Robusta. Arabica is known for its aromatic qualities, while Robusta offers body and strength, often used in blends.",
    },
  ];
  const schema = generateFAQSchema(regionDirectoryFAQs);

  return (
    <section className="section-spacing bg-background/50 backdrop-blur-sm">
      <div className="container-default">
        <StructuredData schema={schema} />
        <div className="mb-8">
          <h2 className="text-title">Frequently Asked Questions</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Find answers to common questions about Indian coffee regions.
          </p>
        </div>
        <FAQ className="my-0" items={regionDirectoryFAQs} />
      </div>
    </section>
  );
}
