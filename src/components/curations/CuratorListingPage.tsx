"use client";

import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Curator } from "./types";

type CuratorListingPageProps = {
  curators: Curator[];
};

export function CuratorListingPage({ curators }: CuratorListingPageProps) {
  return (
    <PageShell maxWidth="7xl">
      <div className="[&>section]:mx-0">
        <PageHeader
          overline="CURATED RECOMMENDATIONS"
          title={
            <>
              Curations by cafés, baristas, and{" "}
              <span className="text-accent italic">serious coffee people.</span>
            </>
          }
          description="Independent coffee recommendations from people who brew, taste, and care deeply about Indian specialty coffee."
        />
      </div>

      <Section spacing="default">
        <div className="max-w-2xl">
          <Stack gap="4">
            <h2 className="text-title font-serif">
              What are Curations on ICB?
            </h2>
            <p className="text-body text-muted-foreground leading-relaxed">
              Curations are personal coffee recommendations from cafés,
              baristas, and community voices with a clear point of view.
            </p>
            <p className="text-body text-muted-foreground leading-relaxed">
              Each curator shares coffees they&apos;ve brewed, enjoyed, and
              stand behind — based on taste, not trends.
            </p>
            <p className="text-caption text-muted-foreground italic">
              Think of it as editorial taste, not ratings.
            </p>
          </Stack>
        </div>
      </Section>

      {/* Main Curator Listing */}
      <Section spacing="default">
        <Stack gap="6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/10 pb-6">
            <Stack gap="2">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  EXPLORE CURATORS
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                Editorial <span className="text-accent italic">Taste.</span>
              </h2>
            </Stack>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curators.length === 0 ? (
              <p className="text-body text-muted-foreground col-span-full py-12 text-center">
                No curators yet. Check back soon for curated recommendations.
              </p>
            ) : (
              curators.map((curator) => (
                <CuratorCard key={curator.id} curator={curator} />
              ))
            )}
          </div>
        </Stack>
      </Section>

      {/* Integrity note — tone anchor */}

      <div className="border-t border-border/40 pt-6">
        <Stack gap="1">
          <p className="text-caption text-muted-foreground font-medium">
            Independent by design
          </p>
          <p className="text-caption text-muted-foreground max-w-2xl">
            Curations on ICB aren&apos;t sponsored or influenced by brands.
            Every recommendation reflects the curator&apos;s own brewing
            preferences.
          </p>
        </Stack>
      </div>

      {/* CTA Section — who becomes a curator, styled like NewsletterSection */}
      <Section spacing="default">
        <div className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Subtle magazine-paper pattern */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.45]"
            >
              <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-muted/50 blur-2xl" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/30" />
            </div>

            <div className="relative p-6 md:p-10">
              <div className="mx-auto max-w-xl text-center">
                <Stack gap="4">
                  <div className="inline-flex flex-col items-center gap-4">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        Become a voice
                      </span>
                      <span className="h-px w-8 bg-accent/60" />
                    </div>
                    <h2
                      className="text-title text-balance font-serif"
                      id="curations-cta-heading"
                    >
                      Want to share your coffee recommendations?
                    </h2>
                  </div>

                  <p className="text-body text-muted-foreground leading-relaxed">
                    Curations on ICB come from people with a visible tasting
                    history — cafés, baristas, and community contributors with
                    consistent preferences.
                  </p>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    If you care deeply about coffee, start by building your
                    profile and share what you brew.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                      size="lg"
                      className="rounded-full px-8 w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/profile">Build your profile</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/coffees">Explore coffees</Link>
                    </Button>
                  </div>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function CuratorCard({ curator }: { curator: Curator }) {
  return (
    <Card className="group h-full flex flex-col border-border/40 hover:border-accent/30 transition-all duration-300 bg-card overflow-hidden rounded-2xl">
      <CardContent className="p-6 flex flex-col h-full gap-5">
        <div className="flex items-start justify-between">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-border/50">
            <Image
              src={curator.logo}
              alt={curator.name}
              fill
              className="object-cover"
            />
          </div>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-micro uppercase tracking-widest font-bold bg-muted/50 border-none"
          >
            {curator.curatorType}
          </Badge>
        </div>

        <Stack gap="1">
          <h3 className="text-heading font-serif group-hover:text-accent transition-colors duration-300">
            {curator.name}
          </h3>
          <p className="text-caption text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-tight">
            {curator.location}
          </p>
        </Stack>

        <p className="text-body text-muted-foreground font-serif italic line-clamp-2 leading-relaxed h-[3rem]">
          &quot;{curator.philosophy || curator.story.slice(0, 60)}...&quot;
        </p>

        <div className="mt-auto">
          <Stack gap="3">
            <div className="flex items-center justify-between text-micro text-muted-foreground border-t border-border/10 pt-4">
              <span className="font-semibold uppercase tracking-widest">
                RECENT PICKS
              </span>
            </div>

            <div className="text-caption font-medium text-muted-foreground/80">
              {curator.recentPicks?.join(" · ") || "Specialty Selection"}
            </div>

            <Link href={`/curations/${curator.slug}`} className="block">
              <Button
                variant="outline"
                className="w-full rounded-xl group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300"
              >
                View curation
              </Button>
            </Link>
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
}
