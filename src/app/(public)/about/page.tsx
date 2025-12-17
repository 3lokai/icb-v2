// src/app/(public)/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, IconName } from "@/components/common/Icon";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import StructuredData from "@/components/seo/StructuredData";
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
      <div>
        {/* Hero Header - Glass effect for impact */}
        <header className="relative mb-16 text-center">
          <div className="glass-overlay -z-10 absolute inset-0 rounded-3xl" />
          <div className="relative z-10 py-12">
            <h1 className="mb-6 animate-fade-in-scale text-display text-primary">
              About IndianCoffeeBeans.com
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              India&apos;s first comprehensive, independent directory for
              specialty coffee
            </p>
          </div>
        </header>

        {/* The Platform Section - Clean, minimal approach */}
        <section className="mb-20">
          <div className="overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm">
            <div className="card-padding flex flex-col items-center gap-8 lg:flex-row">
              <div className="space-y-6 lg:w-1/2">
                <div className="text-left">
                  <h2 className="mb-4 text-primary text-title">The Platform</h2>
                  <div className="mb-6 h-1 w-16 rounded-full bg-accent" />
                </div>

                <div className="space-y-4 text-body">
                  <p className="text-foreground">
                    IndianCoffeeBeans.com is India&apos;s first comprehensive,
                    independent directory for specialty coffee roasters and
                    their offerings. We&apos;re building a user-first,
                    research-friendly resource that helps home brewers discover,
                    compare, and enjoy the rapidly growing Indian specialty
                    coffee scene.
                  </p>
                  <p className="text-foreground">
                    In a country with over 300,000 coffee growers and a legacy
                    dating back to the 17th century, finding your perfect Indian
                    coffee shouldn&apos;t require endless scrolling through
                    social media or relying on which brands have the biggest
                    marketing budgets.
                  </p>
                  <div className="rounded-lg border border-accent/20 border-l-4 border-l-accent bg-accent/10 p-4">
                    <p className="font-medium text-accent-foreground">
                      Our platform focuses on what matters: transparent
                      information about beans, processing methods, flavor
                      profiles, and brewing recommendations - all in one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative lg:w-1/2">
                <div className="group relative h-80 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/30 transition-all duration-500 group-hover:from-primary/30 group-hover:to-accent/40" />
                  <Image
                    alt="Indian coffee beans"
                    className="img-responsive transition-transform duration-500 group-hover:scale-105"
                    fill
                    priority
                    src="/images/about/coffee-beans.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section - KEY section gets full glass treatment */}
        <section className="mb-20">
          <div className="glass-modal card-padding relative overflow-hidden rounded-3xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-primary text-title">Our Mission</h2>
                <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
                <p className="mx-auto mb-8 max-w-3xl text-body text-muted-foreground">
                  We&apos;re building a home for Indian coffee lovers — where
                  discovery is easy, information is honest, and every sip feels
                  intentional.
                </p>
              </div>

              <div className="grid-cards">
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
                    className="card-padding card-hover group rounded-lg border border-border/30 bg-card/40"
                    key={item.title}
                  >
                    <div className="flex-center flex-col space-y-4 text-center">
                      <div className="glass-button h-16 w-16 flex-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                        <Icon
                          color="primary"
                          name={item.icon as IconName}
                          size={28}
                        />
                      </div>
                      <div>
                        <h3 className="mb-3 text-heading text-primary">
                          {item.title}
                        </h3>
                        <p className="text-caption leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Indian Coffee Landscape - Clean approach, let content breathe */}
        <section className="mb-20">
          <div className="mb-8 text-left">
            <h2 className="mb-4 text-primary text-title">
              The Indian Coffee Landscape
            </h2>
            <div className="mb-6 h-1 w-16 rounded-full bg-accent" />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
              <div className="group relative h-96 overflow-hidden rounded-xl border border-border/30">
                <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-t from-background/80 via-transparent to-background/20" />
                <Image
                  alt="Map of Indian coffee regions"
                  className="img-responsive transition-transform duration-500 group-hover:scale-105"
                  fill
                  src="/images/about/indian-coffee-regions.png"
                />
                <div className="absolute bottom-4 left-4 z-20 text-foreground">
                  <p className="rounded-full bg-background/80 px-3 py-1 font-medium text-sm backdrop-blur-sm border border-border/30">
                    Coffee Growing Regions of India
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 space-y-6 lg:order-2">
              <p className="text-body">
                India&apos;s coffee story is one of remarkable diversity and
                hidden potential:
              </p>

              <div className="space-y-4">
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
                    className="rounded-lg border border-border/20 bg-muted/30 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-muted/40"
                    key={item.title}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                      <div>
                        <span className="font-medium text-primary">
                          {item.title}:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {item.content}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  className="group inline-flex items-center font-medium text-accent transition-colors duration-200 hover:text-accent-foreground"
                  href="/regions"
                >
                  Explore Indian Coffee Regions
                  <Icon
                    className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                    name="ArrowRight"
                    size={16}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Our Users - Clean cards with subtle interactions */}
        <section className="mb-20">
          <div className="mb-8 text-left">
            <h2 className="mb-4 text-primary text-title">For Our Users</h2>
            <div className="mb-6 h-1 w-16 rounded-full bg-accent" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                className="group rounded-lg border border-border/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-lg"
                key={user.title}
              >
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 flex-center flex-shrink-0 rounded-xl border border-accent/20 bg-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                    <Icon
                      color="accent"
                      name={user.icon as IconName}
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-heading text-primary transition-colors duration-200 group-hover:text-accent">
                      {user.title}
                    </h3>
                    <p className="text-caption leading-relaxed">
                      {user.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Me - Personal, warm approach without heavy glass */}
        <section className="mb-20">
          <div className="mb-8 text-left">
            <h2 className="mb-4 text-primary text-title">About Me</h2>
            <div className="mb-6 h-1 w-16 rounded-full bg-accent" />
          </div>

          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="space-y-6 lg:w-1/3">
              <div className="group relative h-64 w-full overflow-hidden rounded-xl border border-border/30">
                <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-t from-background/70 to-transparent" />
                <Image
                  alt="Founder brewing coffee"
                  className="img-responsive transition-transform duration-500 group-hover:scale-105"
                  fill
                  src="/images/about/founder.jpg"
                />
              </div>

              <div className="rounded-lg border border-border/20 bg-muted/30 p-4 backdrop-blur-sm">
                <h3 className="mb-4 text-heading text-primary">Quick Facts</h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Favorite Brew Method",
                      value: "Inverted AeroPress",
                    },
                    { label: "Preferred Roast", value: "Dark" },
                    { label: "Coffee Epiphany", value: "Italy, 2012" },
                  ].map((fact) => (
                    <div
                      className="flex items-center justify-between border-border/30 border-b py-2 last:border-0"
                      key={fact.label}
                    >
                      <span className="font-medium text-sm">{fact.label}:</span>
                      <span className="text-accent text-sm">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-body lg:w-2/3">
              <p className="text-foreground">
                This platform was born from my personal coffee journey, which
                has had a few pivotal moments:
              </p>
              <p className="text-foreground">
                It all began with the comfort of South Indian filter coffee -
                those childhood mornings waking up to its distinctive aroma
                remain some of my fondest memories. Years later in 2012, I spent
                6-7 months in Italy, where I fell under the spell of their
                espresso culture.
              </p>
              <p className="text-foreground">
                But it wasn&apos;t until after the pandemic that my casual
                interest evolved into something deeper. Like many coffee
                journeys, mine started humbly – with instant coffee – and
                gradually expanded to a full brewing station and a growing
                collection of beans.
              </p>
              <p className="text-foreground">
                As a sales and marketing professional by trade, I approached
                this project from the user&apos;s perspective. What would I have
                wanted when I was just starting my specialty coffee journey? The
                answer was simple: a straightforward, comprehensive resource
                focused on Indian coffee, free from marketing noise.
              </p>
              <div className="rounded-lg border border-accent/20 border-l-4 border-l-accent bg-accent/10 p-4">
                <p className="text-body italic">
                  A huge shoutout to r/IndianCoffee which served as my primary
                  source of information as I navigated India&apos;s coffee
                  landscape. This directory is my way of giving back to that
                  community.
                </p>
              </div>
              <p className="text-caption text-muted-foreground italic">
                [More community shoutouts to be added]
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section - Strong glass effect for conversion focus */}
        <section className="mb-16">
          <div className="glass-modal card-padding relative overflow-hidden rounded-3xl text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />

            <div className="relative z-10">
              <h2 className="mb-4 text-primary text-title">
                Join Our Community
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />

              <p className="mx-auto mb-8 max-w-3xl text-body">
                IndianCoffeeBeans.com is still evolving, but our vision is
                clear: to become the most trusted resource for discovering
                Indian coffee. We invite you to:
              </p>

              <div className="mb-8 flex flex-wrap justify-center gap-4">
                {[
                  { label: "Discover Coffees", href: "/coffees" },
                  { label: "Meet Roasters", href: "/roasters" },
                  { label: "Expand Knowledge", href: "/learn" },
                  { label: "Get In Touch", href: "/contact" },
                ].map((link) => (
                  <Link
                    className="btn-primary hover-lift"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="card-padding mx-auto max-w-md rounded-lg border border-border/30 bg-card/40">
                <p className="mb-6 text-body font-medium text-muted-foreground italic">
                  Together, we&apos;re building something special for
                  India&apos;s coffee community — one bean at a time.
                </p>

                <div>
                  <h3 className="mb-2 text-heading">Stay in the loop</h3>
                  <p className="mb-4 text-caption">
                    Get updates on new coffees, roaster launches, and brewing
                    guides.
                  </p>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
