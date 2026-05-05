import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CommunityGrid } from "@/components/communities/CommunityGrid";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { getAllCommunities } from "@/data/communities";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";

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

  return (
    <PageShell maxWidth="7xl">
      <StructuredData schema={collectionSchema} />

      <Section spacing="default">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-accent tracking-[0.15em] uppercase">
                  BETTER TOGETHER
                </span>
              </div>
              <h2 className="text-display leading-tight">
                Brewing in <span className="italic">Good Company.</span>
              </h2>
              <div className="h-0.5 w-10 bg-border/40" />
            </Stack>
          </div>

          <div className="md:col-span-7">
            <Stack gap="6" className="max-w-xl">
              <p className="text-body-large text-muted-foreground">
                Coffee is better when shared. We&apos;ve curated the most active
                and welcoming community spaces for Indian coffee enthusiasts.
              </p>
              <p className="text-body text-muted-foreground/80">
                Whether you&apos;re a home brewer looking for advice, a roaster
                sharing techniques, or just looking to geek out about beans —
                there&apos;s a space for you here.
              </p>
            </Stack>
          </div>
        </div>
      </Section>

      <CommunityGrid communities={communities} />

      <Section spacing="default">
        <div className="mx-auto max-w-4xl py-12 md:py-20 text-center border-t border-border/10">
          <Stack gap="6" className="items-center">
            <h3 className="text-title">Missing a community?</h3>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              If you run a coffee group or know of an active space that should
              be listed here, we&apos;d love to add it.
            </p>
            <a
              href="mailto:support@indiancoffeebeans.com?subject=New Community Suggestion"
              className="text-accent font-medium hover:underline flex items-center gap-2"
            >
              Suggest a community
            </a>
          </Stack>
        </div>
      </Section>
    </PageShell>
  );
}

function CommunitiesSkeleton() {
  return (
    <PageShell maxWidth="7xl">
      {/* Header Skeleton */}
      <div className="py-16 md:py-24 border-b border-border/10">
        <Stack gap="6">
          <div className="h-4 w-32 animate-pulse rounded bg-muted/20" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted/20 md:h-16" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted/20" />
        </Stack>
      </div>

      <Section spacing="default">
        <Stack gap="12">
          {/* Controls Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="h-10 w-48 animate-pulse rounded bg-muted/20" />
            <div className="h-11 w-full max-w-sm animate-pulse rounded bg-muted/20" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] w-full animate-pulse rounded-lg bg-muted/10 border border-border/5"
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
            Where India&apos;s coffee people{" "}
            <span className="text-accent italic">gather.</span>
          </>
        }
        description="Connect with enthusiasts, professionals, and home brewers in dedicated WhatsApp, Discord, and social communities across India."
      />
      <Suspense fallback={<CommunitiesSkeleton />}>
        <CommunitiesContent />
      </Suspense>
    </>
  );
}
