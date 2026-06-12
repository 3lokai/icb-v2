// src/app/(public)/contact/page.tsx

import { Metadata } from "next";
import { Suspense } from "react";
import { submitForm } from "@/app/actions/forms";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { contactPageSchema } from "@/lib/seo/schema";
import ContactForms from "./ContactForms";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";

// Define metadata for SEO
export const metadata: Metadata = generateMetadata({
  title: "Contact Us | Indian Coffee Beans Directory",
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
      <Suspense fallback={<div className="pb-20" />}>
        <ContactForms
          submitForm={submitForm}
          subscribeToNewsletter={subscribeToNewsletter}
        />
      </Suspense>
    </>
  );
}
