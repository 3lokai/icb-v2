// src/app/tools/coffee-calculator/layout.tsx
import { PageShell } from "@/components/primitives/page-shell";

export default function CoffeeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
