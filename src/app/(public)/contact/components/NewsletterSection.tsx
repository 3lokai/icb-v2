"use client";

import Image from "next/image";
import { Icon } from "@/components/common/Icon";

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
    <div className="surface-1 mb-8 overflow-hidden rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="card-padding">
          <h3 className="mb-4 text-heading text-primary">Join Our Community</h3>
          <p className="mb-4 text-body text-foreground">
            Connect with fellow coffee lovers, get early access to new features,
            and receive our curated newsletter featuring:
          </p>

          <ul className="mb-6 space-y-3">
            {[
              "New roaster discoveries",
              "Seasonal coffee recommendations",
              "Brewing tips and techniques",
              "Community stories and features",
            ].map((item) => (
              <li className="flex items-center" key={item}>
                <div className="mr-3 h-5 w-5 flex-shrink-0 text-accent">
                  <Icon color="accent" name="Check" size={20} />
                </div>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <form className="space-y-3" onSubmit={onSubmit}>
            {/* Honeypot field - hidden from users but visible to bots */}
            <input
              aria-hidden="true"
              autoComplete="off"
              className="pointer-events-none absolute opacity-0"
              name="website"
              style={{ position: "absolute", left: "-9999px" }}
              tabIndex={-1}
              type="text"
            />
            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-caption"
                htmlFor="email"
              >
                Email Address*
              </label>
              <input
                className="search-input"
                id="email"
                name="email"
                placeholder="yourname@example.com"
                required
                type="email"
              />
            </div>
            <div className="flex items-start">
              <input
                className="mt-1 mr-2"
                id="consent"
                name="consent"
                required
                type="checkbox"
              />
              <label
                className="text-muted-foreground text-caption"
                htmlFor="consent"
              >
                I agree to receive the IndianCoffeeBeans.com newsletter. You can
                unsubscribe at any time.
              </label>
            </div>

            <button
              className={`btn-primary w-full ${formSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
              disabled={formSubmitting}
              type="submit"
            >
              {getButtonText()}
            </button>

            {formError && (
              <div className="form-message border border-destructive/30 bg-destructive/10 text-destructive">
                {formError}
              </div>
            )}

            {formSubmitted && (
              <div className="form-message border border-border bg-secondary text-muted-foreground">
                Thank you for subscribing! We have sent a confirmation email to
                your inbox.
              </div>
            )}
          </form>
        </div>

        <div className="relative">
          <Image
            alt="Coffee community"
            className="object-cover"
            fill
            src="/images/contact/enthusiast.png"
          />
        </div>
      </div>
    </div>
  );
}
