"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useMemo } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { slugifyHeading } from "@/lib/utils";
import Link from "next/link";

// Modular block imports
import { Callout } from "./blocks/Callout";
import { ImageGallery } from "./blocks/ImageGallery";
import { BrewingTable } from "./blocks/BrewingTable";
import { DataTable } from "./blocks/DataTable";
import { StepList } from "./blocks/StepList";
import { CoffeeSpotlight } from "./blocks/CoffeeSpotlight";
import { RoasterSpotlight } from "./blocks/RoasterSpotlight";
import { RegionSpotlight } from "./blocks/RegionSpotlight";
import { CoffeeCollection } from "./blocks/CoffeeCollection";
import { RoasterCollection } from "./blocks/RoasterCollection";
import { RegionCollection } from "./blocks/RegionCollection";
import { FAQBlock } from "./blocks/FAQBlock";
import { SeriesNavigation } from "./blocks/SeriesNavigation";
import dynamic from "next/dynamic";

// Code-split recharts (~283 KB) — only loads on articles that embed a chart.
const DataChart = dynamic(() =>
  import("./blocks/DataChart").then((m) => m.DataChart)
);

interface ArticleContentProps {
  body: any[];
  faqItems?: Array<{ question: string; answer: string }>;
}

const createComponents = (
  articleFaqs?: Array<{ question: string; answer: string }>
): PortableTextComponents => ({
  types: {
    image: ({ value }) => (
      <figure className="my-10 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || "Article image"}
          width={1200}
          height={800}
          className="w-full object-cover"
        />
        {value.caption && (
          <figcaption className="p-4 text-center text-body italic text-muted-foreground border-t">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    callout: Callout,
    imageGallery: ImageGallery,
    brewingTable: BrewingTable,
    dataTable: DataTable,
    stepList: StepList,
    coffeeSpotlight: CoffeeSpotlight,
    roasterSpotlight: RoasterSpotlight,
    regionSpotlight: RegionSpotlight,
    coffeeCollection: CoffeeCollection,
    roasterCollection: RoasterCollection,
    regionCollection: RegionCollection,
    faqBlock: (props) => <FAQBlock {...props} articleFaqs={articleFaqs} />,
    seriesNavigation: SeriesNavigation,
    dataChart: (props) => <DataChart value={props.value} />,
  },
  block: {
    // Body content starts at h2 — the single page <h1> is the article title in
    // ArticleHeader. A body "h1" style block degrades to <h2> (kept visually
    // largest) so the document outline never has two h1s. No published/draft
    // article currently uses h1 in the body (verified 2026-06-08).
    h1: ({ children, value }) => {
      const raw = value?.children as Array<{ text?: string }> | undefined;
      const title = raw?.map((c) => c?.text ?? "").join("") ?? "";
      const id = title ? slugifyHeading(title) : undefined;
      return (
        <h2
          id={id}
          className="mb-4 mt-12 text-title font-semibold tracking-tight"
        >
          {children}
        </h2>
      );
    },
    h2: ({ children, value }) => {
      const raw = value?.children as Array<{ text?: string }> | undefined;
      const title = raw?.map((c) => c?.text ?? "").join("") ?? "";
      const id = title ? slugifyHeading(title) : undefined;
      return (
        <h2
          id={id}
          className="mb-4 mt-10 text-title font-semibold tracking-tight"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const raw = value?.children as Array<{ text?: string }> | undefined;
      const title = raw?.map((c) => c?.text ?? "").join("") ?? "";
      const id = title ? slugifyHeading(title) : undefined;
      return (
        <h3
          id={id}
          className="mb-3 mt-8 text-heading font-semibold tracking-tight"
        >
          {children}
        </h3>
      );
    },
    normal: ({ children }) => (
      <p className="mb-6 text-body leading-relaxed text-foreground/80">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-6 italic text-body-large text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-body">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-body">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <Link
        href={value.href}
        className="text-primary underline transition-colors hover:text-primary/80"
      >
        {children}
      </Link>
    ),
  },
});

export default function ArticleContent({
  body,
  faqItems,
}: ArticleContentProps) {
  const components = useMemo(() => createComponents(faqItems), [faqItems]);

  // No Tailwind Typography plugin is installed, so `prose`/`prose-slate` would
  // be inert dead classes (and `prose-slate` would inject a cool gray ramp into
  // the warm-paper system if it ever were). Every block below is styled
  // explicitly with project tokens instead.
  return (
    <div className="max-w-none text-pretty">
      <PortableText value={body} components={components} />
    </div>
  );
}
