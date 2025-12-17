import { FAQ } from "@/components/common/FAQ";
import StructuredData from "@/components/seo/StructuredData";
import { generateFAQSchema } from "@/lib/seo/schema";

// components/faqs/RoasterDirectoryFAQ.tsx
export function RoasterDirectoryFAQ() {
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
      question:
        "Are there any discounts or promotions available from roasters?",
      answer:
        "Some roasters may offer special promotions or discounts. Check individual roaster pages or subscribe to their newsletters for updates.",
    },
    {
      question: "Can I leave a review for a roaster?",
      answer:
        "Currently, we do not support direct user reviews on our platform. However, you can often find reviews on the roaster's own website or other coffee community forums.",
    },
  ];
  const schema = generateFAQSchema(roasterDirectoryFAQs);

  return (
    <section className="section-spacing bg-background/50 backdrop-blur-sm">
      <div className="container-default">
        <StructuredData schema={schema} />
        <div className="mb-8">
          <h2 className="text-title">Frequently Asked Questions</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Find answers to common questions about Indian coffee roasters.
          </p>
        </div>
        <FAQ className="my-0" items={roasterDirectoryFAQs} />
      </div>
    </section>
  );
}
