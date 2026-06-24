// src/app/(main)/tools/grind-size-converter/layout.tsx
import { PageShell } from "@/components/primitives/page-shell";

export default function GrindSizeConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
