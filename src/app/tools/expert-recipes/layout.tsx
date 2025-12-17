// src/app/tools/expert-recipes/layout.tsx
import { PageShell } from "@/components/page-shell";

export default function ExpertRecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
