// components/faqs/RoasterDirectoryFAQ.tsx
import { FAQSection } from "@/components/common/FAQ";

const roasterDirectoryFAQs = [
  {
    question: "How do I know if a roaster is legitimate?",
    answer:
      "Look for our verification badge, check their established date, read reviews, and verify their physical location and contact information.",
  },
  {
    question: "Do these roasters ship across India?",
    answer:
      "Most verified roasters offer pan-India shipping. Check individual roaster pages for specific delivery areas and shipping costs.",
  },
  {
    question: "How can I contact a roaster directly?",
    answer:
      "Each roaster's profile page includes their contact information (if available), such as email, phone number, and links to their social media or website.",
  },
  {
    question: "Are there any discounts or promotions available from roasters?",
    answer:
      "Some roasters may offer special promotions or discounts. Check individual roaster pages or subscribe to their newsletters for updates.",
  },
  {
    question: "Can I leave a review for a roaster?",
    answer:
      "Currently, we do not support direct user reviews on our platform. However, you can often find reviews on the roaster's own website or other coffee community forums.",
  },
  {
    question: "I'm a roaster. How can I claim my page?",
    answer:
      "If you're a roaster listed on our directory, you can claim your page by reaching out to us through our Contact page. We'll verify your identity and grant you access to manage your roaster profile, including updating information, adding new coffees, and managing your listing.",
  },
  {
    question: "How do I update my roaster information or add new coffees?",
    answer:
      "Once you've claimed your roaster page, you can reach out to us through our Contact page with the updates you'd like to make. We'll help you keep your profile current, including contact information, location details, coffee listings, and any other relevant information about your roastery.",
  },
  {
    question: "What happens after I claim my roaster page?",
    answer:
      "After claiming your page and verification, you'll be able to work with us to ensure your listing is accurate and up-to-date. This includes updating your business information, adding new coffee offerings, managing your profile details, and ensuring customers can find the most current information about your roastery.",
  },
];

export function RoasterDirectoryFAQ() {
  return (
    <FAQSection
      badge="Verified Roasters"
      description="Essential information about discovering, contacting, and purchasing from India's specialty coffee roasters."
      items={roasterDirectoryFAQs}
      overline="The Professionals"
      title={
        <>
          Roaster <span className="text-accent italic">Relations.</span>
        </>
      }
    />
  );
}
