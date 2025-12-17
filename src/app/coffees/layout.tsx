import { PageShell } from "@/components/page-shell";

export default function CoffeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
