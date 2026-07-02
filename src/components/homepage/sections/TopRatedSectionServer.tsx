import dynamic from "next/dynamic";
import { TopRatedSectionSkeleton } from "@/components/homepage/TopRatedSectionSkeleton";
import { fetchCommunityCoffeeReviewCount } from "@/lib/data/fetch-community-coffee-review-count";

const TopRatedSection = dynamic(
  () => import("@/components/homepage/TopRatedSection"),
  {
    loading: () => <TopRatedSectionSkeleton />,
  }
);

/** Async server boundary: fetches the community review count for the section header. */
export default async function TopRatedSectionServer() {
  const communityCoffeeReviewCount = await fetchCommunityCoffeeReviewCount();
  return (
    <TopRatedSection communityCoffeeReviewCount={communityCoffeeReviewCount} />
  );
}
