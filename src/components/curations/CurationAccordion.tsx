"use client";

import Image from "next/image";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CurationList } from "./types";

type CurationAccordionProps = {
  curations: CurationList[];
  defaultCurationId: string;
};

export function CurationAccordion({
  curations,
  defaultCurationId,
}: CurationAccordionProps) {
  // Single curation - no accordion needed
  if (curations.length === 1) {
    const curation = curations[0];
    return (
      <div className="py-6 md:py-8">
        <Stack gap="4" className="mb-8">
          <Stack gap="2">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                CURATED SELECTION
              </span>
            </div>
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              {curation.title}
              <span className="text-accent italic">.</span>
            </h2>
          </Stack>
          <p className="text-body text-muted-foreground max-w-2xl font-serif italic border-l-2 border-accent/20 pl-4">
            &quot;{curation.description}&quot;
          </p>
        </Stack>
        <SelectionGrid selections={curation.selections} />
      </div>
    );
  }

  // Multiple curations - use accordion
  return (
    <div className="py-6 md:py-8">
      <Stack gap="2" className="mb-6">
        <div className="inline-flex items-center gap-4">
          <span className="h-px w-8 md:w-12 bg-accent/60" />
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            CURATED SELECTIONS
          </span>
        </div>
        <h2 className="text-title text-balance leading-[1.1] tracking-tight">
          Our Coffee <span className="text-accent italic">Selections.</span>
        </h2>
      </Stack>

      <Accordion
        type="single"
        defaultValue={defaultCurationId}
        collapsible={false}
        className="space-y-3"
      >
        {curations.map((curation) => (
          <AccordionItem
            key={curation.id}
            value={curation.id}
            className="border border-border/40 rounded-2xl px-5 md:px-6 overflow-hidden bg-card/50 data-[state=open]:bg-card data-[state=open]:border-accent/20 transition-colors"
          >
            <AccordionTrigger className="hover:no-underline py-5 md:py-6">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-heading font-serif leading-snug tracking-tight">
                    {curation.title}
                  </span>
                  {curation.isDefault && (
                    <span className="text-micro uppercase tracking-widest text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                      Featured
                    </span>
                  )}
                </div>
                <span className="text-caption font-normal">
                  {curation.selections.length} coffees
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="text-body text-muted-foreground font-serif italic border-l-2 border-accent/20 pl-4 mb-6">
                &quot;{curation.description}&quot;
              </p>
              <SelectionGrid selections={curation.selections} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Extracted selection grid component
function SelectionGrid({
  selections,
}: {
  selections: CurationList["selections"];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      {selections.map((selection) => (
        <Card
          key={selection.id}
          className="group overflow-hidden border-border/40 rounded-xl md:rounded-2xl hover:border-accent/30 transition-colors duration-300 flex flex-col sm:flex-row py-0 gap-0 bg-background"
        >
          {/* Image */}
          <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:min-h-[160px] bg-muted grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
            {selection.image ? (
              <Image
                src={selection.image}
                alt={selection.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon
                  name="Coffee"
                  size={28}
                  className="text-muted-foreground/30"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-5 md:p-6 flex-1 flex flex-col justify-center">
            <Stack gap="3">
              <Stack gap="1">
                <h3 className="text-subheading font-serif leading-snug">
                  {selection.name}
                </h3>
                <p className="text-label text-accent">{selection.roaster}</p>
              </Stack>
              <p className="text-body text-muted-foreground font-serif italic line-clamp-2">
                &quot;{selection.note}&quot;
              </p>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
