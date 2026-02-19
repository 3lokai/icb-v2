import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateSchemaOrg } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "Data Deletion Instructions",
  description:
    "How to request deletion of your personal data from IndianCoffeeBeans.com.",
  keywords: [
    "data deletion",
    "privacy",
    "gdpr",
    "data protection",
    "delete account",
  ],
  canonical: "/data-deletion",
  type: "website",
  other: {
    "application/ld+json": JSON.stringify(
      generateSchemaOrg({
        type: "WebPage",
        name: "Data Deletion Instructions",
        description:
          "How to request deletion of your personal data from IndianCoffeeBeans.com.",
        url: "https://indiancoffeebeans.com/data-deletion",
      })
    ),
  },
});

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
