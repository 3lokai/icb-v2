import { Accent } from "@/components/primitives/accent";
import { Stack } from "@/components/primitives/stack";
import RoasterCard from "@/components/cards/RoasterCard";
import type { SimilarRoaster } from "@/types/roaster-types";

type SimilarRoastersProps = {
  roasters: SimilarRoaster[];
  roasterName: string;
};

/**
 * "Roasters like this one" — links each roaster profile to the handful of profiles
 * with the closest actual profile: what they specialise in, how they source, and what
 * the catalogue is made of (process / roast / species / varieties).
 *
 * Deliberately not "more roasters from {state}". Geography is the one axis a reader
 * can already see, and state buckets would leave Bangalore with 19 mutually-linked
 * profiles and a long tail of 1s linking to nobody — the opposite of the orphaned-
 * profile problem this block exists to fix.
 *
 * Matching and ranking are precomputed in the `roaster_similar` materialized view and
 * arrive on the roaster payload; there is nothing to compute here. `shared_tags` is
 * already filtered to the discriminating traits, so it renders as the reason for the
 * match. The similarity score is never shown — it is not meaningful to a reader.
 */
export function SimilarRoasters({
  roasters,
  roasterName,
}: SimilarRoastersProps) {
  // A row missing slug or name would render a dead link and an empty heading.
  const matches = roasters.filter((r) => r.slug && r.name);

  if (matches.length === 0) {
    return null;
  }

  return (
    <Stack gap="6">
      <div>
        <div className="inline-flex items-center gap-4 mb-3">
          <span className="h-px w-8 bg-accent/60" />
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            Similar profile
          </span>
        </div>
        <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
          Roasters like <Accent>{roasterName}</Accent>
        </h2>
        <p className="text-caption text-muted-foreground">
          Matched on what they roast and how they source — not on where they are
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {matches.map((roaster) => (
          <RoasterCard key={roaster.slug} roaster={roaster} variant="similar" />
        ))}
      </div>
    </Stack>
  );
}
