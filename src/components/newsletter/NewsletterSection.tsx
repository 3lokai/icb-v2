import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { NewsletterForm } from "../common/NewsletterForm";

/**
 * Postmark watermark: the newsletter ships every fortnight (issues are titled
 * "ICB Fortnight N"). The stamp bleeds off the band's edge like a postmark on
 * an envelope — a faint coffee tint on the warm-paper ground, decorative only.
 */
function PostmarkStamp() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 select-none text-primary opacity-[0.06] md:-right-10 md:-top-10"
    >
      <svg
        className="h-56 w-56 rotate-12 md:h-72 md:w-72"
        fill="none"
        viewBox="0 0 140 140"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M70 15 A 55 55 0 1 1 70 125 A 55 55 0 1 1 70 15"
          id="postmark-path"
          stroke="transparent"
        />
        <text className="fill-current text-caption font-bold uppercase tracking-[0.25em]">
          <textPath href="#postmark-path" startOffset="50%" textAnchor="middle">
            • Fortnightly • Fortnightly
          </textPath>
        </text>

        <circle
          className="opacity-60"
          cx="70"
          cy="70"
          r="40"
          stroke="currentColor"
          strokeDasharray="2 4"
          strokeWidth="1"
        />
        <circle
          className="opacity-40"
          cx="70"
          cy="70"
          r="34"
          stroke="currentColor"
          strokeWidth="0.5"
        />

        <image height="60" href="/logo-icon.svg" width="60" x="40" y="40" />
      </svg>
    </div>
  );
}

/**
 * Newsletter subscribe band — the archive page's one focal action.
 *
 * A full-width warm-paper band (surface-1, fenced with hairline border-y) with
 * an asymmetric headline/form split and a Fraunces masthead at display scale.
 * Boldness lives in type and layout, not colour — the roasted-bean button is
 * the single strong note. No <Accent> smear here (the page header owns the one
 * per-page smear).
 */
export default function NewsletterSection() {
  return (
    <Section contained={false} spacing="default">
      <div className="relative w-full overflow-hidden border-y border-border/60 bg-card">
        {/* Brand paper grain for tactility */}
        <div aria-hidden="true" className="decor-grain absolute inset-0" />
        <PostmarkStamp />

        <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
            {/* Masthead */}
            <Stack gap="6">
              <h2
                className="text-display text-balance leading-[1.05]"
                id="newsletter-heading"
              >
                The Fortnightly Pour.
              </h2>
              <p className="text-body-large max-w-md text-muted-foreground">
                Brewing tips, roaster spotlights, new releases, and the
                occasional shamelessly good deal — landing in your inbox every
                fortnight.
              </p>
            </Stack>

            {/* Subscribe */}
            <div className="w-full max-w-md md:ml-auto">
              <NewsletterForm className="w-full" />
              <p className="text-caption mt-3 text-muted-foreground">
                No spam. Unsubscribe anytime. Your inbox stays civilized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
