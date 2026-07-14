import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BroadcastContent } from "@/components/newsletter/BroadcastContent";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import {
  fetchBroadcastById,
  fetchBroadcasts,
} from "@/lib/data/fetch-broadcasts";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { broadcastDate, type KitBroadcast } from "@/types/newsletter-types";

export const revalidate = 3600;

type Props = {
  params: Promise<{ id: string }>;
};

async function getCompletedBroadcast(
  idParam: string
): Promise<KitBroadcast | null> {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;

  const broadcast = await fetchBroadcastById(id);
  if (!broadcast || broadcast.status !== "completed") return null;
  return broadcast;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const broadcast = await getCompletedBroadcast(id);

  // Emit a real 404 status: without this the page shell starts streaming
  // with a 200 before the page body throws notFound().
  if (!broadcast) notFound();

  const date = broadcastDate(broadcast);

  return generateSEOMetadata({
    title: broadcast.subject,
    description:
      broadcast.preview_text ||
      broadcast.description ||
      `An issue of the Indian Coffee Beans newsletter — new roasters, coffee drops, and brewing tips from India's specialty coffee scene.`,
    canonical: `/newsletter/${broadcast.id}`,
    type: "article",
    articleDetails: date ? { publishedTime: date.toISOString() } : undefined,
  });
}

function IssueNavLink({
  broadcast,
  direction,
}: {
  broadcast: KitBroadcast;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      className={`group flex flex-col gap-1 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isPrev ? "" : "items-end text-right"
      }`}
      href={`/newsletter/${broadcast.id}`}
    >
      <span className="text-caption text-muted-foreground">
        {isPrev ? "← Previous issue" : "Next issue →"}
      </span>
      <span className="line-clamp-2 text-body font-medium transition-colors group-hover:text-primary">
        {broadcast.subject}
      </span>
    </Link>
  );
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { id } = await params;
  const [broadcast, allBroadcasts] = await Promise.all([
    getCompletedBroadcast(id),
    fetchBroadcasts(),
  ]);

  if (!broadcast) {
    notFound();
  }

  const date = broadcastDate(broadcast);
  const formattedDate = date ? format(date, "MMMM d, yyyy") : null;

  // fetchBroadcasts is sorted newest first: the previous (older) issue sits
  // after the current one in the list, the next (newer) issue before it.
  const currentIndex = allBroadcasts.findIndex((b) => b.id === broadcast.id);
  const prevIssue =
    currentIndex !== -1 ? (allBroadcasts[currentIndex + 1] ?? null) : null;
  const nextIssue =
    currentIndex > 0 ? (allBroadcasts[currentIndex - 1] ?? null) : null;

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
            {formattedDate && (
              <time
                className="text-overline text-muted-foreground tracking-[0.15em]"
                dateTime={date!.toISOString()}
              >
                {formattedDate}
              </time>
            )}
          </div>

          <h1 className="mt-4 text-title text-balance tracking-tight">
            {broadcast.subject}
          </h1>

          {broadcast.preview_text && (
            <p className="mt-3 text-body-large text-muted-foreground text-pretty">
              {broadcast.preview_text}
            </p>
          )}
        </div>

        {broadcast.content ? (
          <BroadcastContent html={broadcast.content} />
        ) : (
          <p className="rounded-xl border border-dashed bg-card p-8 text-body text-muted-foreground">
            The full content of this issue isn&apos;t available online. It went
            out by email only.
          </p>
        )}

        {(prevIssue || nextIssue) && (
          <nav
            aria-label="Issue navigation"
            className="grid grid-cols-1 gap-4 border-t border-border/60 pt-8 sm:grid-cols-2"
          >
            {prevIssue ? (
              <IssueNavLink broadcast={prevIssue} direction="prev" />
            ) : (
              <div aria-hidden="true" className="hidden sm:block" />
            )}
            {nextIssue && (
              <IssueNavLink broadcast={nextIssue} direction="next" />
            )}
          </nav>
        )}
      </Stack>
    </Section>
  );
}
