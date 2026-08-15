import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/content/newsletters/index.json";
import type { NewsletterIssue } from "@/types/newsletter-types";

/**
 * The newsletter archive is static: issues live in src/content/newsletters as
 * <date>.html plus an index.json manifest, written by the newsletter pipeline
 * when an issue is pushed to Notifuse. Nothing here hits an email API, and the
 * /newsletter pages are fully prerendered, so these files are only read at build.
 */

/** All issues, newest first. */
export function listNewsletters(): NewsletterIssue[] {
  return manifest as NewsletterIssue[];
}

export function getNewsletter(date: string): NewsletterIssue | null {
  return listNewsletters().find((issue) => issue.date === date) ?? null;
}

/**
 * The issue's email HTML. Throws if the manifest lists an issue whose file is
 * missing — that fails the build rather than shipping an empty archive page.
 */
export async function getNewsletterHtml(date: string): Promise<string> {
  return readFile(
    path.join(process.cwd(), "src/content/newsletters", `${date}.html`),
    "utf8"
  );
}
