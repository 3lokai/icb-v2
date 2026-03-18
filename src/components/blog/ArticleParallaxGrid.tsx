import { PostCard } from "@/components/blog/PostCard";
import type { Article } from "@/types/blog-types";
import { cn } from "@/lib/utils";

type ArticleGridProps = {
  articles: Article[];
  className?: string;
};

export function ArticleGrid({ articles, className }: ArticleGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {articles.map((article) => (
        <PostCard key={article._id} article={article} />
      ))}
    </div>
  );
}
