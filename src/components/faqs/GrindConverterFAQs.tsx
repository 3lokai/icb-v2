// components/faqs/GrindConverterFAQs.tsx
import { FAQSection } from "@/components/common/FAQ";
import { Accent } from "@/components/primitives/accent";

export const grindConverterFAQs = [
  {
    question: "What is a micron and why does it matter for grind size?",
    answer:
      "A micron (µm) is one-thousandth of a millimetre — the standard way to measure coffee particle size. Espresso sits around 200–400µm, pour over 400–700µm, and French press 700µm and up. Measuring in microns lets you compare grind sizes across any grinder, regardless of how its dial is labelled.",
  },
  {
    question: "Why do two grinders need different settings for the same brew?",
    answer:
      "Each grinder spans a different particle-size range and divides it into a different number of clicks or numbers. A V60 grind might be 18 clicks on one grinder and number 23 on another. This tool maps each grinder's range onto the micron scale so you get a setting in that grinder's own units.",
  },
  {
    question: "How accurate are these grinder settings?",
    answer:
      "Treat them as starting points, not exact factory values. The settings are linearly interpolated across each grinder's published range, which gets you close. Burr wear, alignment, bean density, and freshness all shift the ideal, so always dial in by taste from the suggested setting.",
  },
  {
    question: "My grinder isn't listed. What should I use?",
    answer:
      "Pick the 'Generic numbered grinder (1–40)' option for a rough setting on a typical numbered dial, or choose the listed grinder closest to yours in burr type and range. Then use the micron range as your real target and adjust to taste.",
  },
  {
    question: "How do I adjust if my coffee tastes sour or bitter?",
    answer:
      "Sour, thin, or under-extracted coffee usually means the grind is too coarse — go finer (a lower setting). Bitter or harsh coffee is often over-extracted — go coarser (a higher setting). Change one or two clicks at a time and taste between adjustments.",
  },
];

export function GrindConverterFAQ() {
  return (
    <FAQSection
      badge="Grind Science"
      contained={false}
      description="Common questions about microns, grinder settings, and dialling in your grind."
      items={grindConverterFAQs}
      overline="The Details"
      title={
        <>
          Frequently Asked <Accent>Questions.</Accent>
        </>
      }
    />
  );
}
