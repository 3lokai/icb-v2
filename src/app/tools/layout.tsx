// src/app/tools/layout.tsx
import { PageShell } from "@/components/primitives/page-shell";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
