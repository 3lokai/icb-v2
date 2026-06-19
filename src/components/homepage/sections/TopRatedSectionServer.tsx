import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { fetchCommunityCoffeeReviewCount } from "@/lib/data/fetch-community-coffee-review-count";

const TopRatedSection = dynamic(
  () => import("@/components/homepage/TopRatedSection"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

/** Async server boundary: fetches the community review count for the section header. */
export default async function TopRatedSectionServer() {
  const communityCoffeeReviewCount = await fetchCommunityCoffeeReviewCount();
  return (
    <TopRatedSection communityCoffeeReviewCount={communityCoffeeReviewCount} />
  );
}
