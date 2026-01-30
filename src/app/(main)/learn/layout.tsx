import { PageShell } from "@/components/primitives/page-shell";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
