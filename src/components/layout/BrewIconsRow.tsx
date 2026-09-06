import Image from "next/image";
import Link from "next/link";
import { BREW_METHOD_LABELS } from "@/lib/discovery/brew-method-labels";

type BrewIcon = { label: string; image: string; href: string };

// The 9 curated discovery pages (see brew-method-pages.ts) plus the 4 extra
// brew_methods facets from the DB (drip, turkish, channi, syphon) that don't
// have a dedicated landing page yet, linked to the filtered directory instead.
const BREW_ICONS: BrewIcon[] = [
  {
    label: BREW_METHOD_LABELS.v60,
    image: "/images/brew-icons/v60.avif",
    href: "/coffees/v60",
  },
  {
    label: BREW_METHOD_LABELS.aeropress,
    image: "/images/brew-icons/aeropress.avif",
    href: "/coffees/aeropress",
  },
  {
    label: BREW_METHOD_LABELS.chemex,
    image: "/images/brew-icons/chemex.avif",
    href: "/coffees/chemex",
  },
  {
    label: BREW_METHOD_LABELS.kalita,
    image: "/images/brew-icons/kalita.avif",
    href: "/coffees/kalita",
  },
  {
    label: BREW_METHOD_LABELS["french-press"],
    image: "/images/brew-icons/french_press.avif",
    href: "/coffees/french-press",
  },
  {
    label: BREW_METHOD_LABELS["filter-coffee"],
    image: "/images/brew-icons/filter_coffee.avif",
    href: "/coffees/filter-coffee",
  },
  {
    label: BREW_METHOD_LABELS.espresso,
    image: "/images/brew-icons/espresso.avif",
    href: "/coffees/espresso",
  },
  {
    label: BREW_METHOD_LABELS["cold-brew"],
    image: "/images/brew-icons/cold_brew.avif",
    href: "/coffees/cold-brew",
  },
  {
    label: BREW_METHOD_LABELS["moka-pot"],
    image: "/images/brew-icons/moka_pot.avif",
    href: "/coffees/moka-pot",
  },
  {
    label: "Drip Machine",
    image: "/images/brew-icons/drip.avif",
    href: "/coffees?brewMethodIds=drip",
  },
  {
    label: "Turkish",
    image: "/images/brew-icons/turkish.avif",
    href: "/coffees?brewMethodIds=turkish",
  },
  {
    label: "Channi",
    image: "/images/brew-icons/channi.avif",
    href: "/coffees?brewMethodIds=channi",
  },
  {
    label: "Syphon",
    image: "/images/brew-icons/syphon.avif",
    href: "/coffees?brewMethodIds=syphon",
  },
];

/**
 * A quiet, no-background row of brew method icons sitting between the
 * footer's main grid and the legal bar — static (no marquee, no heading),
 * just a small hover zoom.
 */
export function BrewIconsRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {BREW_ICONS.map((brew) => (
        <Link
          aria-label={brew.label}
          className="group relative block h-8 w-8 shrink-0 sm:h-9 sm:w-9 md:h-10 md:w-10"
          href={brew.href}
          key={brew.label}
          title={brew.label}
        >
          <Image
            alt=""
            className="object-contain transition-transform duration-200 group-hover:scale-125"
            fill
            sizes="(min-width: 768px) 40px, (min-width: 640px) 36px, 32px"
            src={brew.image}
          />
        </Link>
      ))}
    </div>
  );
}
