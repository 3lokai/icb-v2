import "server-only";

/**
 * Transient network errors seen when the dev server / serverless runtime talks
 * to Supabase. undici reuses keep-alive sockets that the remote has already
 * closed, surfacing as ECONNRESET (read) / ECONNABORTED (write) / "fetch failed".
 * These are safe to retry — the request never reached a handler, so a retry is
 * not a duplicate mutation risk for the idempotent reads that dominate here.
 */
const TRANSIENT_PATTERNS = [
  "ECONNRESET",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "EPIPE",
  "UND_ERR", // undici: UND_ERR_SOCKET, UND_ERR_CONNECT_TIMEOUT, etc.
  "fetch failed",
  "terminated",
  "other side closed",
];

function isTransientError(error: unknown): boolean {
  if (!error) {
    return false;
  }
  const parts: string[] = [];
  let current: unknown = error;
  // Walk the cause chain — undici nests the real socket error under `cause`.
  for (let depth = 0; current && depth < 5; depth++) {
    if (current instanceof Error) {
      parts.push(current.message);
      const code = (current as NodeJS.ErrnoException).code;
      if (code) {
        parts.push(code);
      }
      current = (current as { cause?: unknown }).cause;
    } else {
      parts.push(String(current));
      break;
    }
  }
  const haystack = parts.join(" ");
  return TRANSIENT_PATTERNS.some((p) => haystack.includes(p));
}

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 150;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Drop-in replacement for `fetch` that retries only on transient connection
 * errors with short exponential backoff. HTTP error responses (4xx/5xx) are
 * returned as-is — Supabase surfaces those in its `{ error }` payload and they
 * are not connection failures.
 */
export const retryFetch: typeof fetch = async (input, init) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;

      if (attempt === MAX_ATTEMPTS || !isTransientError(error)) {
        throw error;
      }

      await delay(BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }

  // Unreachable — the loop either returns or throws — but satisfies the type.
  throw lastError;
};
