import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { getAllCurators } from "@/data/curations";

const CuratorSpotlight = dynamic(
  () => import("@/components/homepage/CuratorSpotlight"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

/** Async server boundary: fetches curators so the page shell isn't blocked on it. */
export default async function CuratorSpotlightServer() {
  const curators = await getAllCurators();
  return <CuratorSpotlight curator={curators[0] || null} />;
}
