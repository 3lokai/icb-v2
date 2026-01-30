// src/components/homepage/HowItWorksSection.tsx

import { Icon, IconName } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";

const steps = [
  {
    icon: "Coffee" as IconName,
    title: "Brew",
    description:
      "You make coffee your way — at home, at work, with the gear you own.",
  },
  {
    icon: "Star" as IconName,
    title: "Rate",
    description:
      "Rate how the coffee tasted to you. Quick ratings — no long reviews required.",
  },
  {
    icon: "Brain" as IconName,
    title: "Build Your Coffee Profile",
    description:
      "Your coffees, brews, and setup come together in one place — a record of how you drink coffee.",
  },
];

export default function HowItWorksSection() {
  return (
    <Section spacing="default">
      <div className="mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          {/* Left Column: Header */}
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  HOW ICB WORKS
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                Brew. Rate. Build Your{" "}
                <span className="text-accent italic">Coffee Profile.</span>
              </h2>
              <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                Track coffees you brew, rate how they taste to you, and build a
                coffee profile that reflects your brews, gear, and preferences
                over time.
              </p>
            </Stack>
          </div>

          {/* Right Column: Explainer */}
          <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
            <p className="max-w-xs text-pretty text-body text-muted-foreground/80 leading-relaxed">
              Your coffee profile grows as you rate coffees and add context —
              from the beans you enjoy to the gear you brew with. It&apos;s a
              personal record, not a leaderboard.
            </p>
          </div>
        </div>

        {/* Three Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="surface-1 card-padding card-hover group animate-fade-in-scale rounded-lg"
            >
              <div className="flex flex-col">
                <div className="mb-4 h-12 w-12 flex-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                  <Icon className="text-primary" name={step.icon} size={24} />
                </div>
                <h3 className="mb-2 text-heading transition-colors duration-200 group-hover:text-accent">
                  {step.title}
                </h3>
                <p className="text-caption text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
