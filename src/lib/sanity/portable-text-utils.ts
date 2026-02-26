/**
 * Extract plain text from Portable Text blocks for SEO schema (HowTo, Recipe).
 */

function extractTextFromBlock(block: unknown): string {
  if (!block || typeof block !== "object") return "";
  const b = block as Record<string, unknown>;
  if (b._type === "block" && Array.isArray(b.children)) {
    return (b.children as Array<{ text?: string }>)
      .map((c) => c?.text ?? "")
      .join("");
  }
  return "";
}

function extractTextFromBlocks(blocks: unknown[]): string {
  return blocks.map(extractTextFromBlock).join(" ").trim();
}

export type ExtractedStep = {
  text: string;
  name?: string;
  time?: string;
};

/**
 * Extract steps from article body (stepList blocks) for HowTo/Recipe schema.
 */
export function extractStepsFromBody(body: unknown[]): ExtractedStep[] {
  const steps: ExtractedStep[] = [];
  for (const block of body) {
    if (
      block &&
      typeof block === "object" &&
      (block as Record<string, unknown>)._type === "stepList"
    ) {
      const stepList = block as {
        steps?: Array<{
          title?: string;
          content?: unknown[];
          time?: string;
        }>;
      };
      for (const step of stepList.steps ?? []) {
        const text = Array.isArray(step.content)
          ? extractTextFromBlocks(step.content)
          : "";
        if (text || step.title) {
          steps.push({
            text: text || step.title || "",
            name: step.title,
            time: step.time,
          });
        }
      }
    }
  }
  return steps;
}
