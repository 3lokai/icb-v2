/**
 * A sent newsletter issue, as recorded in src/content/newsletters/index.json.
 *
 * The archive is file-backed: `date` is both the slug (`/newsletter/<date>`)
 * and the display date, and `<date>.html` next to the manifest holds the email
 * HTML exactly as it went out.
 */
export interface NewsletterIssue {
  date: string;
  subject: string;
  preview: string;
  /** Kit broadcast id — only on issues sent before the move to Notifuse. */
  kitId?: number;
}

/** Display date for an issue. */
export function issueDate(issue: NewsletterIssue): Date {
  return new Date(`${issue.date}T00:00:00Z`);
}
