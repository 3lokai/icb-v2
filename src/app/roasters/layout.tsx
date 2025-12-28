import { PageShell } from "@/components/primitives/page-shell";

export default function RoastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
