import "server-only";

/**
 * Transient network errors seen when the dev server / serverless runtime talks
 * to Supabase. undici reuses keep-alive sockets that the remote has already
 * closed, surfacing as ECONNRESET (read) / ECONNABORTED (write) / "fetch failed".
 * A retry is only safe for idempotent methods (GET/HEAD): a connection can drop
 * *after* the server processed a write, so replaying a POST/PATCH/DELETE/RPC
 * risks duplicating the mutation. Retries are therefore limited to GET/HEAD
 * (see `retryFetch` below); all other methods fail fast on the first error.
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
 * Resolve the HTTP method for a fetch call, mirroring the platform default of
 * GET when none is supplied. Handles both `fetch(url, { method })` and
 * `fetch(new Request(url, { method }))` forms.
 */
function resolveMethod(input: RequestInfo | URL, init?: RequestInit): string {
  if (init?.method) {
    return init.method.toUpperCase();
  }
  if (input instanceof Request) {
    return input.method.toUpperCase();
  }
  return "GET";
}

/**
 * Drop-in replacement for `fetch` that retries only on transient connection
 * errors with short exponential backoff, and only for idempotent methods
 * (GET/HEAD) so mutations are never replayed. HTTP error responses (4xx/5xx)
 * are returned as-is — Supabase surfaces those in its `{ error }` payload and
 * they are not connection failures.
 */
export const retryFetch: typeof fetch = async (input, init) => {
  const method = resolveMethod(input, init);
  const isIdempotent = method === "GET" || method === "HEAD";
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;

      if (
        attempt === MAX_ATTEMPTS ||
        !isIdempotent ||
        !isTransientError(error)
      ) {
        throw error;
      }

      await delay(BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }

  // Unreachable — the loop either returns or throws — but satisfies the type.
  throw lastError;
};
