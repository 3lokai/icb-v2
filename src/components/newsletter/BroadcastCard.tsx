import Link from "next/link";
import { format } from "date-fns";
import { issueDate, type NewsletterIssue } from "@/types/newsletter-types";

type BroadcastCardProps = {
  issue: NewsletterIssue;
};

/**
 * Text-first newsletter card: send date as the visual anchor, trimmed
 * subject line, optional preview text. No image area — newsletters are
 * not image-driven.
 */
export function BroadcastCard({ issue }: BroadcastCardProps) {
  return (
    <Link
      className="group flex h-full flex-col rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
      href={`/newsletter/${issue.date}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px w-6 bg-accent/60" />
        <time className="text-caption text-muted-foreground" dateTime={issue.date}>
          {format(issueDate(issue), "MMM d, yyyy")}
        </time>
      </div>

      <h3 className="mb-2 line-clamp-2 text-heading font-semibold tracking-tight transition-colors group-hover:text-primary">
        {issue.subject}
      </h3>

      {issue.preview && (
        <p className="line-clamp-2 text-body text-muted-foreground">
          {issue.preview}
        </p>
      )}
    </Link>
  );
}
