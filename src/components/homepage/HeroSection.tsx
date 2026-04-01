// Server component: fetches totals; variant switch is client-only (PostHog flags).
import { fetchPublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import { HeroSectionClient } from "./HeroSectionClient";

export default async function HeroSection() {
  const totals = await fetchPublicDirectoryTotals();

  return <HeroSectionClient totals={totals} />;
}
