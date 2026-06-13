// src/components/common/FAQ.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/primitives/section";
import StructuredData from "@/components/seo/StructuredData";
import { generateFAQSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items: Array<FAQItem>;
  overline: string;
  title: ReactNode;
  description: string;
  badge: string;
  className?: string;
  contained?: boolean;
  /** When false, skip rendering FAQ JSON-LD (e.g. when parent outputs it). Default true. */
  includeStructuredData?: boolean;
};

type SimpleFAQProps = {
  items?: Array<FAQItem>;
  className?: string;
};

// Simple FAQ component without section header (for MDX/embeds)
export function FAQ({ items, className }: SimpleFAQProps) {
  const reduceMotion = useReducedMotion();

  if (!items?.length) {
    return (
      <div className="my-8 rounded-lg border-2 border-border/40 border-dashed bg-muted/20 p-6 text-center">
        <p className="text-caption">No FAQ items available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn("my-8", className)}
    >
      <Accordion className="w-full" collapsible type="single">
        {items.map((item) => {
          const itemId = item.question
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          return (
            <AccordionItem key={itemId} value={itemId}>
              <AccordionTrigger className="text-left text-body font-bold text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-body text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </motion.div>
  );
}

// Full FAQ section with header (for page sections)
export function FAQSection({
  items,
  overline,
  title,
  description,
  badge,
  className,
  contained = true,
  includeStructuredData = true,
}: FAQSectionProps) {
  const schema = generateFAQSchema(items);

  return (
    <Section spacing="loose" className={className} contained={contained}>
      {includeStructuredData && <StructuredData schema={schema} />}

      {/* Editorial header — kicker, Fraunces title, lead, anchored by a hairline rule */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-b border-border/40 pb-7 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="flex flex-col gap-5">
              <span className="inline-flex items-center gap-3 text-overline font-medium tracking-[0.18em] text-muted-foreground">
                <span aria-hidden="true" className="h-px w-7 bg-accent" />
                {overline}
              </span>
              <h2 className="text-title text-balance leading-[1.08] tracking-tight">
                {title}
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end md:pb-1">
            <span className="inline-flex items-center gap-3 text-micro font-medium uppercase tracking-widest text-muted-foreground/70">
              <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
              {badge}
            </span>
          </div>
        </div>
      </div>

      {/* Answers sit on a clean paper panel — depth via surface, not blur */}
      <div className="mx-auto mt-8 max-w-5xl surface-1 rounded-2xl px-5 md:px-8">
        <FAQ className="my-0" items={items} />
      </div>
    </Section>
  );
}
