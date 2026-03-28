import Link from "next/link";
import { fetchRecentAdditions } from "@/lib/data/fetch-recent-additions";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";

function DotDivider() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />;
}

export default async function NewAdditionsStrip() {
  const { newCoffees, newRoasters } = await fetchRecentAdditions();

  if (newCoffees.length === 0 && newRoasters.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-border/40 bg-foreground text-background">
      <Marquee
        className="[--duration:45s] py-3 [--gap:2rem]"
        pauseOnHover
        repeat={3}
      >
        {newCoffees.map((group) => (
          <div
            className="inline-flex items-center gap-3 whitespace-nowrap"
            key={group.roasterSlug}
          >
            <Badge
              className="bg-accent text-accent-foreground hover:bg-accent"
              variant="secondary"
            >
              <span className="text-overline">NEW PRODUCTS</span>
            </Badge>
            <Link
              className="text-caption !font-bold underline-offset-4 hover:underline"
              href={`/roasters/${group.roasterSlug}`}
            >
              {group.roasterName}
            </Link>
            <span className="text-background/70">-</span>
            <span className="text-caption text-background/90">
              {group.coffees.map((coffee, index) => (
                <span key={coffee.slug}>
                  {index > 0 ? ", " : ""}
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={`/roasters/${group.roasterSlug}/coffees/${coffee.slug}`}
                  >
                    {coffee.name}
                  </Link>
                </span>
              ))}
            </span>
            <DotDivider />
          </div>
        ))}

        {newRoasters.map((roaster) => (
          <div
            className="inline-flex items-center gap-3 whitespace-nowrap"
            key={roaster.slug}
          >
            <Badge
              className="bg-background/10 text-background hover:bg-background/10"
              variant="secondary"
            >
              <span className="text-overline">NEW ROASTER</span>
            </Badge>
            <Link
              className="text-caption !font-bold underline-offset-4 hover:underline"
              href={`/roasters/${roaster.slug}`}
            >
              {roaster.name}
            </Link>
            <span className="text-label text-background/70">
              added in last 2 weeks
            </span>
            <DotDivider />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
