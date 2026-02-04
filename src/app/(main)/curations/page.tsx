import { getAllCurators } from "@/data/curations";
import { CuratorListingPage } from "@/components/curations/CuratorListingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Coffee Recommendations | Indian Coffee Beans",
  description:
    "Explore hand-picked coffee recommendations from trusted cafes, baristas, and the Indian coffee community.",
};

export default async function CurationsHubPage() {
  const curators = await getAllCurators();
  return <CuratorListingPage curators={curators} />;
}
