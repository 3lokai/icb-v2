// components/faqs/HomePageFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

const homepageFAQs = [
  {
    question: "What is IndianCoffeeBeans.com?",
    answer:
      "India's first comprehensive directory for specialty coffee beans, roasters, and brewing knowledge.",
  },
  {
    question: "How do I find coffee roasters near me in India?",
    answer:
      "Use our roaster directory with filters for location, including major cities across Karnataka, Tamil Nadu, Kerala, and other coffee regions.",
  },
  {
    question: "Can I buy coffee directly through your site?",
    answer:
      "We connect you with verified roasters and their online stores. Each listing includes direct purchase links and contact information.",
  },
  {
    question: "Is IndianCoffeeBeans.com free to use?",
    answer:
      "Yes, our platform is completely free for users to explore roasters, coffees, regions, and educational content. We aim to promote Indian specialty coffee.",
  },
  {
    question: "How often is the directory updated?",
    answer:
      "We regularly update our directories with new roasters, coffee beans, and regional information to ensure you have access to the latest and most accurate data. Contact us via our contact page if you notice any outdated information.",
  },
  {
    question: "Can I submit my roastery or coffee farm to be featured?",
    answer:
      "Yes, we welcome submissions from Indian specialty coffee roasters and farms. Please visit our Contact page for submission guidelines and criteria.",
  },
];

export function HomepageFAQ() {
  return (
    <FAQSection
      badge="Help & Support"
      description="Find answers to common questions about IndianCoffeeBeans.com and how we help you navigate the landscape."
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
