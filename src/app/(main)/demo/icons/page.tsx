import type { ComponentType, SVGProps } from "react";
import { FrenchPressIllustration } from "@/components/icons/FrenchPressIllustration";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

type IllustrationDemo = {
  slug: string;
  name: string;
  /** Where to extend the catalogue */
  sourcePath: string;
  Component: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional subtitle for UX notes */
  description?: string;
};

const ILLUSTRATION_DEMOS = [
  {
    slug: "french-press",
    name: "French press",
    sourcePath: "src/components/icons/FrenchPressIllustration.tsx",
    description:
      "Uses globals.css tokens (var + color-mix). Mirror updates in public/icons/french-press.svg when changing paths.",
    Component: FrenchPressIllustration,
  },
] satisfies ReadonlyArray<IllustrationDemo>;

export default function IconsDemoPage() {
  return (
    <>
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="2">
            <h1 className="text-title">Icons demo</h1>
            <p className="text-body text-muted-foreground max-w-2xl">
              Inline SVG illustrations that inherit theme colours. Append new
              entries to{" "}
              <code className="rounded bg-muted px-1 py-px text-caption">
                ILLUSTRATION_DEMOS
              </code>{" "}
              on this page.
            </p>
          </Stack>
        </PageShell>
      </Section>

      <Section spacing="default" contained={false}>
        <PageShell>
          <div className="grid gap-6 sm:grid-cols-2">
            {ILLUSTRATION_DEMOS.map(
              ({
                slug,
                name,
                sourcePath,
                description,
                Component,
              }: IllustrationDemo) => (
                <article
                  key={slug}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <Stack gap="4">
                    <Stack gap="1">
                      <h2 className="font-semibold tracking-tight text-foreground">
                        {name}
                      </h2>
                      <p className="break-all font-mono text-caption text-muted-foreground">
                        {sourcePath}
                      </p>
                      {description ? (
                        <p className="text-caption text-muted-foreground">
                          {description}
                        </p>
                      ) : null}
                    </Stack>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <DemoSwatch Component={Component} variant="muted" />
                      <DemoSwatch Component={Component} variant="elevated" />
                    </div>
                  </Stack>
                </article>
              )
            )}
          </div>
        </PageShell>
      </Section>
    </>
  );
}

function DemoSwatch({
  Component,
  variant,
}: {
  Component: ComponentType<SVGProps<SVGSVGElement>>;
  variant: "muted" | "elevated";
}) {
  return (
    <div
      className={cn(
        "flex aspect-square flex-col items-center justify-center rounded-lg p-4",
        variant === "muted" && "bg-muted/60",
        variant === "elevated" && "bg-background ring-1 ring-border"
      )}
    >
      <span className="mb-2 text-caption uppercase tracking-wide text-muted-foreground">
        {variant === "muted" ? "On muted" : "On background"}
      </span>
      <Component
        aria-hidden
        className="h-20 w-auto max-w-full shrink-0"
        focusable="false"
      />
    </div>
  );
}
