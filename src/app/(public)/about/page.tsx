// src/app/(public)/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, IconName } from "@/components/common/Icon";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { Cluster } from "@/components/primitives/cluster";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { aboutPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "About IndianCoffeeBeans.com - Discover India's Coffee Culture",
  description:
    "Learn about our mission to create the definitive resource for Indian coffee beans and roasters, connecting enthusiasts with India's rich coffee heritage.",
  keywords: ["indian coffee", "coffee directory", "about", "coffee mission"],
  image: "/images/placeholder-coffee-beans.jpg",
  canonical: "/about",
  type: "website",
});

export default function AboutPage() {
  return (
    <>
      <StructuredData schema={aboutPageSchema} />
      <Stack gap="16">
        {/* Hero Header - Editorial Style */}
        <header className="relative pt-12 text-center">
          <Section spacing="tight">
            <Stack gap="6" className="items-center">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.2em]">
                  The Mission
                </span>
                <span className="h-px w-12 bg-accent/60" />
              </div>
              <h1 className="animate-fade-in-scale text-display text-primary text-balance leading-[1.05]">
                About{" "}
                <span className="text-accent italic">IndianCoffeeBeans</span>
                .com
              </h1>
              <p className="mx-auto max-w-3xl text-body-large text-muted-foreground leading-relaxed md:text-heading">
                India&apos;s first comprehensive, independent directory for
                specialty coffee
              </p>
            </Stack>
          </Section>
        </header>

        {/* The Platform Section - Clean, magazine layout */}
        <Section contained={true} spacing="default">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-12 lg:col-span-7">
              <Stack gap="8">
                <Stack gap="4">
                  <h2 className="text-title text-primary italic">
                    The Platform
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                </Stack>

                <Stack gap="6" className="text-body text-foreground">
                  <p>
                    IndianCoffeeBeans.com is India&apos;s first comprehensive,
                    independent directory for specialty coffee roasters and
                    their offerings. We&apos;re building a user-first,
                    research-friendly resource that helps home brewers discover,
                    compare, and enjoy the rapidly growing Indian specialty
                    coffee scene.
                  </p>
                  <p>
                    In a country with over 300,000 coffee growers and a legacy
                    dating back to the 17th century, finding your perfect Indian
                    coffee shouldn&apos;t require endless scrolling through
                    social media or relying on which brands have the biggest
                    marketing budgets.
                  </p>
                  <div className="rounded-xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-6">
                    <p className="font-serif text-body-large text-accent-foreground leading-relaxed">
                      Our platform focuses on what matters: transparent
                      information about beans, processing methods, flavor
                      profiles, and brewing recommendations — all in one place.
                    </p>
                  </div>
                </Stack>
              </Stack>
            </div>

            <div className="md:col-span-12 lg:col-span-5">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/40">
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 to-accent/20 opacity-40 transition-opacity duration-500 group-hover:opacity-60" />
                <Image
                  alt="Indian coffee beans"
                  className="img-responsive object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  priority
                  src="/images/about/coffee-beans.png"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Mission Section - Solid Editorial Approach */}
        <Section spacing="loose">
          <Stack gap="12" className="items-center text-center">
            <Stack gap="4" className="items-center">
              <span className="text-micro font-bold uppercase tracking-widest text-accent">
                Our Core Mission
              </span>
              <h2 className="text-title text-primary text-balance">
                Honesty. Discovery.{" "}
                <span className="italic text-accent">Community.</span>
              </h2>
              <div className="h-px w-24 bg-accent/40" />
            </Stack>

            <p className="mx-auto max-w-3xl text-body-large text-muted-foreground">
              We&apos;re building a home for Indian coffee lovers — where
              discovery is easy, information is honest, and every sip feels
              intentional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                {
                  title: "Fair Discovery",
                  description:
                    "Highlight every quality Indian roaster — not just the loudest or most followed. Great coffee shouldn't hide behind algorithms.",
                  icon: "MagnifyingGlass",
                },
                {
                  title: "Smarter Choices",
                  description:
                    "Explore beans by what really matters — flavor, process, roast, brew style — and feel confident in every bag you buy.",
                  icon: "SlidersHorizontal",
                },
                {
                  title: "Powered by Community",
                  description:
                    "Real reviews, shared brews, and lived experiences — because coffee should be shaped by people, not promotions.",
                  icon: "UsersThree",
                },
              ].map((item) => (
                <div
                  className="p-8 group rounded-2xl border border-border/40 bg-card/10 transition-all duration-300 hover:border-accent/30 hover:bg-card/30"
                  key={item.title}
                >
                  <Stack gap="6" className="items-center">
                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                      <Icon name={item.icon as IconName} size={32} />
                    </div>
                    <Stack gap="3">
                      <h3 className="text-heading text-primary font-serif italic">
                        {item.title}
                      </h3>
                      <p className="text-caption leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </Stack>
                  </Stack>
                </div>
              ))}
            </div>
          </Stack>
        </Section>

        {/* Indian Coffee Landscape - Clean editorial approach */}
        <Section spacing="default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border/40 bg-muted/5">
                <Image
                  alt="Map of Indian coffee regions"
                  className="img-responsive object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  fill
                  src="/images/about/indian-coffee-regions.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="rounded-full bg-background/90 px-4 py-1.5 font-medium text-micro uppercase tracking-widest border border-border/30 text-muted-foreground shadow-sm">
                    Coffee Growing Regions of India
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 space-y-8 lg:order-2">
              <Stack gap="6">
                <Stack gap="4">
                  <h2 className="text-title text-primary italic">
                    The Indian Landscape
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                </Stack>

                <p className="text-body-large text-muted-foreground">
                  India&apos;s coffee story is one of remarkable diversity and
                  hidden potential:
                </p>

                <div className="grid gap-4">
                  {[
                    {
                      title: "Rich History",
                      content:
                        "Coffee cultivation in India dates back to 1670 when Baba Budan smuggled seven coffee beans from Yemen and planted them in the hills of Karnataka.",
                    },
                    {
                      title: "Unique Growing Conditions",
                      content:
                        "Indian coffee typically grows under shade (unlike many global regions), creating distinctive flavor profiles.",
                    },
                    {
                      title: "Regional Diversity",
                      content:
                        "From the spice-influenced beans of Kerala to the chocolate notes of Tamil Nadu coffees.",
                    },
                    {
                      title: "Processing Innovation",
                      content:
                        "India is known for its unique monsooned coffees, exposed to monsoon winds to create low-acidity, full-bodied brews.",
                    },
                  ].map((item) => (
                    <div
                      className="p-5 rounded-xl border border-border/20 bg-muted/5 transition-all duration-300 hover:border-accent/20 hover:bg-muted/10 group"
                      key={item.title}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                        <p className="text-body">
                          <span className="font-bold text-primary mr-1">
                            {item.title}:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {item.content}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    variant="link"
                    className="text-accent hover:text-accent-foreground p-0 h-auto font-bold uppercase tracking-widest text-micro group"
                  >
                    <Link href="/regions">
                      Explore Indian Coffee Regions
                      <Icon
                        className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                        name="ArrowRight"
                        size={14}
                      />
                    </Link>
                  </Button>
                </div>
              </Stack>
            </div>
          </div>
        </Section>

        {/* For Our Users - Editorial Grid */}
        <Section spacing="default">
          <Stack gap="12">
            <Stack gap="4">
              <h2 className="text-title text-primary italic">For Our Users</h2>
              <div className="h-px w-16 bg-accent/60" />
            </Stack>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                {
                  title: "Home Brewers",
                  description:
                    "Whether you're just getting started with a simple French press or have a dedicated brewing corner with multiple devices, our platform helps you find the perfect beans for your method and taste preferences.",
                  icon: "Coffee",
                },
                {
                  title: "Specialty Enthusiasts",
                  description:
                    "For those chasing the perfect cup, we provide detailed information on processing methods, varietals, and flavor notes to help you explore India's finest specialty offerings.",
                  icon: "Star",
                },
                {
                  title: "Equipment Buyers",
                  description:
                    "Upgrading your setup? Our resources help you understand which coffees work best with different brewing methods, so your new equipment investment pays off in delicious results.",
                  icon: "Gear",
                },
                {
                  title: "Self-Researchers",
                  description:
                    "If you prefer to make informed decisions based on data rather than Instagram hype, our comprehensive filters and community reviews provide the substance behind the style.",
                  icon: "Notebook",
                },
              ].map((user) => (
                <div
                  className="group p-8 rounded-2xl border border-border/40 bg-card/5 transition-all duration-300 hover:border-accent/30 hover:bg-card/20"
                  key={user.title}
                >
                  <div className="flex items-start gap-6">
                    <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-xl border border-accent/20 bg-accent/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/10">
                      <Icon
                        color="accent"
                        name={user.icon as IconName}
                        size={28}
                      />
                    </div>
                    <Stack gap="2" className="flex-1">
                      <h3 className="text-heading text-primary transition-colors duration-200 group-hover:text-accent font-serif italic">
                        {user.title}
                      </h3>
                      <p className="text-caption leading-relaxed text-muted-foreground">
                        {user.description}
                      </p>
                    </Stack>
                  </div>
                </div>
              ))}
            </div>
          </Stack>
        </Section>

        {/* About Me - Personal, editorial layout */}
        <Section spacing="default">
          <Stack gap="12">
            <Stack gap="4">
              <h2 className="text-title text-primary italic">About Me</h2>
              <div className="h-px w-16 bg-accent/60" />
            </Stack>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <Stack gap="8">
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/40">
                    <Image
                      alt="Founder brewing coffee"
                      className="img-responsive object-cover transition-transform duration-700 group-hover:scale-105"
                      fill
                      src="/images/about/founder.jpg"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>

                  <div className="rounded-2xl border border-border/30 bg-muted/5 p-8">
                    <h3 className="mb-6 text-heading text-primary font-serif italic">
                      Quick Facts
                    </h3>
                    <Stack gap="4">
                      {[
                        {
                          label: "Favorite Brew Method",
                          value: "Inverted AeroPress",
                        },
                        { label: "Preferred Roast", value: "Dark" },
                        { label: "Coffee Epiphany", value: "Italy, 2012" },
                      ].map((fact) => (
                        <div
                          className="flex items-center justify-between border-border/20 border-b pb-4 last:border-0 last:pb-0"
                          key={fact.label}
                        >
                          <span className="font-bold text-micro uppercase tracking-widest text-muted-foreground">
                            {fact.label}
                          </span>
                          <span className="text-accent font-medium">
                            {fact.value}
                          </span>
                        </div>
                      ))}
                    </Stack>
                  </div>
                </Stack>
              </div>

              <div className="lg:col-span-8">
                <Stack
                  gap="6"
                  className="text-body-large text-muted-foreground leading-relaxed"
                >
                  <p className="text-foreground">
                    This platform was born from my personal coffee journey,
                    which has had a few pivotal moments:
                  </p>
                  <p>
                    It all began with the comfort of South Indian filter coffee
                    — those childhood mornings waking up to its distinctive
                    aroma remain some of my fondest memories. Years later in
                    2012, I spent 6-7 months in Italy, where I fell under the
                    spell of their espresso culture.
                  </p>
                  <p>
                    But it wasn&apos;t until after the pandemic that my casual
                    interest evolved into something deeper. Like many coffee
                    journeys, mine started humbly — with instant coffee — and
                    gradually expanded to a full brewing station and a growing
                    collection of beans.
                  </p>
                  <p>
                    As a sales and marketing professional by trade, I approached
                    this project from the user&apos;s perspective. What would I
                    have wanted when I was just starting my specialty coffee
                    journey? The answer was simple: a straightforward,
                    comprehensive resource focused on Indian coffee, free from
                    marketing noise.
                  </p>
                  <div className="rounded-2xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-8 my-4">
                    <p className="font-serif italic text-accent-foreground text-heading text-pretty">
                      &quot;A huge shoutout to r/IndianCoffee which served as my
                      primary source of information as I navigated India&apos;s
                      coffee landscape. This directory is my way of giving back
                      to that community.&quot;
                    </p>
                  </div>
                  <p className="text-caption italic font-medium">
                    [More community shoutouts to be added]
                  </p>
                </Stack>
              </div>
            </div>
          </Stack>
        </Section>

        {/* CTA Section - Magazine Editorial Style */}
        <Section spacing="loose">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-muted/5 p-12 md:p-20 text-center">
            {/* Minimal Background Accents */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />

            <Stack gap="12" className="relative z-10 items-center">
              <Stack gap="4" className="items-center">
                <span className="text-micro font-bold uppercase tracking-[0.3em] text-accent">
                  The Future
                </span>
                <h2 className="text-title text-primary text-balance md:text-display">
                  Join Our <span className="italic">Community.</span>
                </h2>
                <div className="h-px w-24 bg-accent/40" />
              </Stack>

              <p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
                IndianCoffeeBeans.com is still evolving, but our vision is
                clear: to become the most trusted resource for discovering
                Indian coffee.
              </p>

              <Cluster gap="4" align="center" className="justify-center">
                {[
                  {
                    label: "Discover Coffees",
                    href: "/coffees",
                    variant: "default",
                  },
                  {
                    label: "Meet Roasters",
                    href: "/roasters",
                    variant: "secondary",
                  },
                  {
                    label: "Expand Knowledge",
                    href: "/learn",
                    variant: "outline",
                  },
                  { label: "Get In Touch", href: "/contact", variant: "ghost" },
                ].map((link) => (
                  <Button
                    asChild
                    key={link.href}
                    variant={link.variant as any}
                    size="lg"
                    className="px-8"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </Cluster>

              <div className="w-full max-w-2xl mx-auto pt-12 border-t border-border/30 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
                  <Stack gap="4">
                    <h3 className="text-heading text-primary font-serif italic">
                      Stay in the loop
                    </h3>
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      Get updates on new coffees, roasters, and brewing guides.
                      No spam, just pure caffeine.
                    </p>
                  </Stack>
                  <div className="p-1 bg-background rounded-2xl border border-border/40">
                    <NewsletterForm />
                  </div>
                </div>
              </div>

              <p className="text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic">
                Together, we&apos;re building something special — one bean at a
                time.
              </p>
            </Stack>
          </div>
        </Section>
      </Stack>
    </>
  );
}
