/**
 * Returns a client-safe error message.
 *
 * In development the underlying error message is surfaced to aid debugging.
 * In production we return a generic fallback so internal details — Postgres
 * error text, constraint/column names, query structure — never reach API
 * clients. The real error should still be logged server-side via console.error.
 */
export function safeErrorMessage(error: unknown, fallback: string): string {
  if (
    process.env.NODE_ENV === "development" &&
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }
  return fallback;
}
