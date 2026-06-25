// src/app/(main)/tools/grind-size-converter/layout.tsx
import { PageShell } from "@/components/primitives/page-shell";

/** Shared page shell wrapper for the grind size converter route. */
export default function GrindSizeConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
