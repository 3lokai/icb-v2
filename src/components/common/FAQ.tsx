// src/components/learn/mdx/FAQ.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FAQProps = {
  items?: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
  className?: string;
};

export function FAQ({ items, className }: FAQProps) {
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
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-body-muted">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
