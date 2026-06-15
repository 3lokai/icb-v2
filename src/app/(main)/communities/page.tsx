import { Accent } from "@/components/primitives/accent";
import type { Metadata } from "next";
import { Suspense } from "react";
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
  title: "Coffee Communities in India | WhatsApp, Discord & More",
  description:
    "Connect with fellow coffee enthusiasts in India. Explore active WhatsApp groups, Discord servers, and forums for brewing, roasting, and specialty coffee talk.",
  keywords: [
    "Indian coffee communities",
    "coffee WhatsApp groups India",
    "coffee Discord India",
    "roasting communities India",
  ],
  canonical: `${baseUrl}/communities`,
  type: "website",
});

async function CommunitiesContent() {
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
    <PageShell maxWidth="7xl">
      <StructuredData schema={[collectionSchema, breadcrumbSchema]} />

      {/* The directory leads, since it's what people came for. */}
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
                If you run a coffee group or know an active space that should be
                listed here, we&apos;d love to add it.
              </p>
            </Stack>
            <CommunitySubmissionModal />
          </Stack>
        </div>
      </Section>
    </PageShell>
  );
}

function CommunitiesSkeleton() {
  return (
    <PageShell maxWidth="7xl">
      <h2 className="sr-only">Loading communities</h2>
      <Section spacing="default">
        <Stack gap="8">
          {/* Header + search */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Stack gap="2">
              <div className="h-8 w-56 animate-pulse rounded bg-muted/20" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted/20" />
            </Stack>
            <div className="h-11 w-full max-w-sm animate-pulse rounded bg-muted/20" />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 animate-pulse rounded-full bg-muted/20"
              />
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] w-full animate-pulse rounded-lg border border-border/5 bg-muted/10"
              />
            ))}
          </div>
        </Stack>
      </Section>
    </PageShell>
  );
}

export default function CommunitiesPage() {
  return (
    <>
      <PageHeader
        overline="COMMUNITY DIRECTORY"
        title={
          <>
            Where India&apos;s coffee people <Accent>gather.</Accent>
          </>
        }
        description="Connect with enthusiasts, professionals, and home brewers in vetted WhatsApp, Discord, Telegram, and social communities across India."
      />
      <Suspense fallback={<CommunitiesSkeleton />}>
        <CommunitiesContent />
      </Suspense>
    </>
  );
}
