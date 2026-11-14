// components/layout/Footer.tsx - Updated

import Link from "next/link";
import {
  EnvelopeIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { BrewIconsRow } from "@/components/layout/BrewIconsRow";
import { Logo } from "@/components/layout/logo";
import { CookieSettingsButton } from "../common/CookieSettings";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Decor } from "@/components/primitives/decor";
import { FOOTER_NAV, LEGAL_NAV } from "@/lib/navigation";
import { FOUNDER } from "@/lib/seo/schema";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card">
      {/* Magazine aesthetic background elements */}
      <Decor texture="dots" wash />

      <div className="relative py-12 md:py-16">
        <PageShell>
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
                      icon={EnvelopeIcon}
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
                      icon: InstagramLogoIcon,
                    },
                    {
                      label: "X (Twitter)",
                      href: "https://x.com/indiacoffeebean",
                      icon: XLogoIcon,
                    },
                    {
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/company/indiancoffeebeans",
                      icon: LinkedinLogoIcon,
                    },
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/profile.php?id=61577147573879#",
                      icon: FacebookLogoIcon,
                    },
                    {
                      label: "Email",
                      href: "mailto:support@indiancoffeebeans.com",
                      icon: EnvelopeIcon,
                    },
                  ].map((social) => {
                    const isMailto = social.href.startsWith("mailto:");
                    return (
                      <a
                        key={social.label}
                        aria-label={`Follow us on ${social.label}`}
                        className="flex items-center justify-center text-muted-foreground transition-all hover:text-accent hover:-translate-y-0.5"
                        href={social.href}
                        rel={isMailto ? undefined : "noopener noreferrer"}
                        target={isMailto ? undefined : "_blank"}
                      >
                        <Icon icon={social.icon} size={20} />
                      </a>
                    );
                  })}
                </Cluster>
              </Stack>
            </div>

            {/* Link columns: six groups, two across on mobile.
                ponytail: no mobile accordions; add them if the footer proves too
                long on phones. */}
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-6 md:ml-8 md:grid-cols-3"
            >
              {FOOTER_NAV.map((column) => (
                <div key={column.label}>
                  <h3 className="text-ui-label text-foreground">
                    {column.label}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {column.items.map(({ name, link }) => (
                      <li key={name}>
                        <Link
                          className="text-caption underline-offset-4 transition-colors hover:text-foreground hover:underline motion-reduce:transition-none"
                          href={link}
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Column 5: Newsletter - Spans 3 on md */}
            <div className="md:col-span-3">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background/40 p-6 transition-all hover:bg-background/60 hover:border-border/80">
                <Stack gap="4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-ui-label text-foreground">
                      <Icon
                        className="text-accent"
                        icon={EnvelopeSimpleIcon}
                        size={16}
                      />
                      Updates
                    </h3>
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
                    No spam. Just coffee talk.{" "}
                    <Link
                      className="not-italic underline-offset-2 transition-colors hover:text-accent hover:underline"
                      href="/newsletter"
                    >
                      Browse past issues
                    </Link>
                  </p>
                </Stack>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <BrewIconsRow />
          </div>

          <div className="mt-8 border-t border-border/60 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center gap-2 md:items-start">
                <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                  <span suppressHydrationWarning>
                    © {currentYear} Indian Coffee Beans
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent/40" />
                  <span>Made in India</span>
                </div>
                <p className="text-micro text-muted-foreground/60 tracking-wide">
                  Founded by{" "}
                  <Link
                    className="transition-colors hover:text-accent"
                    href={FOUNDER.aboutHref}
                  >
                    {FOUNDER.name}
                  </Link>
                  {" · "}
                  <Link
                    className="transition-colors hover:text-accent"
                    href={FOUNDER.linkedInHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    LinkedIn
                  </Link>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {LEGAL_NAV.map(({ name, link }) => (
                  <Link
                    key={name}
                    className="text-micro text-muted-foreground/60 uppercase tracking-widest font-medium transition-colors hover:text-accent"
                    href={link}
                  >
                    {name}
                  </Link>
                ))}
                <CookieSettingsButton />
              </div>
            </div>
          </div>
        </PageShell>
      </div>
    </footer>
  );
}
