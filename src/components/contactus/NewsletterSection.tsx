// src/components/contactus/NewsletterSection.tsx
"use client";

import Image from "next/image";
import { Icon } from "@/components/common/Icon";
import { Button } from "../ui/button";
import { Stack } from "../primitives/stack";

type NewsletterSectionProps = {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formSubmitting: boolean;
  formSubmitted: boolean;
  formError: string | null;
  getButtonText: () => string;
};

export function NewsletterSection({
  onSubmit,
  formSubmitting,
  formSubmitted,
  formError,
  getButtonText,
}: NewsletterSectionProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
      {/* Magazine accent: stripe */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-1.5 md:w-2 bg-gradient-to-b from-primary via-accent to-primary/60 opacity-60" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-12 xl:col-span-7 p-8 md:p-12 xl:p-16">
          <Stack gap="12">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  The Community
                </span>
              </div>

              <h3 className="text-title text-balance leading-[1.1] tracking-tight">
                Join Our Global{" "}
                <span className="text-accent italic">Coffee Community.</span>
              </h3>

              <p className="max-w-xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                Connect with fellow enthusiasts, get early access to new
                features, and receive our curated monthly field notes.
              </p>
            </Stack>

            <div className="grid md:grid-cols-2 gap-10">
              <ul className="space-y-4">
                {[
                  "New roaster discoveries",
                  "Seasonal recommendations",
                  "Exclusive brewing tips",
                  "Community features",
                ].map((item) => (
                  <li
                    className="flex items-center gap-3 text-caption font-medium text-foreground"
                    key={item}
                  >
                    <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Icon name="Check" size={12} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <form className="space-y-5" onSubmit={onSubmit}>
                <input
                  aria-hidden="true"
                  autoComplete="off"
                  className="pointer-events-none absolute opacity-0"
                  name="website"
                  style={{ position: "absolute", left: "-9999px" }}
                  tabIndex={-1}
                  type="text"
                />

                <Stack gap="3">
                  <label
                    className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full px-5 py-3.5 rounded-xl border border-border/60 bg-background text-body focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="yourname@gmail.com"
                    required
                    type="email"
                  />
                </Stack>

                <div className="flex items-start gap-3">
                  <input
                    className="mt-1 h-4 w-4 rounded border-border/60 text-accent focus:ring-accent/20 cursor-pointer"
                    id="consent"
                    name="consent"
                    required
                    type="checkbox"
                  />
                  <label
                    className="text-micro text-muted-foreground/80 leading-snug cursor-pointer select-none"
                    htmlFor="consent"
                  >
                    I agree to the privacy policy. Unsubscribe anytime.
                  </label>
                </div>

                <Button
                  className="w-full h-14 text-body font-bold uppercase tracking-widest shadow-xl shadow-accent/5 hover-lift"
                  disabled={formSubmitting}
                  type="submit"
                >
                  {getButtonText()}
                </Button>

                {formError && (
                  <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-caption">
                    {formError}
                  </div>
                )}

                {formSubmitted && (
                  <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-accent font-medium text-caption">
                    Welcome! Please check your inbox for confirmation.
                  </div>
                )}
              </form>
            </div>
          </Stack>
        </div>

        <div className="lg:col-span-12 xl:col-span-5 relative min-h-[400px] border-t xl:border-t-0 xl:border-l border-border/40">
          <Image
            alt="Coffee community"
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            src="/images/contact/enthusiast.png"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
