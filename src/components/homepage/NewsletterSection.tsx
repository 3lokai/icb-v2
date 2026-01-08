// src/components/home/NewsletterSection.tsx
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { NewsletterForm } from "../common/NewsletterForm";

export default function NewsletterSection() {
  return (
    <Section spacing="default">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Subtle magazine-paper pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.45]"
          >
            {/* top wash */}
            <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-muted/50 blur-2xl" />
            {/* paper grain-ish pattern using gradients */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* corner vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/30" />
          </div>

          <div className="relative p-6 md:p-10">
            <div className="mx-auto max-w-xl text-center">
              <Stack gap="4">
                {/* Eyebrow */}
                <div className="inline-flex flex-col items-center gap-4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      Stay Informed
                    </span>
                    <span className="h-px w-8 bg-accent/60" />
                  </div>
                  <h2
                    className="text-title text-balance"
                    id="newsletter-heading"
                  >
                    The Weekly{" "}
                    <span className="text-accent italic">Grind.</span>
                  </h2>
                </div>

                <p className="text-body text-muted-foreground">
                  Subscribe for brewing tips, roaster spotlights, new releases,
                  and the occasional shamelessly good deal. Delivered every
                  Friday.
                </p>

                <div className="pt-2">
                  <NewsletterForm className="newsletter-wrapper" />
                </div>

                {/* Micro reassurance */}
                <p className="text-micro text-muted-foreground">
                  No spam. Unsubscribe anytime. Your inbox stays civilized.
                </p>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
