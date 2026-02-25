import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: ReactNode;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description?: ReactNode;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => (
  <div
    className={cn(
      "grid w-full auto-rows-[16rem] grid-cols-1 gap-4 md:grid-cols-3",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      // light styles
      "border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-md",
      // dark styles
      "transform-gpu dark:border-border/40 dark:bg-card/40",
      className
    )}
    {...props}
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Subtle magazine texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Accent stripe on large cards */}
      {className.includes("lg:col-span-2") ||
      className.includes("lg:col-span-3") ? (
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/40 via-accent/40 to-primary/20 opacity-40 transition-opacity group-hover:opacity-80" />
      ) : null}
    </div>

    <div>{background}</div>

    <div className="relative z-10 p-6 md:p-8">
      <div className="flex transform-gpu flex-col gap-3 transition-all duration-500 group-hover:-translate-y-2">
        <div className="flex items-center justify-between">
          <Icon className="h-6 w-6 text-accent/60 transition-colors group-hover:text-accent" />
          <div className="h-px flex-1 mx-4 bg-border/40" />
        </div>

        <div className="text-heading text-foreground tracking-tight">
          {name}
        </div>
        {description != null && description !== "" ? (
          <div className="max-w-lg text-pretty text-body-muted text-sm leading-relaxed">
            {description}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "pointer-events-none mt-4 flex w-full transform-gpu flex-row items-center opacity-0 transition-all duration-500 group-hover:opacity-100"
        )}
      >
        <Button
          asChild
          className="pointer-events-auto p-0 h-auto text-accent hover:text-accent/80 font-medium"
          size="sm"
          variant="link"
        >
          <a href={href} className="flex items-center gap-2">
            {cta}
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-500 group-hover:bg-accent/[0.02]" />
  </div>
);

export { BentoCard, BentoGrid };
