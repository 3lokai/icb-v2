// src/components/home/FeaturesBentoGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { Icon, IconName } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";
import { AnimatedList } from "../ui/animated-list";
import { Marquee } from "../ui/marquee";

// Regional Discovery Background - Marquee of Indian coffee regions
const RegionalDiscoveryBackground = () => {
  const indianRegions = [
    { name: "Grey Soul", altitude: "", state: "Maharashtra" },
    { name: "Blue Tokai", altitude: "1000-1600m", state: "Karnataka" },
    { name: "GB Roasters", altitude: "700-2100m", state: "Kerala" },
    { name: "Araku Coffee", altitude: "1000-2600m", state: "Tamil Nadu" },
    { name: "", altitude: "900-1400m", state: "Andhra Pradesh" },
    { name: "Bababudan", altitude: "1500m+", state: "Karnataka" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Marquee
        className="absolute top-4 right-4 z-0 [--duration:35s] [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]"
        pauseOnHover
        vertical
      >
        {indianRegions.map((region) => (
          <div
            className={cn(
              "relative mx-3 w-32 overflow-hidden rounded-xl p-3",
              "border border-border/40 bg-card/50 backdrop-blur-[2px]",
              "transform-gpu transition-all duration-300 ease-out",
              "group-hover:border-accent/20"
            )}
            key={region.name}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-accent/60" name="MapPin" />
              <div className="font-semibold text-foreground text-overline uppercase tracking-wider">
                {region.name}
              </div>
            </div>
            <div className="text-muted-foreground text-overline uppercase tracking-widest">
              {region.state}
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

const ExpertShowcase = () => {
  const [currentExpert, setCurrentExpert] = useState(0);
  const experts = [
    {
      name: "James Hoffmann",
      year: "2007",
      achievement: "World Barista Champion",
      method: "V60",
    },
    {
      name: "Tetsu Kasuya",
      year: "2016",
      achievement: "World Brewers Cup",
      method: "4:6 Method",
    },
    {
      name: "Carolina Garay",
      year: "2018",
      achievement: "AeroPress Champion",
      method: "Inverted",
    },
    {
      name: "George Stanica",
      year: "2024",
      achievement: "AeroPress Champion",
      method: "Bypass",
    },
    {
      name: "Scott Rao",
      year: "",
      achievement: "Industry Expert",
      method: "Uniform Extraction",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExpert((prev) => (prev + 1) % experts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [experts.length]);

  return (
    <div className="absolute top-6 right-6 z-0 pointer-events-none">
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-background/60 p-3 text-center shadow-sm backdrop-blur-[2px] transition-all duration-500 group-hover:border-accent/30 group-hover:bg-background/80">
        <Icon
          className="mx-auto mb-1.5 h-3.5 w-3.5 text-accent/40"
          name="Trophy"
        />
        <div className="mb-0.5 font-serif text-body text-foreground tracking-tight leading-tight">
          {experts[currentExpert].name}
        </div>
        <div className="mb-1 text-accent text-overline uppercase tracking-[0.2em] font-bold">
          {experts[currentExpert].method}
        </div>
        <div className="text-muted-foreground text-micro italic leading-tight">
          {experts[currentExpert].achievement}
        </div>
      </div>
    </div>
  );
};

const FloatingSteps = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {[
      {
        time: "0:00",
        text: "Bloom",
        delay: "0s",
        position: { top: "15%", right: "12%" },
      },
      {
        time: "0:45",
        text: "Extraction",
        delay: "1s",
        position: { top: "35%", right: "28%" },
      },
      {
        time: "3:30",
        text: "Enjoy",
        delay: "2s",
        position: { top: "55%", right: "8%" },
      },
    ].map((step, i) => (
      <div
        className="absolute animate-float rounded-lg border border-border/40 bg-background/40 p-3 shadow-sm backdrop-blur-[2px] opacity-40 transition-all duration-500 group-hover:opacity-100"
        key={step.time}
        style={{
          top: step.position.top,
          right: step.position.right,
          animationDelay: step.delay,
          animationDuration: `${4 + i * 0.5}s`,
        }}
      >
        <div className="text-overline font-bold text-accent/60 uppercase tracking-widest">
          {step.time}
        </div>
        <div className="font-medium text-foreground text-caption">
          {step.text}
        </div>
      </div>
    ))}
  </div>
);

const CoffeeProfileShowcase = () => {
  const profileFeatures = [
    {
      icon: "Camera" as IconName,
      title: "Station Photos",
      color: "text-primary",
    },
    {
      icon: "ListChecks" as IconName,
      title: "Equipment Collection",
      color: "text-primary",
    },
    {
      icon: "Heart" as IconName,
      title: "Coffee Wishlist",
      color: "text-accent",
    },
    {
      icon: "Star" as IconName,
      title: "Top Recommendations",
      color: "text-accent",
    },
  ];

  return (
    <div className="absolute top-4 right-4 h-[280px] w-full max-w-[240px] pointer-events-none [mask-image:linear-gradient(to_bottom,white_40%,transparent)]">
      <AnimatedList delay={1500} maxItems={3}>
        {profileFeatures.map((feature) => (
          <div
            className="mb-3 rounded-xl border border-border/40 bg-background/40 p-3 shadow-sm backdrop-blur-[2px] transition-all duration-500 group-hover:bg-background/60"
            key={feature.title}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`h-4 w-4 ${feature.color}`}
                name={feature.icon}
              />
              <div className="text-caption font-medium tracking-tight text-foreground">
                {feature.title}
              </div>
            </div>
          </div>
        ))}
      </AnimatedList>
    </div>
  );
};

const SimpleFloatingRatings = () => {
  const ratings = [4.8, 4.2, 4.9];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ratings.map((rating, i) => (
        <div
          className="absolute animate-float rounded-full border border-border/40 bg-background/60 px-3 py-1.5 shadow-sm backdrop-blur-[2px] opacity-40 transition-all duration-500 group-hover:opacity-100"
          key={rating}
          style={{
            animationDelay: `${i * 1.5}s`,
            top: `${20 + i * 20}%`,
            right: `${15 + i * 12}%`,
            animationDuration: `${5 + i}s`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <Icon className="h-3 w-3 fill-accent text-accent" name="Star" />
            <span className="text-overline font-bold tabular-nums">
              {rating}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const features = [
  {
    Icon: () => <Icon color="accent" name="Star" size={48} />,
    name: "Rate & Review Coffees",
    description:
      "Share your coffee experiences with our community. Rate coffees from Indian roasters and help fellow enthusiasts discover their next perfect cup.",
    href: "/coffees",
    cta: "Start Rating",
    className: "col-span-3 lg:col-span-2",
    background: (
      <>
        <SimpleFloatingRatings />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
      </>
    ),
  },
  {
    Icon: () => <Icon color="primary" name="MapPin" size={48} />,
    name: "Regional Discovery",
    description:
      "Explore India's diverse terroir, from Coorg's rain-washed beans to Nilgiris' high-altitude specialties. (Estate-level visibility coming soon.)",
    href: "/regions",
    cta: "Discover Regions",
    className: "col-span-3 lg:col-span-1",
    background: (
      <>
        <RegionalDiscoveryBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
      </>
    ),
  },
  {
    Icon: () => <Icon color="accent" name="Trophy" size={48} />,
    name: "Expert Recipes",
    description:
      "Learn from world champions like James Hoffmann and Tetsu Kasuya. Master techniques that win competitions.",
    href: "/tools/expert-recipes",
    cta: "Explore Recipes",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0">
        <ExpertShowcase />
        {/* Subtle blur overlay for content legibility */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-background/60 via-background/20 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_30%,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
      </div>
    ),
  },
  {
    Icon: () => <Icon color="primary" name="Calculator" size={48} />,
    name: "Coffee Calculator",
    description:
      "Perfect your brew with precise ratios for 13+ brewing methods. Includes timer and temperature guidance.",
    href: "/tools/coffee-calculator",
    cta: "Get Started",
    className: "col-span-3 lg:col-span-2",
    background: (
      <>
        <FloatingSteps />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      </>
    ),
  },
  {
    Icon: () => <Icon color="muted" name="UserCircle" size={48} />,
    name: "Personal Coffee Profiles",
    description:
      "Coming soon: Create shareable public profiles, showcase your coffee expertise, and connect with fellow enthusiasts in the community.",
    href: "/dashboard",
    cta: "Coming Soon",
    className: "col-span-3 lg:col-span-3",
    background: (
      <>
        <CoffeeProfileShowcase />
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-muted/5 opacity-50" />
      </>
    ),
  },
];

export default function FeaturesBentoGrid() {
  return (
    <Section spacing="default">
      <Stack gap="12">
        {/* Section Header - Editorial Style */}
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="6">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 md:w-12 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    The Ecosystem
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Discover. Brew.{" "}
                  <span className="text-accent italic">Perfect.</span>
                </h2>
                <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                  From precision brewing tools to community-verified data,
                  everything you need to navigate India&apos;s specialty coffee
                  landscape.
                </p>
              </Stack>
            </div>
            <div className="md:col-span-4 flex md:justify-end pb-2">
              <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                <span className="h-1 w-1 rounded-full bg-accent/40" />
                Community Driven
                <span className="h-1 w-1 rounded-full bg-accent/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="mx-auto max-w-6xl">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </Stack>
    </Section>
  );
}
