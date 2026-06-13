// src/components/home/CtaSection.tsx
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Accent } from "@/components/primitives/accent";
import { Decor } from "@/components/primitives/decor";
import { Reveal } from "@/components/primitives/reveal";
import { Button } from "@/components/ui/button";
import {
  fetchPublicDirectoryTotals,
  type PublicDirectoryTotals,
} from "@/lib/data/fetch-public-directory-totals";

const TOTALS_FALLBACK: PublicDirectoryTotals = { coffees: 0, roasters: 0 };

export default async function CtaSection() {
  let totals = TOTALS_FALLBACK;
  try {
    totals = await fetchPublicDirectoryTotals();
  } catch (e) {
    console.error("[CtaSection] fetchPublicDirectoryTotals", e);
  }

  return (
    <Section spacing="default">
      <Reveal className="mx-auto max-w-6xl">
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
          {/* Subtle "magazine" accent: stripe + film grain + wash */}
          <Decor stripe texture="grain" wash />

          <div className="relative p-6 sm:p-10 md:p-14 lg:p-16">
            <div className="grid items-center gap-10 md:gap-16 md:grid-cols-12">
              {/* Left: editorial copy */}
              <div className="md:col-span-7">
                <Stack gap="8">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      India’s coffee directory
                    </span>
                  </div>

                  <Stack gap="6">
                    <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                      Find Indian specialty coffee <Accent>worth</Accent>{" "}
                      brewing.
                    </h2>
                    <p className="max-w-xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      We organize the complexity of India&apos;s coffee
                      landscape—roasters, estates, and processing methods—so you
                      can pick better coffee, faster.
                    </p>
                  </Stack>

                  <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-5">
                    <Button
                      asChild
                      className="hover-lift w-full sm:w-auto px-8"
                      variant="default"
                      size="lg"
                    >
                      <Link href="/coffees">
                        <Icon className="mr-2" name="Coffee" size={18} />
                        Explore Directory
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="hover-lift w-full sm:w-auto px-8"
                      variant="secondary"
                      size="lg"
                    >
                      <Link href="/roasters">
                        <Icon className="mr-2" name="Storefront" size={18} />
                        Meet Roasters
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="link"
                      className="group/link ml-0 sm:ml-2 gap-2 text-muted-foreground hover:text-accent"
                    >
                      <Link href="/tools">
                        Usage Tools
                        <Icon
                          name="ArrowRight"
                          size={16}
                          className="transition-transform group-hover/link:translate-x-1"
                        />
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                    Updated Weekly
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                    Built for the community
                  </div>
                </Stack>
              </div>

              {/* Right: restrained stat block (aligned to system) */}
              <div className="md:col-span-12 lg:col-span-5 lg:mt-0 mt-4 flex flex-col items-start text-left">
                <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-background/40 p-6 md:p-8 transition-all hover:bg-background/60 hover:border-border/80 text-left">
                  <Stack gap="6">
                    <div className="flex items-center justify-between">
                      <span className="text-overline text-muted-foreground font-semibold tracking-wider">
                        The Snapshot
                      </span>
                      <Icon
                        name="Coffee"
                        size={18}
                        className="text-accent/40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border bg-card p-5 group/stat">
                        <div className="text-title font-bold tracking-tighter transition-transform group-hover/stat:-translate-y-0.5 tabular-nums">
                          {totals.roasters.toLocaleString()}+
                        </div>
                        <div className="mt-1 text-label font-bold text-accent">
                          Roasters
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-card p-5 group/stat">
                        <div className="text-title font-bold tracking-tighter transition-transform group-hover/stat:-translate-y-0.5 tabular-nums">
                          {totals.coffees.toLocaleString()}+
                        </div>
                        <div className="mt-1 text-label font-bold text-accent">
                          Beans
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                      <Stack gap="3">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="MapPin"
                            size={14}
                            className="text-accent"
                          />
                          <span className="text-overline text-muted-foreground font-semibold">
                            Verified Data
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-caption font-medium">
                          {["Tasting Notes", "Regions", "Processing"].map(
                            (item) => (
                              <span
                                key={item}
                                className="flex items-center gap-1.5"
                              >
                                <span className="h-1 w-1 rounded-full bg-border" />
                                {item}
                              </span>
                            )
                          )}
                        </div>
                      </Stack>
                    </div>

                    <div className="mt-2 text-center">
                      <p className="text-micro text-muted-foreground italic">
                        Real comparisons, no poetic nonsense.
                      </p>
                    </div>
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
