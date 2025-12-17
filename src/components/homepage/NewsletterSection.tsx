// src/components/home/NewsletterSection.tsx
import { NewsletterForm } from "../common/NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="section-spacing bg-muted/50 backdrop-blur-sm">
      <div className="container-default">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-3 text-title" id="newsletter-heading">
            Get the Latest Coffee Updates
          </h2>
          <p className="mb-6 text-body text-muted-foreground">
            Subscribe to our newsletter for tips on brewing, roaster spotlights,
            new coffee releases, and exclusive offers.
          </p>

          <NewsletterForm className="newsletter-wrapper mt-4" />
        </div>
      </div>
    </section>
  );
}
