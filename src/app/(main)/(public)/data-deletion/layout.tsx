import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/metadata";
import { dataDeletionPageSchema } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = generateMetadata({
  title: "Data Deletion Instructions",
  description:
    "How to request deletion of your personal data from IndianCoffeeBeans.com — what we store, timelines, and contact details.",
  keywords: [
    "data deletion",
    "privacy",
    "gdpr",
    "data protection",
    "delete account",
  ],
  canonical: "/data-deletion",
  type: "website",
});

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData schema={dataDeletionPageSchema} />
      {children}
    </>
  );
}
