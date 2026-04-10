import { getAllCurators } from "@/data/curations";
import { CuratorListingPage } from "@/components/curations/CuratorListingPage";
import { PageHeader } from "@/components/layout/PageHeader";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

export const metadata = generateSEOMetadata({
  title: "Curated Coffee Recommendations | Indian Coffee Beans",
  description:
    "Explore hand-picked coffee recommendations from trusted cafes, baristas, and the Indian coffee community.",
  keywords: [
    "curated coffee",
    "coffee recommendations",
    "Indian coffee",
    "barista picks",
  ],
  canonical: `${baseUrl}/curations`,
  type: "website",
});

export default async function CurationsHubPage() {
  const curators = await getAllCurators();

  return (
    <>
      <PageHeader
        overline="CURATED RECOMMENDATIONS"
        title={
          <>
            Curations by cafés, baristas, and{" "}
            <span className="text-accent italic">serious coffee people.</span>
          </>
        }
        description="Independent coffee recommendations from people who brew, taste, and care deeply about Indian specialty coffee."
      />
      <CuratorListingPage curators={curators} />
    </>
  );
}
