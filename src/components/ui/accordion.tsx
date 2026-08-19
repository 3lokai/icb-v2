"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b last:border-b-0", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <Icon
          className="pointer-events-none shrink-0 translate-y-0.5 transition-transform duration-200"
          color="muted"
          icon={CaretDownIcon}
          size={16}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  contentClassName,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & {
  /** Classes for the animating Content element itself, not the padded inner
   *  wrapper. Only needed for `data-[state=…]` variants — Radix stamps
   *  `data-state` on Content, so those classes cannot ride on `className`. */
  contentClassName?: string;
}) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        contentClassName
      )}
      data-slot="accordion-content"
      {...props}
    >
      {/* Padding lives here, not on Content: Content's height animates, and
          padding on it shows as a jump at the start of the transition. */}
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
