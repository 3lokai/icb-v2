import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { client } from "@/lib/sanity/client";
import { LATEST_ARTICLES_QUERY } from "@/lib/sanity/queries";
import type { Article } from "@/types/blog-types";

const EducationSection = dynamic(
  () => import("@/components/homepage/EducationContent"),
  {
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

/** Async server boundary: fetches latest articles from Sanity (the slowest homepage fetch). */
export default async function EducationSectionServer() {
  const latestArticles = await client.fetch<Article[]>(LATEST_ARTICLES_QUERY);
  return <EducationSection articles={latestArticles} />;
}
