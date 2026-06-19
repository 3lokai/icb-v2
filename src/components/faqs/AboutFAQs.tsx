// components/faqs/AboutFAQs.tsx
import { FAQSection } from "@/components/common/FAQ";
import { Accent } from "@/components/primitives/accent";

export const aboutFAQs = [
  {
    question: "What is IndianCoffeeBeans?",
    answer:
      "IndianCoffeeBeans (ICB) is India's first comprehensive, independent directory for specialty coffee roasters and their offerings. You can browse and filter coffees by flavor, roast, process, and brew method, read community ratings and reviews, and explore India's coffee regions — all in one place. ICB is not a marketplace; we help you discover and compare, then send you to roasters to buy.",
  },
  {
    question: "Who uses IndianCoffeeBeans?",
    answer:
      "Home brewers finding beans for their French press or AeroPress, specialty enthusiasts chasing processing details and flavor notes, equipment buyers matching coffees to new gear, and self-researchers who prefer filters and data over Instagram hype. If you care about Indian specialty coffee and want honest, structured information, ICB is built for you.",
  },
  {
    question: "How does IndianCoffeeBeans work?",
    answer:
      "Browse the coffee and roaster directories, apply filters to narrow by what matters to you, and read community ratings and reviews. Roasters can claim or update their profiles to keep listings accurate. As you rate coffees, ICB learns your taste and improves recommendations. See our full walkthrough on the How ICB Works page.",
  },
  {
    question: "What does IndianCoffeeBeans cost?",
    answer:
      "ICB is free for coffee drinkers — browse, filter, rate, and review at no charge. Roasters can claim their profile for free. Verified roasters who want a dashboard, analytics, and direct listing control can join our partner program.",
  },
  {
    question: "How is IndianCoffeeBeans different from alternatives?",
    answer:
      "ICB is independent: we do not accept paid reviews or sell placement in search results. We are India-specific — built around Indian regions, processing methods like monsooning, and roasters you can actually buy from here. Discovery is filter-first and research-friendly, not driven by who has the biggest social following or ad budget.",
  },
];

export function AboutFAQs() {
  return (
    <FAQSection
      badge="Our Story"
      description="The essentials on what we are, who we serve, and why an independent directory matters for India's specialty coffee scene."
      items={aboutFAQs}
      overline="Good to Know"
      title={
        <>
          About <Accent>ICB.</Accent>
        </>
      }
    />
  );
}
