import dynamic from "next/dynamic";
import { TopProfilesSectionSkeleton } from "@/components/homepage/TopProfilesSectionSkeleton";
import { fetchTopCoffeeReviewers } from "@/lib/data/fetch-top-coffee-reviewers";

const TopProfilesSection = dynamic(
  () => import("@/components/homepage/TopProfilesSection"),
  {
    loading: () => <TopProfilesSectionSkeleton />,
  }
);

/** Async server boundary: fetches top reviewers so the page shell isn't blocked on it. */
export default async function TopProfilesSectionServer() {
  const profiles = await fetchTopCoffeeReviewers(6);
  return <TopProfilesSection profiles={profiles} />;
}
