// src/app/(public)/contact/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { submitForm } from "@/app/actions/forms";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { contactPageSchema } from "@/lib/seo/schema";
import ContactForms from "./ContactForms";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";

// Define metadata for SEO
export const metadata: Metadata = generateMetadata({
  title: "Contact Us",
  description:
    "Connect with the Indian coffee community. Submit roasters, suggest changes, or partner with us to build the definitive resource for Indian coffee.",
  keywords: [
    "Indian coffee",
    "contact",
    "coffee community",
    "roaster submission",
    "coffee partnership",
  ],
  canonical: "/contact",
  type: "website",
});

// Server component that passes server actions to the client component
export default function ContactPage() {
  return (
    <>
      <StructuredData schema={contactPageSchema} />
      <PageHeader
        title={
          <>
            Connect With <Accent>Us.</Accent>
          </>
        }
        overline="Our Community"
        description="Join the Indian coffee community and help build the definitive resource for local coffee enthusiasts and professionals."
      />
      <Section spacing="default">
        <div className="mx-auto max-w-3xl space-y-4 text-body text-muted-foreground leading-relaxed">
          <h2 className="text-heading text-foreground">
            India&apos;s independent specialty coffee directory
          </h2>
          <p>
            Indian Coffee Beans (ICB) is India&apos;s first independent
            directory for specialty coffee — a neutral platform where
            enthusiasts discover roasters, compare beans, read community
            ratings, and learn how Indian coffee is grown, roasted, and brewed.
            We are not a marketplace and we do not take sponsorships from
            roasters; our goal is to give drinkers verified data and honest
            community signal.
          </p>
          <p>
            Use the forms below to reach our team. Whether you want to suggest a
            roaster we should list, report outdated information, ask about
            partnerships, or share feedback on the site, we read every message.
            We typically respond within two to three business days. For urgent
            privacy or account issues, email{" "}
            <a
              className="text-accent underline-offset-4 hover:underline"
              href="mailto:support@indiancoffeebeans.com"
            >
              support@indiancoffeebeans.com
            </a>
            .
          </p>
          <p>
            New to ICB? Read{" "}
            <Link
              className="text-accent underline-offset-4 hover:underline"
              href="/about"
            >
              about us
            </Link>{" "}
            for our mission and team, or see{" "}
            <Link
              className="text-accent underline-offset-4 hover:underline"
              href="/how-icb-works"
            >
              how ICB works
            </Link>{" "}
            for how we source data, handle ratings, and stay neutral.
          </p>
        </div>
      </Section>
      <Suspense
        fallback={
          <div className="pb-20">
            <h2 className="sr-only">Contact forms</h2>
          </div>
        }
      >
        <ContactForms
          submitForm={submitForm}
          subscribeToNewsletter={subscribeToNewsletter}
        />
      </Suspense>
    </>
  );
}
