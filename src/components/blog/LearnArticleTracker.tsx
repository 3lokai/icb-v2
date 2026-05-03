"use client";

import { useEffect } from "react";
import { capture } from "@/lib/posthog";

type Props = {
  slug: string;
  title: string;
  category_slug?: string;
};

export function LearnArticleTracker({ slug, title, category_slug }: Props) {
  useEffect(() => {
    capture("learn_article_viewed", {
      slug,
      title,
      category_slug: category_slug ?? null,
    });
  }, [slug]);

  return null;
}
