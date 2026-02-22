"use client";

import Image from "next/image";
import { Author } from "@/types/blog-types";
import { urlFor } from "@/lib/sanity/image";

interface DetailedAuthorProps {
  author: Author;
}

export function DetailedAuthor({ author }: DetailedAuthorProps) {
  return (
    <div className="my-16 overflow-hidden rounded-2xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:text-left text-center">
        {/* Large Avatar */}
        <div className="relative size-32 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-md">
          {author.avatar ? (
            <Image
              src={urlFor(author.avatar).width(256).height(256).url()}
              alt={author.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent text-white font-bold text-title">
              {author.name[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="mb-2 text-overline text-accent uppercase tracking-[0.15em]">
            About the author
          </div>
          <h3 className="mb-4 text-title font-bold text-foreground">
            {author.name}
          </h3>
          <p className="max-w-xl text-body text-muted-foreground leading-relaxed">
            {author.bio ||
              "Passionate about specialty coffee in India. Sharing stories, guides, and insights from the bean to the cup."}
          </p>

          <div className="mt-8 flex justify-center md:justify-start gap-4">
            {/* We could add social links here if they were in the schema */}
            <button className="text-body font-semibold text-primary hover:underline">
              Follow author
            </button>
            <span className="text-muted-foreground/30">•</span>
            <button className="text-body font-semibold text-muted-foreground hover:text-foreground">
              View all posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
