// components/faqs/HomePageFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

const homepageFAQs = [
  {
    question: "What is IndianCoffeeBeans (ICB)?",
    answer:
      "IndianCoffeeBeans (ICB) is a community-driven platform to rate Indian specialty coffee and discover beans by taste, roast, and brew method — built on one of the most comprehensive directories covering India’s coffee regions, roasters, and estates.",
  },
  {
    question: "How does rating coffees work on ICB?",
    answer:
      "Pick a coffee you’ve brewed, rate it, and optionally add tasting notes and brew details. Ratings and reviews help other coffee drinkers compare coffees across roasters, and they also improve your personal recommendations inside ICB.",
  },
  {
    question: "Do I need an account to rate or review?",
    answer:
      "You can browse everything without an account. For ratings and reviews, ICB may ask you to sign in so your taste profile and recommendations can be saved and improved over time.",
  },
  {
    question: "Are listings or reviews paid or sponsored?",
    answer:
      "No. ICB is not a marketplace and does not accept paid reviews. Roasters can claim or update their profile information, but community ratings and reviews are not influenced by sponsorships.",
  },
  {
    question: "How do recommendations work?",
    answer:
      "Recommendations are based on what you rate highly and the coffee attributes you tend to like (for example: roast level, processing, and flavor profile). As you add more ratings, ICB gets better at suggesting coffees similar to what you enjoy.",
  },
  {
    question: "Can roasters update their profiles or submit coffees?",
    answer:
      "Yes. Roasters can request edits, add missing coffees, and keep their information accurate. Use the contact page to submit updates, and we’ll review and publish changes to maintain quality and consistency.",
  },
];

export function HomepageFAQ() {
  return (
    <FAQSection
      badge="Help & Support"
      description="Quick answers on how ICB works, how ratings shape your taste profile, and how roasters keep listings accurate."
      items={homepageFAQs}
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
