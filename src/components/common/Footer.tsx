// components/layout/Footer.tsx - Updated

import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { Logo } from "@/components/logo";
import { CookieSettingsButton } from "../common/CookieSettings";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-border border-t bg-muted px-4 pt-12 pb-6 text-muted-foreground md:px-8">
      {/* Simplified decorative gradient */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

      <div className="container-default grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Column 1: Brand */}
        <div>
          <Link
            aria-label="Indian Coffee Beans"
            className="mb-2 block transition-opacity hover:opacity-90"
            href="/"
          >
            <Logo
              aria-label="Indian Coffee Beans"
              iconHeight={28}
              iconWidth={28}
            />
          </Link>

          {/* "Brewed with love" moved here */}
          <p className="mb-3 font-medium text-primary/80 text-caption italic">
            Brewed with ♥ in India
          </p>

          <p className="mb-3 text-body leading-relaxed">
            The definitive resource for discovering and exploring India&apos;s
            finest coffee beans and roasters.
          </p>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-body transition-colors hover:text-foreground">
              <Icon className="text-primary/70" name="Envelope" size={14} />
              contact@indiancoffeebeans.com
            </p>
            <p className="flex items-center gap-2 text-body transition-colors hover:text-foreground">
              <Icon className="text-primary/70" name="MapPin" size={14} />
              Hyderabad, Telangana, India
            </p>
          </div>

          {/* Social icons - Instagram and X only */}
          <div className="mt-4 flex gap-3">
            <a
              aria-label="Follow us on Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors hover:bg-primary/10"
              href="https://instagram.com/indiancoffeebeans"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className="text-primary" name="InstagramLogo" size={16} />
            </a>
            <a
              aria-label="Follow us on X (Twitter)"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors hover:bg-primary/10"
              href="https://x.com/indiacoffeebean"
            >
              <Icon className="text-primary" name="XLogo" size={16} />
            </a>
            <a
              aria-label="Follow us on Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors hover:bg-primary/10"
              href="https://www.facebook.com/profile.php?id=61577147573879#"
            >
              <Icon className="text-primary" name="FacebookLogo" size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Discover */}
        <div>
          <h4 className="footer-heading border-border border-b pb-2">
            Discover
          </h4>
          <ul className="space-y-2">
            {[
              { href: "/coffees", label: "Coffees" },
              { href: "/roasters", label: "Roasters" },
              { href: "/regions", label: "Regions" },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  className="group footer-link inline-flex items-center gap-1"
                  href={href}
                >
                  <Icon
                    className="text-primary/70 opacity-0 transition-opacity group-hover:opacity-100"
                    name="CaretRight"
                    size={12}
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Tools & Learn */}
        <div>
          <h4 className="footer-heading border-border border-b pb-2">
            Tools & Learn
          </h4>
          <ul className="space-y-2">
            {[
              { href: "/tools/coffee-calculator", label: "Coffee Calculator" },
              { href: "/tools/expert-recipes", label: "Expert Recipes" },
              { href: "/learn", label: "Learn & Articles" },
              { href: "/learn/glossary", label: "Coffee Glossary" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  className="group footer-link inline-flex items-center gap-1"
                  href={href}
                >
                  <Icon
                    className="text-primary/70 opacity-0 transition-opacity group-hover:opacity-100"
                    name="CaretRight"
                    size={12}
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="glass-card rounded-lg p-4">
          <h4 className="footer-heading flex items-center gap-2">
            <Icon className="text-primary" name="EnvelopeSimple" size={16} />
            Stay Updated
          </h4>
          <p className="mb-3 text-body">
            Get the latest updates on Indian coffee, new roasters, and brewing
            guides.
          </p>
          <NewsletterForm
            buttonText="Subscribe"
            placeholderText="Your email address"
          />
        </div>
      </div>

      <div className="container-default mt-10 flex flex-col items-center justify-between border-border border-t pt-6 text-muted-foreground text-caption md:flex-row">
        <p>© {currentYear} Indian Coffee Beans. All rights reserved.</p>
        <div className="mt-2 flex gap-4 md:mt-0">
          <Link className="footer-link" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="footer-link" href="/terms">
            Terms of Service
          </Link>
          <Link className="footer-link" href="/data-deletion">
            Data Deletion
          </Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
