import type { Metadata } from "next";
import NewsletterSection from "@/components/newsletter/NewsletterSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { BroadcastCard } from "@/components/newsletter/BroadcastCard";
import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";
import StructuredData from "@/components/seo/StructuredData";
import { listNewsletters } from "@/lib/data/fetch-newsletters";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  getSeoBaseUrl,
} from "@/lib/seo/schema";

export const revalidate = 3600;

const NEWSLETTER_DESCRIPTION =
  "Browse past issues of the Indian Coffee Beans newsletter — new roasters, fresh coffee drops, brewing tips, and stories from India's specialty coffee scene.";

export const metadata: Metadata = generateSEOMetadata({
  title: "Newsletter Archive",
  description: NEWSLETTER_DESCRIPTION,
  keywords: [
    "Indian coffee newsletter",
    "specialty coffee newsletter India",
    "coffee news India",
  ],
  canonical: "/newsletter",
  type: "website",
});

export default function NewsletterPage() {
  const issues = listNewsletters();

  const baseUrl = getSeoBaseUrl();
  const newsletterUrl = `${baseUrl}/newsletter`;

  const collectionSchema = generateCollectionPageSchema(
    "Newsletter Archive",
    NEWSLETTER_DESCRIPTION,
    newsletterUrl,
    issues.slice(0, 20).map((issue, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        name: issue.subject,
        url: `${newsletterUrl}/${issue.date}`,
        ...(issue.preview ? { description: issue.preview } : {}),
      },
    }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Newsletter", url: newsletterUrl },
  ]);

  return (
    <>
      <StructuredData schema={[collectionSchema, breadcrumbSchema]} />

      <PageHeader
        description="Every issue we've sent, in one place. New roasters, fresh drops, brewing tips, and stories from India's specialty coffee scene."
        overline="From Our Inbox to Yours"
        title={
          <>
            The <Accent>Newsletter</Accent> Archive
          </>
        }
      />

      {/* Primary action: subscribe. The archive below is the proof. */}
      <NewsletterSection />

      <Section eyebrow="The Archive" spacing="default" title="Past issues">
        {issues.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {issues.map((issue) => (
              <BroadcastCard issue={issue} key={issue.date} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center">
            <p className="text-heading font-semibold">No issues yet</p>
            <p className="mt-2 text-body text-muted-foreground">
              Past newsletters will appear here once we&apos;ve sent our first
              issue. Subscribe above so you don&apos;t miss it.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
