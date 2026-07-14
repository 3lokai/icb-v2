/**
 * Kit (ConvertKit) v4 broadcast — a sent newsletter.
 *
 * Slim listing responses omit `content`, `public_url`, `email_address`,
 * `email_template`, and `subscriber_filter`; those fields are only present
 * when fetching a single broadcast by ID.
 */
export interface KitBroadcast {
  id: number;
  created_at: string;
  subject: string;
  preview_text: string | null;
  description: string | null;
  public: boolean;
  published_at: string | null;
  send_at: string | null;
  thumbnail_url: string | null;
  status: string;
  content?: string | null;
  public_url?: string | null;
}

/** Display date for a broadcast: send date, falling back to publish date. */
export function broadcastDate(broadcast: KitBroadcast): Date | null {
  const raw = broadcast.send_at ?? broadcast.published_at;
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
