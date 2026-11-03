import { Accent } from "@/components/primitives/accent";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CommunityGrid } from "@/components/communities/CommunityGrid";
import { FAQSection } from "@/components/common/FAQ";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { getAllCommunities } from "@/data/communities";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { CommunitySubmissionModal } from "@/components/communities/CommunitySubmissionModal";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

export const metadata: Metadata = generateSEOMetadata({
  title: "Coffee & Barista Communities in India",
  description:
    "Find active coffee WhatsApp groups, Discord servers and forums in India for home brewers, baristas, roasters and the coffee-curious, each vetted for activity.",
  keywords: [
    "Indian coffee communities",
    "coffee WhatsApp groups India",
    "coffee Discord India",
    "barista WhatsApp group India",
    "roasting communities India",
  ],
  canonical: `${baseUrl}/communities`,
  type: "website",
});

export default async function CommunitiesPage() {
  const communities = await getAllCommunities();

  const collectionSchema = generateCollectionPageSchema(
    "Coffee Communities Directory",
    "Explore active coffee communities in India across various platforms.",
    `${baseUrl}/communities`,
    communities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: c.name,
        description: c.description,
        url: c.invite_url,
      },
    }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Communities", url: `${baseUrl}/communities` },
  ]);

  return (
    <>
      <PageHeader
        overline="COMMUNITY DIRECTORY"
        title={
          <>
            Where India&apos;s coffee people <Accent>gather.</Accent>
          </>
        }
        description={`${communities.length || "Vetted"}${communities.length ? " vetted" : ""} coffee communities across India: home-brew groups, city clubs, roaster circles, and open forums, some with their own channels for baristas.`}
      />
      <PageShell maxWidth="7xl">
        <StructuredData schema={[collectionSchema, breadcrumbSchema]} />

        {/* The directory leads, since it's what people came for. It server-renders
            in full: crawlers must see community names and join links. */}
        <CommunityGrid communities={communities} />

        {/* Editorial context lives below the directory: depth for readers and
          search engines (FAQ rich results) without delaying the primary task. */}
        <FAQSection
          overline="GOOD TO KNOW"
          title="Before you join"
          description="India's specialty coffee scene spans home brewers, competition baristas, roaster operators, and curious first-timers. Here's what to know before you join one of the communities above."
          badge="FAQ"
          items={[
            {
              question: "Why join an Indian coffee community?",
              answer:
                "Coffee gets better when it's shared. A good group shortens the learning curve: a question about a stalled fermentation or a fussy grinder gets a real answer in minutes, and the recommendations come from people drinking the same beans you can actually buy in India. Whether you brew on a South Indian filter, chase light-roast pour-overs, or run a café, there is a room moving at your pace.",
            },
            {
              question: "How does ICB vet these communities?",
              answer:
                "Every community on this page is checked for two things: recent activity and a welcoming tone. We skip dormant groups and anywhere that gatekeeps newcomers, so the directory stays useful whether you're asking your first brewing question or comparing roast profiles with people who've been at it for years.",
            },
            {
              question:
                "Which platform should I choose: WhatsApp, Discord, Telegram or Reddit?",
              answer:
                "Each platform has its own rhythm. WhatsApp and Telegram groups are fast and casual, good for quick brew questions and daily chatter. Discord servers split conversation into channels, so roasting, espresso, and gear talk each get their own space for deeper, searchable discussion. Reddit and Facebook groups run on longer posts and slower, reference-style threads. Use the platform filters above to find the format that fits how you like to talk about coffee.",
            },
            {
              question: "Are there WhatsApp groups for baristas in India?",
              answer:
                "Yes, though most barista talk happens inside the broader coffee communities rather than in standalone groups. Some of the larger groups listed here run separate channels for baristas and café staff, alongside their home-brewing and gear chats. Join the city or specialty group closest to your work and ask the admins for the barista channel.",
            },
            {
              question: "How do I get a community listed?",
              answer:
                "If you run a coffee group or know an active space that should be here, use the 'Suggest a Community' form at the bottom of this page. We review every submission for activity and tone before adding it to the directory.",
            },
          ]}
        />

        {/* Submission CTA */}
        <Section spacing="default">
          <div className="mx-auto max-w-2xl border-t border-border/40 py-12 text-center md:py-16">
            <Stack gap="6" className="items-center">
              <Stack gap="3">
                <h2 className="text-title">Missing a community?</h2>
                <p className="mx-auto max-w-md text-body text-muted-foreground">
                  If you run a coffee group or know an active space that should
                  be listed here, we&apos;d love to add it.
                </p>
              </Stack>
              <CommunitySubmissionModal />
            </Stack>
          </div>
        </Section>
      </PageShell>
    </>
  );
}
