import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
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
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "border border-border/50 bg-card/80 shadow-lg backdrop-blur-sm",
      // dark styles
      "transform-gpu dark:border-border/30 dark:bg-card/60",
      className
    )}
    key={name}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="lg:group-hover:-translate-y-10 pointer-events-none z-10 flex transform-gpu flex-col gap-2 transition-all duration-300">
        <Icon className="h-6 w-6 origin-left transform-gpu text-accent transition-all duration-300 ease-in-out group-hover:scale-90" />
        <h4 className="font-semibold text-foreground text-lg">{name}</h4>
        <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden"
        )}
      >
        <Button
          asChild
          className="pointer-events-auto p-0 text-accent hover:text-accent-foreground"
          size="sm"
          variant="link"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
      )}
    >
      <Button
        asChild
        className="pointer-events-auto p-0 text-accent hover:text-accent-foreground"
        size="sm"
        variant="link"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-accent/5" />
  </div>
);

export { BentoCard, BentoGrid };
