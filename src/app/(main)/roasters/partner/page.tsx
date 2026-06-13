// src/app/roasters/partner/page.tsx

import { Metadata } from "next";
import { submitForm } from "@/app/actions/forms";
import StructuredData from "@/components/seo/StructuredData";
import {
  fetchPublicDirectoryTotals,
  type PublicDirectoryTotals,
} from "@/lib/data/fetch-public-directory-totals";
import { generateMetadata } from "@/lib/seo/metadata";
import { partnerPageSchema } from "@/lib/seo/schema";
import PartnerPageClient from "./PartnerPageClient";

const TOTALS_FALLBACK: PublicDirectoryTotals = { coffees: 0, roasters: 0 };

// Define metadata for SEO
export const metadata: Metadata = generateMetadata({
  title: "Partner With Us - List Your Roastery | IndianCoffeeBeans",
  description:
    "Join 100+ roasters on India's premier coffee platform. Get discovered by coffee enthusiasts. Founding roaster pricing: ₹2,500/year (limited spots).",
  keywords: [
    "list your coffee roastery India",
    "coffee roaster listing India",
    "verified coffee roaster",
  ],
  canonical: "/roasters/partner",
  type: "website",
});

// Server component that passes server actions to the client component
export default async function PartnerPage() {
  let totals = TOTALS_FALLBACK;
  try {
    totals = await fetchPublicDirectoryTotals();
  } catch (e) {
    console.error("[PartnerPage] fetchPublicDirectoryTotals", e);
  }

  return (
    <>
      <StructuredData schema={partnerPageSchema} />
      <PartnerPageClient submitForm={submitForm} totals={totals} />
    </>
  );
}
