// Server component: fetches totals for the control hero.
import { fetchPublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import { HeroControl } from "./HeroControl";

export default async function HeroSection() {
  const totals = await fetchPublicDirectoryTotals();

  return <HeroControl totals={totals} />;
}
