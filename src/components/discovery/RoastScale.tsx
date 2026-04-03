import Link from "next/link";
import Image from "next/image";
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

  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-6"
        overline="Roast range"
        title="Where you are on the *scale*"
        description="Tap a step to compare roast levels—each link opens that discovery page."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            5 levels
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="surface-1 relative overflow-hidden rounded-2xl card-padding card-hover">
          {/* Decorative background blurs */}
          <div className="absolute top-0 left-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />

          <div className="relative z-10 flex flex-wrap items-center gap-2 md:gap-0 md:justify-between">
            {STEPS.map((step, i) => {
              const isActive = step.slug === currentRoastSlug;
              const isPast = activeIndex >= 0 && i < activeIndex;
              return (
                <div key={step.slug} className="flex items-center md:flex-1">
                  <Link
                    href={discoveryPagePath(step.slug)}
                    className={cn(
                      "group flex flex-col items-center text-center min-w-[4.5rem]",
                      isActive && "font-semibold"
                    )}
                  >
                    <div
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500",
                        "group-hover:scale-110 group-hover:rotate-12",
                        isActive
                          ? "bg-accent/10 ring-1 ring-accent/30 shadow-lg shadow-accent/5"
                          : isPast
                            ? "opacity-80 drop-shadow-sm"
                            : "opacity-40 grayscale"
                      )}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <Image
                        src={`/images/discovery/roasts/${step.slug.replace("-roast", "")}.png`}
                        alt={step.label}
                        width={36}
                        height={36}
                        className={cn(
                          "object-contain transition-all duration-500 pointer-events-none",
                          isActive
                            ? "scale-110 rotate-3 drop-shadow-md"
                            : "scale-90"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "mt-2.5 text-micro max-w-[5rem] leading-snug transition-colors",
                        isActive
                          ? "text-foreground font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </Link>
                  {i < STEPS.length - 1 ? (
                    <div
                      className={cn(
                        "hidden md:block h-1 flex-1 mx-2 min-w-[0.5rem] -mt-10 rounded-full",
                        activeIndex >= 0 && i < activeIndex
                          ? "bg-gradient-to-r from-accent/60 to-accent/40"
                          : activeIndex >= 0 && i === activeIndex
                            ? "bg-gradient-to-r from-accent/50 to-border/40"
                            : "bg-border/40"
                      )}
                      aria-hidden
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
