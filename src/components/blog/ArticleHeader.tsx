"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Article } from "@/types/blog-types";
import { urlFor } from "@/lib/sanity/image";
import { Stack } from "@/components/primitives/stack";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const {
    title,
    description,
    excerpt,
    category,
    author,
    authorRef,
    date,
    metadata,
    cover,
    brewingMethod,
    brewTime,
    difficulty,
  } = article;
  const displayAuthor = authorRef || author;
  const backgroundImage = cover ? urlFor(cover).width(1600).url() : undefined;

  return (
    <section className="relative flex min-h-[60vh] w-screen max-w-none items-center justify-center overflow-hidden md:min-h-[50vh] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0 bg-black/80">
          <Image
            alt={title}
            className="object-cover object-center"
            fill
            priority
            sizes="100vw"
            src={backgroundImage}
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <div className="max-w-4xl text-left">
          <Stack gap="8">
            {/* Category */}
            {category && (
              <Link
                href={`/learn/category/${category.slug}`}
                className="inline-flex rounded-full bg-accent/20 px-4 py-1.5 text-overline text-accent backdrop-blur-md transition-colors hover:bg-accent/30"
              >
                {category.name}
              </Link>
            )}

            {/* Title & Description */}
            <Stack gap="4">
              <h1 className="text-display text-white text-balance leading-[1.1] tracking-tight md:text-display lg:text-hero">
                {title}
              </h1>
              {(description || excerpt) && (
                <p className="max-w-2xl text-pretty text-body-large text-white/80 leading-relaxed">
                  {description || excerpt}
                </p>
              )}
            </Stack>

            {/* Metadata Bottom Row */}
            <div className="flex flex-wrap items-center justify-start gap-6 pt-4 border-t border-white/10 w-full mt-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-white/20">
                  {displayAuthor.avatar ? (
                    <Image
                      src={urlFor(displayAuthor.avatar)
                        .width(80)
                        .height(80)
                        .url()}
                      alt={displayAuthor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent text-white font-bold text-caption">
                      {displayAuthor.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-body font-semibold text-white">
                    {displayAuthor.name}
                  </div>
                  <div className="text-overline uppercase tracking-wider text-white/50">
                    Author
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              {/* Date */}
              <div className="text-left">
                <div className="text-overline uppercase tracking-wider text-white/50 mb-0.5">
                  Published
                </div>
                <div className="text-body text-white">
                  {format(new Date(date), "MMMM d, yyyy")}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              {/* Reading Time */}
              <div className="text-left">
                <div className="text-overline uppercase tracking-wider text-white/50 mb-0.5">
                  Reading
                </div>
                <div className="text-body text-white">
                  {metadata?.readingTime || 5} min
                </div>
              </div>

              {/* Brewing Info (Conditional) */}
              {(brewingMethod || brewTime || difficulty) && (
                <>
                  <div className="hidden h-8 w-px bg-white/10 sm:block" />

                  {brewingMethod && (
                    <div className="text-left">
                      <div className="text-overline uppercase tracking-wider text-white/50 mb-0.5">
                        Method
                      </div>
                      <div className="text-body text-white">
                        {brewingMethod}
                      </div>
                    </div>
                  )}

                  {brewTime && (
                    <div className="text-left">
                      <div className="text-overline uppercase tracking-wider text-white/50 mb-0.5">
                        Time
                      </div>
                      <div className="text-body text-white">{brewTime}</div>
                    </div>
                  )}

                  {difficulty && (
                    <div className="text-left">
                      <div className="text-overline uppercase tracking-wider text-white/50 mb-0.5">
                        Difficulty
                      </div>
                      <div className="text-body text-white capitalize">
                        {difficulty}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Stack>
        </div>
      </div>
    </section>
  );
}
