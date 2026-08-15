import "server-only";

/**
 * Notifuse newsletter list membership.
 *
 * Contacts are keyed by email (external_id = user_profiles.id when known), so
 * there is no subscriber ID to store. Both calls are fire-and-forget: a Notifuse
 * outage must never fail a form submission or a preferences save.
 */

// `lists.unsubscribe` is the *public* one-click endpoint (wid/email/lids + HMAC,
// meant for links inside emails). Server-side we flip the membership status on
// the authenticated endpoint instead.
const LIST_ENDPOINTS = {
  subscribe: "lists.subscribe",
  unsubscribe: "contactLists.updateStatus",
} as const;

function config() {
  const apiUrl = process.env.NOTIFUSE_API_URL?.replace(/\/+$/, "");
  const apiKey = process.env.NOTIFUSE_API_KEY;
  const workspaceId = process.env.NOTIFUSE_WORKSPACE_ID;
  const listId = process.env.NOTIFUSE_NEWSLETTER_ONLY_LIST_ID;

  if (!apiUrl || !apiKey || !workspaceId || !listId) {
    console.warn("[Notifuse] not configured, skipping newsletter list call");
    return null;
  }
  return { apiUrl, apiKey, workspaceId, listId };
}

async function post(
  action: keyof typeof LIST_ENDPOINTS,
  body: (cfg: NonNullable<ReturnType<typeof config>>) => unknown
): Promise<void> {
  const cfg = config();
  if (!cfg) return;

  try {
    const res = await fetch(`${cfg.apiUrl}/api/${LIST_ENDPOINTS[action]}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify(body(cfg)),
    });
    if (!res.ok) {
      console.error(
        `[Notifuse] ${LIST_ENDPOINTS[action]} error`,
        res.status,
        await res.text()
      );
    }
  } catch (err) {
    console.error(`[Notifuse] ${LIST_ENDPOINTS[action]} unreachable`, err);
  }
}

export async function subscribeToNewsletterList(
  email: string,
  opts?: { externalId?: string | null; fullName?: string | null }
): Promise<void> {
  const address = email.toLowerCase().trim();
  return post("subscribe", (cfg) => ({
    workspace_id: cfg.workspaceId,
    contact: {
      email: address,
      ...(opts?.externalId && { external_id: opts.externalId }),
      ...(opts?.fullName && { full_name: opts.fullName }),
    },
    list_ids: [cfg.listId],
  }));
}

export async function unsubscribeFromNewsletterList(
  email: string
): Promise<void> {
  const address = email.toLowerCase().trim();
  return post("unsubscribe", (cfg) => ({
    workspace_id: cfg.workspaceId,
    email: address,
    list_id: cfg.listId,
    status: "unsubscribed",
  }));
}
