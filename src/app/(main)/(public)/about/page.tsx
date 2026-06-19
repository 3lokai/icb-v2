// src/app/(public)/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, IconName } from "@/components/common/Icon";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { AboutFAQs } from "@/components/faqs/AboutFAQs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { Cluster } from "@/components/primitives/cluster";
import { Decor } from "@/components/primitives/decor";
import { PageShell } from "@/components/primitives/page-shell";
import { Prose } from "@/components/primitives/prose";
import { Rule } from "@/components/primitives/rule";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { aboutPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "About Us",
  description:
    "Learn what IndianCoffeeBeans is, who it's for, and how our independent directory helps you discover Indian specialty coffee, with answers to common questions.",
  keywords: [
    "IndianCoffeeBeans mission",
    "indian coffee directory",
    "specialty coffee India",
    "what is IndianCoffeeBeans",
    "Indian coffee directory FAQ",
  ],
  image: "/images/placeholder-coffee-beans.jpg",
  canonical: "/about",
  type: "website",
});

const PRINCIPLES: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Fair Discovery",
    description:
      "Highlight every quality Indian roaster, not just the loudest or most followed. Great coffee shouldn't hide behind algorithms.",
    icon: "MagnifyingGlass",
  },
  {
    title: "Smarter Choices",
    description:
      "Explore beans by what really matters: flavor, process, roast, brew style, and feel confident in every bag you buy.",
    icon: "SlidersHorizontal",
  },
  {
    title: "Powered by Community",
    description:
      "Real reviews, shared brews, and lived experiences, because coffee should be shaped by people, not promotions.",
    icon: "UsersThree",
  },
];

const LANDSCAPE: { title: string; content: string }[] = [
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
];

const AUDIENCES: { title: string; description: string; icon: IconName }[] = [
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
];

const QUICK_FACTS: { label: string; value: string }[] = [
  { label: "Favorite Brew Method", value: "AeroPress" },
  { label: "Preferred Roast", value: "Light, Medium" },
  { label: "Coffee Epiphany", value: "Italy, 2012" },
];

const CTA_LINKS: {
  label: string;
  href: string;
  variant: React.ComponentProps<typeof Button>["variant"];
}[] = [
  { label: "Discover Coffees", href: "/coffees", variant: "default" },
  { label: "Meet Roasters", href: "/roasters", variant: "secondary" },
  { label: "Expand Knowledge", href: "/learn", variant: "outline" },
  { label: "Get In Touch", href: "/contact", variant: "ghost" },
];

