// src/components/homepage/HowItWorksSection.tsx
"use client";

import { Icon, IconName } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type StepColor = "primary" | "accent";

const steps: {
  icon: IconName;
  title: string;
  description: string;
  color: StepColor;
}[] = [
  {
    icon: "Coffee",
    title: "Brew",
    description:
      "Make coffee your way — at home, at work, with the gear you own.",
    color: "primary",
  },
  {
    icon: "Star",
    title: "Rate",
    description: "Rate how it tasted. Quick ratings, no long reviews required.",
    color: "accent",
  },
  {
    icon: "Brain",
    title: "Build Your Coffee Profile",
    description:
      "Your coffees, brews, and setup in one place — a personal record of how you drink coffee.",
    color: "primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
      delay: 0.5,
    },
  },
};

export default function HowItWorksSection() {
  return (
    <Section spacing="default">
      <div className="mx-auto max-w-6xl w-full">
        <Stack gap="12">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-4"
                >
                  <span className="h-px w-8 md:w-12 bg-primary/70" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                    How ICB Works
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-title text-balance leading-[1.1] tracking-tight"
                >
                  Brew. Rate. Build Your{" "}
                  <span className="text-accent italic font-serif">
                    Coffee Profile.
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed font-light"
                >
                  Track what you brew, rate how it tastes, and build a coffee
                  profile that grows with every cup.
                </motion.p>
              </Stack>
            </div>

            <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="max-w-xs text-pretty text-body text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4"
              >
                Your profile grows as you rate coffees and add context — a
                personal record, not a leaderboard.
              </motion.p>
            </div>
          </div>

          {/* Animated Steps Section */}
          <div className="relative">
            {/* Desktop Connecting Lines */}
            <div className="absolute top-12 left-[15%] right-[15%] hidden md:block pointer-events-none">
              <svg className="w-full h-8" viewBox="0 0 800 32" fill="none">
                <motion.path
                  d="M0 16C100 16 100 16 200 16C300 16 300 16 400 16C500 16 500 16 600 16C700 16 700 16 800 16"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="text-border"
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </svg>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Icon Container with Floating Effect */}
                    <div className="relative mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={cn(
                          "h-24 w-24 flex-center rounded-2xl bg-card border border-border shadow-soft transition-all duration-500",
                          step.color === "accent"
                            ? "group-hover:shadow-glow group-hover:border-accent/40"
                            : "group-hover:border-primary/40"
                        )}
                      >
                        <div
                          className={cn(
                            "h-16 w-16 flex-center rounded-xl transition-colors duration-500",
                            step.color === "accent"
                              ? "bg-accent/5 text-accent group-hover:bg-accent/10"
                              : "bg-primary/5 text-primary group-hover:bg-primary/10"
                          )}
                        >
                          <Icon name={step.icon} size={32} color={step.color} />
                        </div>
                      </motion.div>

                      {/* Step Number Badge */}
                      <div
                        className={cn(
                          "absolute -top-3 -right-3 h-8 w-8 flex-center rounded-full text-caption font-bold shadow-sm",
                          step.color === "accent"
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <h3
                      className={cn(
                        "mb-4 text-heading-small tracking-tight transition-colors duration-300",
                        step.color === "accent"
                          ? "group-hover:text-accent"
                          : "group-hover:text-primary"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-body text-muted-foreground leading-relaxed max-w-[280px]">
                      {step.description}
                    </p>
                  </div>

                  {/* Mobile Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center py-6">
                      <div className="w-px h-12 bg-gradient-to-b from-border to-transparent dashed" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Stack>
      </div>

      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 20px -5px var(--accent);
        }
        .dashed {
          background-image: linear-gradient(
            to bottom,
            var(--border) 50%,
            transparent 50%
          );
          background-size: 1px 8px;
          background-repeat: repeat-y;
        }
      `}</style>
    </Section>
  );
}
