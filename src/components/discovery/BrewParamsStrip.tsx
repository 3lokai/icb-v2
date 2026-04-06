import type { LandingPageConfig } from "@/lib/discovery/landing-pages";
import { Icon } from "@/components/common/Icon";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

type BrewParamsStripProps = {
  brewParams: NonNullable<LandingPageConfig["brewParams"]>;
  className?: string;
};

const cells: Array<{
  label: string;
  key: keyof BrewParamsStripProps["brewParams"];
  subKey?: "grindSub";
  icon: "Coffee" | "Scales" | "Timer";
  iconBg: string;
  iconColor: string;
}> = [
  {
    label: "Grind",
    key: "grindSize",
    subKey: "grindSub",
    icon: "Coffee",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Ratio",
    key: "ratio",
    icon: "Scales",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    label: "Brew time",
    key: "brewTime",
    icon: "Timer",
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
  },
];

/**
 * Starting-point brew parameters for a brew method (no water temperature).
 */
export function BrewParamsStrip({
  brewParams,
  className,
}: BrewParamsStripProps) {
  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-6"
        overline="Dial-in"
        title="Starting *parameters*"
        description="Ballpark numbers to get in range—adjust to taste and your grinder."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Quick reference
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="surface-1 relative overflow-hidden rounded-2xl card-padding card-hover">
          {/* Decorative background blurs */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {cells.map((cell) => (
              <div
                key={cell.label}
                className="group border-border/40 sm:border-r sm:last:border-r-0 sm:pr-8 sm:last:pr-0 sm:border-b-0 border-b pb-6 last:pb-0 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      cell.iconBg
                    )}
                  >
                    <Icon
                      className={cell.iconColor}
                      name={cell.icon}
                      size={24}
                    />
                  </div>
                  <Stack gap="1" className="min-w-0">
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      {cell.label}
                    </p>
                    <p className="text-body font-medium text-foreground">
                      {brewParams[cell.key]}
                    </p>
                    {cell.subKey && brewParams[cell.subKey] ? (
                      <p className="text-caption text-muted-foreground">
                        {brewParams[cell.subKey]}
                      </p>
                    ) : null}
                  </Stack>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
