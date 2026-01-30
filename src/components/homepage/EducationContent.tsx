// src/components/home/EducationSection.tsx

import Image from "next/image";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "../common/Icon";

function ComingSoonBadge() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 select-none opacity-80 mix-blend-multiply dark:mix-blend-screen md:-right-4 md:-top-4">
      <svg
        viewBox="0 0 140 140"
        className="h-32 w-32 rotate-12 text-muted-foreground duration-500 hover:rotate-45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer text path */}
        <path
          id="textPath-edu"
          d="M70 15 A 55 55 0 1 1 70 125 A 55 55 0 1 1 70 15"
          stroke="transparent"
        />
        <text className="fill-current text-caption font-bold uppercase tracking-[0.25em]">
          <textPath href="#textPath-edu" startOffset="50%" textAnchor="middle">
            • Coming Soon • Coming Soon
          </textPath>
        </text>

        {/* Inner decoration */}
        <circle
          cx="70"
          cy="70"
          r="40"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="opacity-40"
        />
        <circle
          cx="70"
          cy="70"
          r="34"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-20"
        />

        {/* Center icon - Theme Logo */}
        <image
          href="/logo-icon.svg"
          x="40"
          y="40"
          width="60"
          height="60"
          className="opacity-25"
        />
      </svg>
    </div>
  );
}

const educationItems = [
  {
    id: "varieties",
    title: "Bean Varieties",
    description:
      "Learn about India's Arabica and Robusta varieties and what makes them special.",
    icon: "CoffeeBean",
  },
  {
    id: "brewing",
    title: "Brewing Guides",
    description:
      "Master brewing techniques specifically tailored to bring out the best in Indian coffees.",
    icon: "Coffee",
  },
  {
    id: "glossary",
    title: "Coffee Glossary",
    description:
      "Decode coffee terminology with our comprehensive glossary of industry terms.",
    icon: "BookOpen",
  },
];

export default function EducationSection() {
  return (
    <Section spacing="default" contained={false}>
      <div className="surface-0 card-padding overflow-hidden rounded-2xl">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column: Content - first on mobile, left on desktop */}
            <div className="order-1 lg:order-1">
              <Stack gap="8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-8 relative">
                    <ComingSoonBadge />
                    <Stack gap="6">
                      <div className="inline-flex items-center gap-4">
                        <span className="h-px w-8 md:w-12 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Knowledge Base
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                        Unlock the World of{" "}
                        <span className="text-accent italic">
                          Indian Coffee.
                        </span>
                      </h2>
                      <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                        Dive into India&apos;s rich coffee heritage, from
                        cultivation techniques in the Western Ghats to
                        traditional brewing methods that enhance the unique
                        flavors of Indian beans.
                      </p>
                    </Stack>
                  </div>
                  <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
                    <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                      <span className="h-1 w-1 rounded-full bg-accent/40" />
                      Heritage & Craft
                      <span className="h-1 w-1 rounded-full bg-accent/40" />
                    </div>
                  </div>
                </div>

                <Stack gap="4">
                  {educationItems.map((item, index) => (
                    <div
                      className={`surface-1 card-padding card-hover group animate-fade-in-scale rounded-lg delay-${index * 100}`}
                      key={item.id}
                    >
                      <div className="flex items-start">
                        <div className="mr-4 h-12 w-12 flex-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                          <Icon
                            className="text-primary"
                            name={item.icon as IconName}
                            size={20}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-2 text-heading transition-colors duration-200 group-hover:text-accent">
                            {item.title}
                          </h3>
                          <p className="text-caption">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Stack>

                <Button
                  disabled
                  className="opacity-50 cursor-not-allowed pointer-events-none"
                  size="lg"
                  variant="default"
                >
                  Explore Educational Content
                  <Icon className="ml-2" name="ArrowRight" size={16} />
                </Button>
              </Stack>
            </div>

            {/* Right Column: Image with floating fact card - second on mobile, right on desktop */}
            <div className="relative order-2 lg:order-2">
              <div className="relative mx-auto aspect-square max-w-[500px]">
                {/* Main Image */}
                <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    alt="Open coffee education journal on wooden café table"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    height={500}
                    priority
                    src="/images/home/open-book-cafe.png"
                    width={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating "Did You Know" Card */}
                <div className="-top-4 -right-4 absolute z-20 hidden max-w-xs animate-float rounded-2xl lg:block">
                  <div className="surface-1 card-padding shadow-xl rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 flex-center flex-shrink-0 rounded-full border border-accent/30 bg-accent/20">
                        <Icon className="text-accent" name="Coffee" size={16} />
                      </div>
                      <div>
                        <h4 className="mb-1 font-medium text-accent-foreground text-caption">
                          Did You Know?
                        </h4>
                        <p className="text-muted-foreground text-overline leading-relaxed">
                          India&apos;s famed Monsooned Malabar coffee gets its
                          unique flavor from monsoon winds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute bottom-6 left-6 h-16 w-16 animate-pulse rounded-full bg-primary/10 blur-xl" />
                <div className="absolute top-1/3 right-8 h-12 w-12 animate-float rounded-full bg-accent/10 blur-lg delay-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
