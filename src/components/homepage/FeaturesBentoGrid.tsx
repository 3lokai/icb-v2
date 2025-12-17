// src/components/home/FeaturesBentoGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { Icon, IconName } from "@/components/common/Icon";
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
    <div className="absolute inset-0 overflow-hidden">
      <Marquee
        className="absolute top-4 right-4 z-0 [--duration:25s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
        pauseOnHover
        vertical
      >
        {indianRegions.map((region) => (
          <div
            className={cn(
              "relative mx-3 w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-primary/20 bg-primary/5 hover:bg-primary/10",
              "transform-gpu blur-[0.5px] transition-all duration-300 ease-out hover:blur-none",
              "glass-card"
            )}
            key={region.name}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary/70" name="MapPin" />
              <div className="font-semibold text-primary/80 text-sm">
                {region.name}
              </div>
            </div>
            <div className="text-muted-foreground/70 text-xs">
              {region.state}
            </div>
            <div className="mt-1 font-medium text-accent/60 text-xs">
              {region.altitude}
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
  }, []);

  return (
    <div className="absolute top-4 right-4 z-0">
      <div className="glass-card min-w-[140px] animate-fade-in-scale p-3 text-center">
        <Icon className="mx-auto mb-1 h-5 w-5 text-accent" name="Trophy" />
        <div className="mb-1 font-medium text-foreground text-xs">
          {experts[currentExpert].name}
        </div>
        <div className="mb-1 text-accent text-xs">
          {experts[currentExpert].year && `${experts[currentExpert].year} • `}
          {experts[currentExpert].method}
        </div>
        <div className="text-muted-foreground text-xs opacity-80">
          {experts[currentExpert].achievement}
        </div>
      </div>
    </div>
  );
};

const FloatingSteps = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {[
      {
        time: "0:00",
        text: "Bloom",
        detail: "60ml",
        delay: "0s",
        position: { top: "15%", right: "10%" },
      },
      {
        time: "0:45",
        text: "Pour 1",
        detail: "240ml",
        delay: "0.5s",
        position: { top: "15%", right: "25%" },
      },
      {
        time: "2:30",
        text: "Drawdown",
        detail: "V60",
        delay: "2s",
        position: { top: "55%", right: "5%" },
      },
      {
        time: "3:30",
        text: "Complete",
        detail: "500ml",
        delay: "2.5s",
        position: { top: "45%", right: "35%" },
      },
      {
        time: "1:20",
        text: "Press",
        detail: "AeroPress",
        delay: "3s",
        position: { top: "10%", right: "40%" },
      },
      {
        time: "4:00",
        text: "Steep",
        detail: "French Press",
        delay: "3.5s",
        position: { top: "65%", right: "20%" },
      },
    ].map((step, i) => (
      <div
        className="glass-card absolute animate-float p-2 text-xs opacity-50 transition-opacity hover:opacity-80"
        key={step.time}
        style={{
          top: step.position.top,
          right: step.position.right,
          animationDelay: step.delay,
          animationDuration: `${3 + i * 0.2}s`,
        }}
      >
        <div className="font-medium text-primary">{step.time}</div>
        <div className="font-medium text-foreground text-xs">{step.text}</div>
        <div className="text-muted-foreground text-xs">{step.detail}</div>
      </div>
    ))}
  </div>
);

const CoffeeProfileShowcase = () => {
  const profileFeatures = [
    {
      icon: "Camera" as IconName,
      title: "Coffee Station Photos",
      description: "Showcase your setup",
      color: "text-primary",
    },
    {
      icon: "ListChecks" as IconName,
      title: "Equipment Collection",
      description: "Grinders, brewers, scales",
      color: "text-accent",
    },
    {
      icon: "Heart" as IconName,
      title: "Coffee Wishlist",
      description: "Beans you want to try",
      color: "text-chart-1",
    },
    {
      icon: "Star" as IconName,
      title: "Top Recommendations",
      description: "Your favorite picks",
      color: "text-chart-2",
    },
    {
      icon: "ChartBar" as IconName,
      title: "Brewing Stats",
      description: "Methods & preferences",
      color: "text-chart-3",
    },
    {
      icon: "Trophy" as IconName,
      title: "Achievement Badges",
      description: "Coffee milestones",
      color: "text-chart-4",
    },
  ];

  return (
    <AnimatedList
      className="absolute top-4 right-2 h-[300px] w-full max-w-[280px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105"
      delay={1200}
    >
      {profileFeatures.map((feature) => (
        <div
          className="glass-card mx-auto w-full max-w-[250px] p-3 transition-all duration-300 hover:scale-[1.02]"
          key={feature.title}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={`h-4 w-4 ${feature.color} flex-shrink-0`}
              name={feature.icon}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground text-xs">
                {feature.title}
              </div>
              <div className="truncate text-muted-foreground text-xs">
                {feature.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </AnimatedList>
  );
};

const SimpleFloatingRatings = () => {
  const ratings = [4.5, 3.8, 4.9];

  return (
    <>
      {ratings.map((rating, i) => (
        <div
          className="glass-card absolute animate-float p-2 opacity-30"
          key={rating}
          style={{
            animationDelay: `${i * 1.5}s`,
            top: `${20 + i * 20}%`,
            right: `${10 + i * 15}%`,
          }}
        >
          <div className="flex items-center gap-1">
            <Icon className="h-3 w-3 fill-current text-chart-1" name="Star" />
            <span className="font-medium text-xs">{rating}</span>
          </div>
        </div>
      ))}
    </>
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
      <>
        <ExpertShowcase />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
      </>
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
    <section className={"mb-20 bg-muted/30 py-16"}>
      <div className="container-default">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-heading text-primary">
            Discover. Brew. Perfect.
          </h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto max-w-2xl text-body text-muted-foreground">
            From precision brewing tools to community reviews, everything you
            need to elevate your coffee experience.
          </p>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="mx-auto max-w-6xl">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
