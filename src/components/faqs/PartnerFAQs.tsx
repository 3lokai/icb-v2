// components/faqs/PartnerFAQs.tsx
import { FAQSection } from "@/components/common/FAQ";

const partnerFAQs = [
  {
    question: "Do you take commission on sales?",
    answer: "No. We drive traffic to your website. You keep 100% of sales.",
  },
  {
    question: "How do I track performance?",
    answer:
      "Verified roasters get a dashboard with views, clicks, and engagement metrics.",
  },
  {
    question: "Can I manage my own listings?",
    answer:
      "Yes. Verified tier gives you full control to add/edit coffees and profile info.",
  },
  {
    question: 'What\'s the "Founding Roaster" benefit?',
    answer:
      "Lock in ₹3,500/year pricing forever (regular ₹6,000). Plus exclusive badge and launch features.",
  },
  {
    question: "How long does verification take?",
    answer:
      "24-48 hours after payment. We verify ownership via email/domain check.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, but no refunds after 7 days. Annual subscription, cancellation applies to next year.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We use Instamojo - accepts UPI, cards, net banking, wallets.",
  },
  {
    question: "Is GST included in pricing?",
    answer: "Prices shown are final. We're currently not GST registered.",
  },
];

export function PartnerFAQs() {
  return (
    <FAQSection
      badge="Need Help?"
      description="Everything you need to know about partnering with us, pricing, and what to expect."
      items={partnerFAQs}
      overline="Common Questions"
      title={
        <>
          Frequently Asked{" "}
          <span className="text-accent italic">Questions.</span>
        </>
      }
    />
  );
}
