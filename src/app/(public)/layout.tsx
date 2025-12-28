import { PageShell } from "@/components/primitives/page-shell";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
