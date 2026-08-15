import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BroadcastContent } from "@/components/newsletter/BroadcastContent";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import {
  getNewsletter,
  getNewsletterHtml,
  listNewsletters,
} from "@/lib/data/fetch-newsletters";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { issueDate, type NewsletterIssue } from "@/types/newsletter-types";

type Props = {
  params: Promise<{ date: string }>;
};

export function generateStaticParams() {
  return listNewsletters().map((issue) => ({ date: issue.date }));
}

// The archive is a fixed set of files; anything else is a 404, and nothing
// touches the filesystem at request time.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const issue = getNewsletter(date);

  // Emit a real 404 status: without this the page shell starts streaming
  // with a 200 before the page body throws notFound().
  if (!issue) notFound();

  return generateSEOMetadata({
    title: issue.subject,
    description:
      issue.preview ||
      `An issue of the Indian Coffee Beans newsletter — new roasters, coffee drops, and brewing tips from India's specialty coffee scene.`,
    canonical: `/newsletter/${issue.date}`,
    type: "article",
    articleDetails: { publishedTime: issueDate(issue).toISOString() },
  });
}

function IssueNavLink({
  issue,
  direction,
}: {
  issue: NewsletterIssue;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      className={`group flex flex-col gap-1 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isPrev ? "" : "items-end text-right"
      }`}
      href={`/newsletter/${issue.date}`}
    >
      <span className="text-caption text-muted-foreground">
        {isPrev ? "← Previous issue" : "Next issue →"}
      </span>
      <span className="line-clamp-2 text-body font-medium transition-colors group-hover:text-primary">
        {issue.subject}
      </span>
    </Link>
  );
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { date } = await params;
  const issue = getNewsletter(date);

  if (!issue) {
    notFound();
  }

  const html = await getNewsletterHtml(issue.date);
  const formattedDate = format(issueDate(issue), "MMMM d, yyyy");

  // The manifest is newest first: the previous (older) issue sits after the
  // current one in the list, the next (newer) issue before it.
  const issues = listNewsletters();
  const currentIndex = issues.findIndex((i) => i.date === issue.date);
  const prevIssue = issues[currentIndex + 1] ?? null;
  const nextIssue = currentIndex > 0 ? (issues[currentIndex - 1] ?? null) : null;

  return (
    <Section spacing="default">
      <Stack className="mx-auto max-w-2xl" gap="8">
        <div>
          <Link
            className="text-caption text-muted-foreground transition-colors hover:text-primary"
            href="/newsletter"
          >
            ← All issues
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" />
            <time
              className="text-overline text-muted-foreground tracking-[0.15em]"
              dateTime={issue.date}
            >
              {formattedDate}
            </time>
          </div>

          <h1 className="mt-4 text-title text-balance tracking-tight">
            {issue.subject}
          </h1>

          {issue.preview && (
            <p className="mt-3 text-body-large text-muted-foreground text-pretty">
              {issue.preview}
            </p>
          )}
        </div>

        <BroadcastContent html={html} />

        {(prevIssue || nextIssue) && (
          <nav
            aria-label="Issue navigation"
            className="grid grid-cols-1 gap-4 border-t border-border/60 pt-8 sm:grid-cols-2"
          >
            {prevIssue ? (
              <IssueNavLink direction="prev" issue={prevIssue} />
            ) : (
              <div aria-hidden="true" className="hidden sm:block" />
            )}
            {nextIssue && <IssueNavLink direction="next" issue={nextIssue} />}
          </nav>
        )}
      </Stack>
    </Section>
  );
}
