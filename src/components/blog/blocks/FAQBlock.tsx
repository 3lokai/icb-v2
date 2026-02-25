"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

interface FAQBlockProps {
  value: {
    title?: string;
    items?: Array<{ question: string; answer: string }>;
    faqItems?: Array<{ question: string; answer: string }>;
    customFAQs?: Array<{ question: string; answer: string }>;
    useArticleFAQs?: boolean;
  };
  articleFaqs?: Array<{ question: string; answer: string }>;
}

function getItemId(question: string, index: number): string {
  const slug = question
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return slug || `item-${index}`;
}

export function FAQBlock({ value, articleFaqs = [] }: FAQBlockProps) {
  const useArticle = value.useArticleFAQs !== false;
  const items = useArticle
    ? articleFaqs
    : value.customFAQs || value.items || value.faqItems || [];

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="not-prose my-8 rounded-lg border-2 border-border/40 border-dashed bg-muted/20 p-6 text-center backdrop-blur-sm"
      >
        <p className="text-caption">No FAQ items available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="not-prose my-8"
    >
      {value.title && (
        <h4 className="mb-10 text-title font-bold tracking-tight text-foreground underline decoration-accent/30 decoration-4 underline-offset-8">
          {value.title}
        </h4>
      )}
      <Accordion
        type="single"
        collapsible
        className="w-full backdrop-blur-sm [&_[data-slot=accordion-item]]:bg-transparent [&_[data-slot=accordion-item]]:border-t-0 [&_[data-slot=accordion-item]]:border-x-0"
      >
        {items.map((item, i) => {
          const itemId = getItemId(item.question, i);
          return (
            <AccordionItem
              key={itemId}
              value={itemId}
              className="bg-transparent"
            >
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
