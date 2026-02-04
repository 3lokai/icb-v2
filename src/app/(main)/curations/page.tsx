import { getAllCurators } from "@/data/curations";
import { CuratorListingPage } from "@/components/curations/CuratorListingPage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

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
  return <CuratorListingPage curators={curators} />;
}
