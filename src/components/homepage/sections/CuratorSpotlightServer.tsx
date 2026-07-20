import dynamic from "next/dynamic";
import { CuratorSpotlightSkeleton } from "@/components/homepage/CuratorSpotlightSkeleton";
import { getAllCurators } from "@/data/curations";

const CuratorSpotlight = dynamic(
  () => import("@/components/homepage/CuratorSpotlight"),
  {
    loading: () => <CuratorSpotlightSkeleton />,
  }
);

/** Async server boundary: fetches curators so the page shell isn't blocked on it. */
export default async function CuratorSpotlightServer() {
  const curators = await getAllCurators();
  const curator = curators[0];
  // No curator → render nothing. Rendering the dynamic anyway showed its loading
  // skeleton, then collapsed to null when the chunk resolved (a layout shift).
  if (!curator) return null;
  return <CuratorSpotlight curator={curator} />;
}
