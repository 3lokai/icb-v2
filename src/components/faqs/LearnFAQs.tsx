// components/faqs/LearnFAQ.tsx

import { FAQ } from "@/components/common/FAQ";
import StructuredData from "@/components/seo/StructuredData";
import { generateFAQSchema } from "@/lib/seo/schema";

export function LearnFAQ() {
  const learnFAQs = [
    {
      question: "I'm new to coffee - where should I start?",
      answer:
        "Begin with our Coffee 101 section, then explore brewing guides starting with simple methods like French press or South Indian filter coffee.",
    },
    {
      question: "What brewing method is best for beginners?",
      answer:
        "French press or South Indian filter coffee are most forgiving for beginners, requiring minimal technique while producing excellent results.",
    },
    {
      question: "How can I deepen my coffee knowledge beyond the basics?",
      answer:
        "Explore our advanced guides on coffee processing methods, sensory evaluation, and the science behind extraction. We also recommend attending local coffee workshops or cupping sessions.",
    },
    {
      question: "Are there resources for professional baristas or roasters?",
      answer:
        "While our primary focus is on home enthusiasts, many of our in-depth articles on coffee science, origin, and quality control can be valuable for aspiring and professional baristas/roasters.",
    },
    {
      question: "How often is new learning content added?",
      answer:
        "We regularly publish new articles, guides, and series to keep our content fresh and comprehensive. Subscribe to our newsletter to stay updated on the latest additions.",
    },
  ];
  const schema = generateFAQSchema(learnFAQs);

  return (
    <section className="section-spacing bg-background/50 backdrop-blur-sm">
      <div className="container-default">
        <StructuredData schema={schema} />
        <div className="mb-8">
          <h2 className="text-title">Frequently Asked Questions</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Find answers to common questions about learning coffee.
          </p>
        </div>
        <FAQ className="my-0" items={learnFAQs} />
      </div>
    </section>
  );
}
