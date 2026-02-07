// components/layout/Footer.tsx - Updated

import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { Logo } from "@/components/layout/logo";
import { CookieSettingsButton } from "../common/CookieSettings";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card">
      {/* Magazine aesthetic background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Refined dot texture */}
        <div className="absolute inset-0 opacity-[0.15]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Decorative blurry washes */}
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <div className="relative py-12 md:py-16">
        <div className="container-default">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            {/* Column 1: Brand - Spans 3 on md */}
            <div className="md:col-span-3">
              <Stack gap="6">
                <div>
                  <Link
                    aria-label="Indian Coffee Beans"
                    className="mb-4 block transition-opacity hover:opacity-90"
                    href="/"
                  >
                    <Logo
                      aria-label="Indian Coffee Beans"
                      iconHeight={32}
                      iconWidth={32}
                    />
                  </Link>
                  <p className="font-medium text-accent text-caption italic tracking-tight">
                    Brewed with ♥ in India
                  </p>
                </div>

                <p className="max-w-xs text-caption leading-relaxed text-muted-foreground">
                  A neutral discovery and review platform for Indian specialty
                  coffee, built around structured data, real reviews, and
                  transparent exploration
                </p>

                <Stack gap="3">
                  <p className="flex items-center gap-3 text-caption text-muted-foreground transition-colors hover:text-foreground">
                    <Icon
                      className="text-accent/60"
                      name="Envelope"
                      size={16}
                    />
                    support@indiancoffeebeans.com
                  </p>
                </Stack>

                <Cluster gap="3">
                  {[
                    {
                      label: "Instagram",
                      href: "https://instagram.com/indiancoffeebeans",
                      icon: "InstagramLogo",
                    },
                    {
                      label: "X (Twitter)",
                      href: "https://x.com/indiacoffeebean",
                      icon: "XLogo",
                    },
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/profile.php?id=61577147573879#",
                      icon: "FacebookLogo",
                    },
                    {
                      label: "Email",
                      href: "mailto:support@indiancoffeebeans.com",
                      icon: "Envelope",
                    },
                  ].map((social) => {
                    const isMailto = social.href.startsWith("mailto:");
                    return (
                      <a
                        key={social.label}
                        aria-label={`Follow us on ${social.label}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all hover:bg-accent/10 hover:border-accent/20 hover:-translate-y-0.5"
                        href={social.href}
                        rel={isMailto ? undefined : "noopener noreferrer"}
                        target={isMailto ? undefined : "_blank"}
                      >
                        <Icon
                          className="text-primary/70"
                          name={social.icon as any}
                          size={18}
                        />
                      </a>
                    );
                  })}
                </Cluster>
              </Stack>
            </div>

            {/* Link columns group - Spans 6 on md with reduced gap */}
            <div className="grid grid-cols-1 gap-6 md:col-span-6 md:ml-8 md:grid-cols-3">
              {/* Column 2: Discover */}
              <div>
                <Stack gap="6">
                  <h4 className="text-overline tracking-[0.15em] text-foreground font-bold">
                    Discover
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { href: "/coffees", label: "Coffees" },
                      { href: "/roasters", label: "Roasters" },
                    ].map(({ href, label }) => (
                      <li key={label}>
                        <Link
                          className="group flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-accent"
                          href={href}
                        >
                          <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0 transition-opacity group-hover:opacity-100" />
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <div className="flex items-center gap-2 text-caption text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0" />
                        <span>Regions</span>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-micro font-medium text-accent">
                          Coming Soon
                        </span>
                      </div>
                    </li>
                  </ul>
                </Stack>
              </div>

              {/* Column 3: Resources */}
              <div>
                <Stack gap="6">
                  <h4 className="text-overline tracking-[0.15em] text-foreground font-bold">
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { href: "/tools/coffee-calculator", label: "Calculator" },
                      { href: "/tools/expert-recipes", label: "Recipes" },
                      { href: "/learn/glossary", label: "Glossary" },
                    ].map(({ href, label }) => (
                      <li key={label}>
                        <Link
                          className="group flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-accent"
                          href={href}
                        >
                          <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0 transition-opacity group-hover:opacity-100" />
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <div className="flex items-center gap-2 text-caption text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0" />
                        <span>Learn</span>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-micro font-medium text-accent">
                          Coming Soon
                        </span>
                      </div>
                    </li>
                  </ul>
                </Stack>
              </div>

              {/* Column 4: About ICB */}
              <div>
                <Stack gap="6">
                  <h4 className="text-overline tracking-[0.15em] text-foreground font-bold">
                    About ICB
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        className="group flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-accent"
                        href="/about"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="group flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-accent"
                        href="/contact"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="group flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-accent"
                        href="/how-icb-works"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        How ICB Works
                      </Link>
                    </li>
                    {/* Separator */}
                    <li className="pt-2">
                      <div className="h-px w-full bg-border/60" />
                    </li>
                    <li>
                      <Link
                        className="group flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-accent"
                        href="/roasters/partner"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        For Roasters
                      </Link>
                    </li>
                  </ul>
                </Stack>
              </div>
            </div>

            {/* Column 5: Newsletter - Spans 3 on md */}
            <div className="md:col-span-3">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background/40 p-6 transition-all hover:bg-background/60 hover:border-border/80">
                <Stack gap="4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-overline tracking-[0.15em] text-foreground font-bold flex items-center gap-2">
                      <Icon
                        className="text-accent"
                        name="EnvelopeSimple"
                        size={16}
                      />
                      Updates
                    </h4>
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    Get the latest updates on Indian specialty coffee, roasters,
                    and brewing guides.
                  </p>
                  <NewsletterForm
                    buttonText="Stay Updated"
                    placeholderText="Your email"
                  />
                  <p className="text-micro text-muted-foreground/60 italic text-center">
                    No spam. Just coffee talk.
                  </p>
                </Stack>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-border/60 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                <span>© {currentYear} Indian Coffee Beans</span>
                <span className="h-1 w-1 rounded-full bg-accent/40" />
                <span>Made in India</span>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {[
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "Terms" },
                  { href: "/data-deletion", label: "Data" },
                ].map(({ href, label }) => (
                  <Link
                    key={label}
                    className="text-micro text-muted-foreground/60 uppercase tracking-widest font-medium transition-colors hover:text-accent"
                    href={href}
                  >
                    {label}
                  </Link>
                ))}
                <CookieSettingsButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