export default function AboutPage() {
  return (
    <>
      <StructuredData schema={aboutPageSchema} />

      <PageHeader
        backgroundImage="/images/hero-about.avif"
        backgroundImageAlt="IndianCoffeeBeans About Page"
        description="India's first comprehensive, independent directory for specialty coffee roasters and their offerings."
        overline="The Mission"
        title={<>About IndianCoffeeBeans.com</>}
      />

      {/* Platform: overlapping editorial card lifted over the hero */}
      <PageShell className="relative z-30 -mt-20 pb-4">
        <div className="surface-1 rounded-xl p-8 shadow-sm md:p-12">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-12 lg:col-span-7">
              <Stack gap="8">
                <h2 className="text-title">
                  The <Accent>Platform</Accent>
                </h2>

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

                  <div className="surface-2 relative overflow-hidden rounded-xl p-6">
                    <Decor stripe />
                    <p className="relative font-serif text-body-large leading-relaxed text-foreground">
                      Our platform focuses on what matters: transparent
                      information about beans, processing methods, flavor
                      profiles, and brewing recommendations, all in one place.{" "}
                      <Link
                        href="/how-icb-works"
                        className="font-medium text-accent hover:underline"
                      >
                        See how it works.
                      </Link>
                    </p>
                  </div>
                </Stack>
              </Stack>
            </div>

            <div className="md:col-span-12 lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40">
                <Image
                  alt="Roasted Indian coffee beans, close up"
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  src="/images/about/coffee-beans.avif"
                />
              </div>
            </div>
          </div>
        </div>
      </PageShell>

      {/* Core mission: three principles */}
      <Section
        align="center"
        title="Honesty. Discovery."
        accentWord="Community."
        description="We're building a home for Indian coffee lovers, where discovery is easy, information is honest, and every sip feels intentional."
        spacing="default"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <div
              key={item.title}
              className="surface-1 card-hover card-padding rounded-xl"
            >
              <Stack gap="6" className="items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <Icon name={item.icon} size={28} />
                </div>
                <Stack gap="3">
                  <h3 className="text-heading">{item.title}</h3>
                  <p className="text-caption leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Stack>
              </Stack>
            </div>
          ))}
        </div>
      </Section>

      {/* Indian landscape: image + facts */}
      <Section spacing="default">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border/40 bg-card">
              <Image
                alt="Map of the coffee-growing regions of India"
                className="object-contain p-8"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                src="/images/about/indian-coffee-regions.avif"
              />
              <div className="absolute bottom-6 left-6">
                <p className="rounded-full border border-border/40 bg-background/90 px-4 py-1.5 text-micro font-medium uppercase tracking-widest text-muted-foreground">
                  Coffee Growing Regions of India
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Stack gap="6">
              <h2 className="text-title">
                The Indian <Accent>Landscape</Accent>
              </h2>
              <p className="text-body-large text-muted-foreground">
                India&apos;s coffee story is one of remarkable diversity and
                hidden potential.
              </p>

              <div className="flex flex-col">
                {LANDSCAPE.map((item, i) => (
                  <div key={item.title}>
                    {i > 0 && <Rule spacing="tight" />}
                    <p className="text-body">
                      <span className="font-semibold text-foreground">
                        {item.title}.
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {item.content}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <Button
                  asChild
                  variant="link"
                  className="group h-auto p-0 font-semibold text-accent"
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

      {/* For our users: full-width editorial grid with top-rule entries (not a card grid) */}
      <Section
        title="For Our"
        accentWord="Users"
        description="From first French press to a full brewing station, ICB is built for the way you actually find coffee."
        spacing="default"
      >
        <div className="mb-12 overflow-hidden rounded-xl border border-border/40">
          <div className="relative aspect-[16/7] md:aspect-[16/5]">
            <Image
              alt="A home brewing setup on a wooden counter: pour-over dripper, gooseneck kettle, a single-dose bean cellar, and a hand grinder"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 1152px"
              src="/images/station/station-3.jpg"
            />
            {/* Warm coffee-toned wash + fade into the cream ground */}
            <div
              aria-hidden
              className="absolute inset-0 bg-primary/25 mix-blend-multiply"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
            />
          </div>
        </div>

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {AUDIENCES.map((user) => (
            <div
              key={user.title}
              className="flex items-start gap-5 border-t border-border/40 pt-6"
            >
              <span className="mt-1 flex-shrink-0 text-primary">
                <Icon name={user.icon} size={26} />
              </span>
              <Stack gap="2">
                <h3 className="text-heading">{user.title}</h3>
                <p className="text-body text-muted-foreground">
                  {user.description}
                  {user.title === "Self-Researchers" && (
                    <>
                      {" "}
                      <Link
                        href="/how-icb-works"
                        className="font-medium text-accent hover:underline"
                      >
                        Learn more.
                      </Link>
                    </>
                  )}
                </p>
              </Stack>
            </div>
          ))}
        </div>
      </Section>

      {/* About the founder */}
      <Section title="About" accentWord="Me" spacing="default">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Stack gap="8">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/40">
                <Image
                  alt="The founder, brewing coffee"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  src="/images/about/founder.jpg"
                />
              </div>

              <div className="surface-1 rounded-xl p-8">
                <h3 className="mb-6 text-heading">Quick Facts</h3>
                <div className="flex flex-col">
                  {QUICK_FACTS.map((fact, i) => (
                    <div key={fact.label}>
                      {i > 0 && <Rule spacing="tight" />}
                      <div className="flex items-center justify-between">
                        <span className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                          {fact.label}
                        </span>
                        <span className="font-medium text-foreground">
                          {fact.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Stack>
          </div>

          <div className="lg:col-span-8">
            <Prose className="text-foreground">
              <p className="text-body-large font-medium">
                This platform was born from my personal coffee journey, which
                has had a few pivotal moments.
              </p>
              <p className="text-muted-foreground">
                It all began with the comfort of South Indian filter coffee;
                those childhood mornings waking up to its distinctive aroma
                remain some of my fondest memories. Years later in 2012, I spent
                6-7 months in Italy, where I fell under the spell of their
                espresso culture.
              </p>
              <p className="text-muted-foreground">
                But it wasn&apos;t until after the pandemic that my casual
                interest evolved into something deeper. Like many coffee
                journeys, mine started humbly, with instant coffee, and
                gradually expanded to a full brewing station and a growing
                collection of beans.
              </p>
              <p className="text-muted-foreground">
                As a sales and marketing professional by trade, I approached
                this project from the user&apos;s perspective. What would I have
                wanted when I was just starting my specialty coffee journey? The
                answer was simple: a straightforward, comprehensive resource
                focused on Indian coffee, free from marketing noise.
              </p>
              <blockquote>
                <p className="font-serif text-heading text-pretty">
                  A huge shoutout to r/IndianCoffee, which served as my primary
                  source of information as I navigated India&apos;s coffee
                  landscape. This directory is my way of giving back to that
                  community.
                </p>
              </blockquote>
            </Prose>
          </div>
        </div>
      </Section>

      <AboutFAQs />

      {/* Community CTA */}
      <Section spacing="loose">
        <div className="surface-1 relative overflow-hidden rounded-xl p-12 text-center md:p-20">
          <Decor wash />

          <Stack gap="8" className="relative items-center">
            <Stack gap="4" className="items-center">
              <h2 className="text-title text-balance md:text-display">
                Join Our <Accent>Community</Accent>
              </h2>
              <p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
                IndianCoffeeBeans.com is still evolving, but our vision is
                clear: to become the most trusted resource for discovering
                Indian coffee.
              </p>
            </Stack>

            <Cluster gap="4" align="center" className="justify-center">
              {CTA_LINKS.map((link) => (
                <Button
                  asChild
                  key={link.href}
                  variant={link.variant}
                  size="lg"
                  className="px-8"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </Cluster>

            <div className="mx-auto w-full max-w-2xl border-t border-border/40 pt-10">
              <div className="grid grid-cols-1 items-center gap-10 text-left md:grid-cols-2">
                <Stack gap="3">
                  <h3 className="text-heading">Stay in the loop</h3>
                  <p className="text-caption leading-relaxed text-muted-foreground">
                    Get updates on new coffees, roasters, and brewing guides. No
                    spam, just good coffee.
                  </p>
                </Stack>
                <NewsletterForm />
              </div>
            </div>
          </Stack>
        </div>
      </Section>
    </>
  );
}
