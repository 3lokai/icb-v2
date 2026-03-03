// src/app/(main)/tools/coffee-compass/layout.tsx
import { PageShell } from "@/components/primitives/page-shell";

export default function CoffeeCompassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
