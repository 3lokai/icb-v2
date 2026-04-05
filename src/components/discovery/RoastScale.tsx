"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { discoveryPagePath } from "@/lib/discovery/landing-pages";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

const STEPS = [
  { slug: "light-roast", label: "Light" },
  { slug: "light-medium-roast", label: "Light–Med" },
  { slug: "medium-roast", label: "Medium" },
  { slug: "medium-dark-roast", label: "Med–Dark" },
  { slug: "dark-roast", label: "Dark" },
] as const;

type RoastScaleProps = {
  currentRoastSlug: string;
  className?: string;
};

export function RoastScale({ currentRoastSlug, className }: RoastScaleProps) {
  const activeIndex = STEPS.findIndex((s) => s.slug === currentRoastSlug);
  const prefersReducedMotion = useReducedMotion();
  const reduce = Boolean(prefersReducedMotion);

  const stepTransition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 28 };

  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Roast range"
        title="Where you are on the *scale*"
        description="Each level links to a full guide for that roast."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            5 levels
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div
          className={cn(
            "surface-1 relative overflow-hidden rounded-3xl border border-border/60 p-8 shadow-sm md:p-12",
            "transition-colors duration-500 hover:border-border"
          )}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col items-stretch md:flex-row md:items-center md:justify-between md:gap-2">
            {STEPS.map((step, i) => {
              const isActive = step.slug === currentRoastSlug;

              return (
                <Fragment key={step.slug}>
                  <div className="relative flex w-full flex-col items-center md:flex-1">
                    {isActive && (
                      <>
                        {reduce ? (
                          <div
                            className="absolute -inset-4 -z-0 hidden rounded-[2rem] bg-accent/5 md:block"
                            aria-hidden
                          />
                        ) : (
                          <motion.div
                            layoutId="roast-scale-active-bg"
                            className="absolute -inset-4 -z-0 hidden rounded-[2rem] bg-accent/5 md:block"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={stepTransition}
                            aria-hidden
                          />
                        )}
                      </>
                    )}

                    <Link
                      href={discoveryPagePath(step.slug)}
                      className={cn(
                        "group relative z-10 flex flex-col items-center rounded-2xl text-center outline-none transition-colors",
                        "focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <motion.div
                        className={cn(
                          "mb-4 flex h-32 w-32 cursor-pointer items-center justify-center rounded-2xl border-2 transition-colors duration-300",
                          isActive
                            ? "border-accent bg-background shadow-lg shadow-foreground/5"
                            : "border-transparent bg-transparent hover:border-border/80"
                        )}
                        animate={
                          reduce
                            ? undefined
                            : {
                                scale: isActive ? 1.06 : 1,
                              }
                        }
                        whileHover={
                          reduce ? undefined : { scale: isActive ? 1.06 : 1.04 }
                        }
                        transition={stepTransition}
                      >
                        <motion.div
                          className="relative flex h-24 w-24 items-center justify-center"
                          animate={
                            reduce
                              ? undefined
                              : {
                                  rotate: isActive ? 6 : 0,
                                }
                          }
                          transition={stepTransition}
                        >
                          <Image
                            src={`/images/discovery/roasts/${step.slug.replace("-roast", "")}.png`}
                            alt=""
                            aria-hidden
                            width={88}
                            height={88}
                            className={cn(
                              "object-contain pointer-events-none transition-opacity duration-300",
                              isActive
                                ? "opacity-100 drop-shadow-md"
                                : "opacity-[0.72] group-hover:opacity-90"
                            )}
                          />
                        </motion.div>
                      </motion.div>

                      <span
                        className={cn(
                          "text-caption font-bold transition-colors duration-300",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </Link>

                    {i < STEPS.length - 1 ? (
                      <div
                        className="my-4 h-12 w-0.5 shrink-0 bg-border/40 md:hidden"
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  {i < STEPS.length - 1 ? (
                    <div
                      className={cn(
                        "hidden h-0.5 flex-1 self-center rounded-full md:-mt-10 md:block",
                        "min-w-[0.5rem] max-w-none",
                        activeIndex >= 0 && i < activeIndex
                          ? "bg-gradient-to-r from-accent/60 to-accent/40"
                          : activeIndex >= 0 && i === activeIndex
                            ? "bg-gradient-to-r from-accent/50 to-border/40"
                            : "bg-border/40"
                      )}
                      aria-hidden
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
