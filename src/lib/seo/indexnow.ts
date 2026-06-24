/**
 * IndexNow submission utility
 *
 * Notifies participating search engines (Bing, Yandex, Seznam, Naver, Yep…)
 * that URLs were added or changed, so they re-crawl within seconds instead of
 * days. Google does not participate.
 *
 * Like the Slack notifier, this is fire-and-forget and never throws — indexing
 * pings must never break the calling code.
 *
 * @see https://www.indexnow.org/documentation
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.com/indexnow";
// IndexNow accepts at most 10,000 URLs per request.
const MAX_URLS_PER_REQUEST = 10_000;
// Abort a stalled submission so it can't hang the calling request.
const REQUEST_TIMEOUT_MS = 10_000;

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
}

/**
 * Submit a list of absolute URLs to IndexNow.
 *
 * Skips silently (with a warning) when the key is not configured. De-dupes,
 * drops URLs that don't belong to our host, and splits into 10k chunks.
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_API_KEY;
  if (!key) {
    // Keep in production — indicates a configuration gap, not a runtime error.
    console.warn(
      "[IndexNow] INDEXNOW_API_KEY not configured - skipping submission"
    );
    return;
  }

  const baseUrl = getBaseUrl();
  let host: string;
  try {
    host = new URL(baseUrl).host;
  } catch {
    console.error(`[IndexNow] Invalid base URL: ${baseUrl}`);
    return;
  }

  // De-dupe and keep only on-host URLs (IndexNow rejects mixed hosts with 422).
  const urlList = Array.from(new Set(urls)).filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });

  if (urlList.length === 0) {
    return;
  }

  const keyLocation = `${baseUrl.replace(/\/$/, "")}/${key}.txt`;

  for (let i = 0; i < urlList.length; i += MAX_URLS_PER_REQUEST) {
    const batch = urlList.slice(i, i + MAX_URLS_PER_REQUEST);
    try {
      const response = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          host,
          key,
          keyLocation,
          urlList: batch,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      // 200 OK and 202 Accepted (validation pending) both mean success.
      if (response.status !== 200 && response.status !== 202) {
        const errorText = await response.text().catch(() => "");
        console.error(
          `[IndexNow] Submission failed: ${response.status} ${response.statusText}${
            errorText ? ` - ${errorText.substring(0, 200)}` : ""
          }`
        );
      } else if (process.env.NODE_ENV === "development") {
        console.log(`[IndexNow] Submitted ${batch.length} URL(s)`);
      }
    } catch (error) {
      // Never throw — indexing pings are non-critical.
      console.error(
        "[IndexNow] Failed to submit:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
