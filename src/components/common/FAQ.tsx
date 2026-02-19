// src/components/common/FAQ.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { generateFAQSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";
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
  if (!items?.length) {
    return (
      <div className="my-8 rounded-lg border-2 border-border/40 border-dashed bg-muted/20 p-6 text-center backdrop-blur-sm">
        <p className="text-caption">No FAQ items available</p>
      </div>
    );
  }

  return (
    <div className={cn("my-8", className)}>
      <Accordion className="w-full backdrop-blur-sm" collapsible type="single">
        {items.map((item) => {
          const itemId = item.question
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          return (
            <AccordionItem key={itemId} value={itemId}>
              <AccordionTrigger className="text-left text-base! md:text-lg! font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-caption leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
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
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-border/10 pb-8">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  {overline}
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                {title}
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Stack>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
            <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              {badge}
              <span className="h-1 w-1 rounded-full bg-accent/40" />
            </div>
          </div>
        </div>
      </div>
      <FAQ className="my-0" items={items} />
    </Section>
  );
}
