import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { fetchTopCoffeeReviewers } from "@/lib/data/fetch-top-coffee-reviewers";

const TopProfilesSection = dynamic(
  () => import("@/components/homepage/TopProfilesSection"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

/** Async server boundary: fetches top reviewers so the page shell isn't blocked on it. */
export default async function TopProfilesSectionServer() {
  const profiles = await fetchTopCoffeeReviewers(6);
  return <TopProfilesSection profiles={profiles} />;
}
