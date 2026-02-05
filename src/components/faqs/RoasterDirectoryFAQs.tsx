// components/faqs/RoasterDirectoryFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

const roasterDirectoryFAQs = [
  {
    question: "How are roasters listed on IndianCoffeeBeans (ICB)?",
    answer:
      "ICB lists Indian specialty coffee roasters to help you discover coffees and compare offerings across brands. We aim to keep listings accurate and structured, but some fields may be missing if a roaster hasn’t shared details publicly yet.",
  },
  {
    question: "How do I evaluate a roaster before buying?",
    answer:
      "Check the coffees they offer (origins, processing, roast range), look for roast-date or freshness info, review their shipping and support policies, and browse community ratings and reviews on coffees from that roaster to see what people actually liked.",
  },
  {
    question: "Do roasters ship across India?",
    answer:
      "Shipping coverage varies by roaster. Open a roaster profile to find their store link and shipping details, and confirm delivery options at checkout on the roaster’s website.",
  },
  {
    question: "How can I contact a roaster directly?",
    answer:
      "Each roaster profile links to their website and social channels, and may include contact details if publicly available. The fastest route is usually their store contact or Instagram DM.",
  },
  {
    question: "Can I leave a review for a roaster on ICB?",
    answer:
      "Yes. You can rate and review roasters based on your overall experience (ordering, service, consistency), and you can also rate and review individual coffees for taste and brewing results. Both show up on ICB to help others decide.",
  },
  {
    question: "I’m a roaster. How do I claim or update my page?",
    answer:
      "Use the Contact page to request a claim or submit updates. We’ll verify the request and then help update your profile, add coffees, and keep your listing current and consistent.",
  },
  {
    question: "I found incorrect or outdated information. How do I report it?",
    answer:
      "Send the correction through the Contact page with the roaster name and what needs fixing (links, location, store URL, coffees, etc.). Updates are reviewed before publishing to avoid data drift.",
  },
];

export function RoasterDirectoryFAQ() {
  return (
    <FAQSection
      badge="Roaster Directory"
      description="Quick answers on how roasters are listed, how to evaluate them, and how to claim or update a profile."
      items={roasterDirectoryFAQs}
      overline="The Professionals"
      title={
        <>
          Roaster <span className="text-accent italic">FAQs.</span>
        </>
      }
    />
  );
}
