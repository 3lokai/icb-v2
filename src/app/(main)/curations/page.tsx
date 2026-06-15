import { Accent } from "@/components/primitives/accent";
import { getAllCurators } from "@/data/curations";
import { CuratorListingPage } from "@/components/curations/CuratorListingPage";
import { PageHeader } from "@/components/layout/PageHeader";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema, getSeoBaseUrl } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";

const CURATIONS_DESCRIPTION =
  "Explore hand-picked coffee recommendations from trusted cafes, baristas, and the Indian coffee community.";

export const metadata = generateSEOMetadata({
  title: "Curated Coffee Recommendations",
  description: CURATIONS_DESCRIPTION,
  keywords: [
    "curated Indian coffee picks",
    "best Indian coffee recommendations",
    "barista coffee picks India",
  ],
  canonical: "/curations",
  type: "website",
});

export default async function CurationsHubPage() {
  const curators = await getAllCurators();
  const baseUrl = getSeoBaseUrl();
  const curationsUrl = `${baseUrl}/curations`;

  const curatorItems = curators.slice(0, 20).map((curator, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "ProfilePage",
      name: curator.name,
      url: `${baseUrl}/curations/${curator.slug}`,
    },
  }));

  const collectionSchema = generateCollectionPageSchema(
    "Curated Coffee Recommendations",
    CURATIONS_DESCRIPTION,
    curationsUrl,
    curatorItems
  );

  return (
    <>
      <StructuredData schema={collectionSchema} />
      <PageHeader
        overline="CURATED RECOMMENDATIONS"
        title={
          <>
            Curations by cafés, baristas, and{" "}
            <Accent>serious coffee people.</Accent>
          </>
        }
        description="Independent coffee recommendations from people who brew, taste, and care deeply about Indian specialty coffee."
      />
      <CuratorListingPage curators={curators} />
    </>
  );
}
