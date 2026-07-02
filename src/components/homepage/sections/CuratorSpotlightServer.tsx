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
  return <CuratorSpotlight curator={curators[0] || null} />;
}
