import Image from "next/image";
import type * as React from "react";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  iconWidth?: number | string;
  iconHeight?: number | string;
  "aria-label"?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Logo({
  className,
  iconWidth = 40,
  iconHeight = 40,
  "aria-label": ariaLabel = "Indian Coffee Beans",
  ...props
}: LogoProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "group relative flex items-center justify-center gap-2 font-semibold text-xl",
        className
      )}
      role="img"
      {...props}
    >
      <div className="relative flex items-center">
        <Image
          alt=""
          className="transition-transform duration-300 group-hover:scale-110"
          height={
            typeof iconHeight === "string"
              ? Number.parseInt(iconHeight, 10)
              : iconHeight
          }
          priority
          src="/logo-icon.svg"
          width={
            typeof iconWidth === "string"
              ? Number.parseInt(iconWidth, 10)
              : iconWidth
          }
        />
        <div className="-top-1 absolute right-0 opacity-0 transition-opacity group-hover:opacity-70">
          <Image
            alt=""
            className="animate-pulse opacity-50"
            height={12}
            src="/logo-icon.svg"
            width={12}
          />
        </div>
      </div>
      <h1 className="m-0 font-semibold font-serif text-primary leading-none transition-opacity duration-300">
        IndianCoffeeBeans
      </h1>
    </div>
  );
}
