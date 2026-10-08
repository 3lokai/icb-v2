"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { Band } from "@/components/primitives/band";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { capture } from "@/lib/posthog";
import {
  BADGE_DIMENSIONS,
  BADGE_SIZES,
  BADGE_THEMES,
  BADGE_TYPE_LABELS,
  MIN_RATINGS_FOR_BADGE,
  badgeAlt,
  badgeEmbedHtml,
  badgeImagePath,
  badgeTypesFor,
  hasBadgeRating,
  type BadgeData,
  type BadgePlacement,
  type BadgeSize,
  type BadgeTarget,
  type BadgeTheme,
  type BadgeType,
} from "@/lib/badges/badges";
import type { BadgeCoffee } from "@/lib/data/fetch-badge-data";

type Props = {
  siteUrl: string;
  roasterSlug: string;
  roasterRating: BadgeData;
  coffees: BadgeCoffee[];
};

type Look = { type: BadgeType; theme: BadgeTheme; size: BadgeSize };

/** Per-badge settings. Defaults are the recommendation; most never change them. */
function useLook(type: BadgeType) {
  return useState<Look>({ type, theme: "light", size: "standard" });
}

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
  format = (v) => v.charAt(0).toUpperCase() + v.slice(1),
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label text-muted-foreground">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-1"
      >
        {options.map((o) => (
          <Button
            key={o}
            type="button"
            size="sm"
            role="radio"
            aria-checked={o === value}
            variant={o === value ? "default" : "outline"}
            onClick={() => onChange(o)}
          >
            {format(o)}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Preview({ target, look }: { target: BadgeTarget; look: Look }) {
  const { width, height } = BADGE_DIMENSIONS[look.size];
  return (
    // Hosted SVG, exactly what the merchant's page will load (§19).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={badgeImagePath(target, look)}
      alt={badgeAlt(target.entity, look.type)}
      width={width}
      height={height}
      className="max-w-none"
    />
  );
}

/** Button copy says what the badge will actually show today. */
function copyLabel(target: BadgeTarget, type: BadgeType, data: BadgeData) {
  if (type === "rate") {
    if (hasBadgeRating(data)) return "Copy rating badge";
    return target.entity === "coffee"
      ? "Copy “Rate this coffee”"
      : "Copy “Rate us”";
  }
  if (type === "listed") return "Copy “Listed” badge";
  return "Copy badge";
}

function BadgeControls({
  siteUrl,
  target,
  data,
  look,
  setLook,
  placement,
  onCopied,
}: {
  siteUrl: string;
  target: BadgeTarget;
  data: BadgeData;
  look: Look;
  setLook: (l: Look) => void;
  /** Fixed per section: click reports only, not worth a visible control. */
  placement: BadgePlacement;
  onCopied: () => void;
}) {
  const opts = { ...look, placement };
  const imageUrl = `${siteUrl}${badgeImagePath(target, look)}`;
  const track = (action: string) =>
    capture("badge_kit_action", {
      action,
      entity_type: target.entity,
      roaster_slug: target.roasterSlug,
      coffee_slug: target.entity === "coffee" ? target.coffeeSlug : null,
      badge_type: look.type,
      theme: look.theme,
      size: look.size,
      placement,
    });
  const copy = async (text: string, action: string) => {
    try {
      await navigator.clipboard.writeText(text);
      track(action);
      return true;
    } catch {
      toast.error("Couldn't copy — select the text and copy it manually");
      return false;
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        size="sm"
        className="whitespace-nowrap"
        onClick={async () => {
          if (await copy(badgeEmbedHtml(siteUrl, target, opts), "copy_embed"))
            onCopied();
        }}
      >
        {/* Full label needs room; phones get the verb, the preview says the rest. */}
        <span className="sm:hidden">Copy</span>
        <span className="hidden sm:inline">
          {copyLabel(target, look.type, data)}
        </span>
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon-sm" variant="outline" aria-label="Customize badge">
            <DotsThreeIcon weight="bold" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex w-80 flex-col gap-4">
          <Choice
            label="Badge"
            options={badgeTypesFor(target.entity)}
            value={look.type}
            onChange={(type) => setLook({ ...look, type })}
            format={(t) => BADGE_TYPE_LABELS[t]}
          />
          <Choice
            label="Theme"
            options={BADGE_THEMES}
            value={look.theme}
            onChange={(theme) => setLook({ ...look, theme })}
          />
          <Choice
            label="Size"
            options={BADGE_SIZES}
            value={look.size}
            onChange={(size) => setLook({ ...look, size })}
          />
          <div className="flex gap-1.5 border-t border-border pt-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                if (await copy(imageUrl, "copy_url"))
                  toast.success("Badge URL copied");
              }}
            >
              Copy badge URL
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a
                href={imageUrl}
                download={`icb-${target.entity === "coffee" ? target.coffeeSlug : target.roasterSlug}-${look.type}.svg`}
                onClick={() => track("download_svg")}
              >
                Download SVG
              </a>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CoffeeRow({
  siteUrl,
  roasterSlug,
  coffee,
  onCopied,
}: {
  siteUrl: string;
  roasterSlug: string;
  coffee: BadgeCoffee;
  onCopied: () => void;
}) {
  const [look, setLook] = useLook("rate");
  const target: BadgeTarget = {
    entity: "coffee",
    roasterSlug,
    coffeeSlug: coffee.slug,
  };
  const rating =
    coffee.ratingCount > 0 && coffee.ratingAvg != null
      ? `★ ${coffee.ratingAvg.toFixed(1)} · ${coffee.ratingCount}`
      : "No ratings yet";

  return (
    <tr className="border-t border-border/60 align-middle first:border-t-0">
      <td className="px-4 py-3">
        <Link
          href={`/roasters/${roasterSlug}/coffees/${coffee.slug}`}
          className="font-medium hover:underline underline-offset-4"
        >
          {coffee.name}
        </Link>
        <div className="mt-1 flex flex-wrap gap-x-3 text-caption text-muted-foreground">
          {/* Rating column is hidden on phones; show it here instead. */}
          <span className="sm:hidden">{rating}</span>
          {coffee.status === "seasonal" && <span>Seasonal</span>}
          {coffee.sourceUrl && (
            <a
              href={coffee.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4"
            >
              Matched to store product ✓
            </a>
          )}
        </div>
      </td>
      <td className="hidden px-4 py-3 whitespace-nowrap text-muted-foreground sm:table-cell">
        {rating}
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <Preview target={target} look={look} />
      </td>
      <td className="px-4 py-3">
        <BadgeControls
          siteUrl={siteUrl}
          target={target}
          data={coffee}
          look={look}
          setLook={setLook}
          placement="product-page"
          onCopied={onCopied}
        />
      </td>
    </tr>
  );
}

function InstallDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Where to paste it</DialogTitle>
          <DialogDescription>
            Coffee badges go on the matching product page, near reviews or
            tasting notes. The store badge fits your footer or About page.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 text-body">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-medium">Shopify</h3>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-0.5">
              <li>Online Store → Themes → Customize.</li>
              <li>Open the product template, a page, or the footer.</li>
              <li>Add block → Custom Liquid.</li>
              <li>Paste the embed and Save.</li>
            </ol>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-medium">WooCommerce / WordPress</h3>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-0.5">
              <li>Edit the product, page or template.</li>
              <li>Add a Custom HTML block.</li>
              <li>Paste the embed, then Publish / Update.</li>
            </ol>
          </div>
          <p className="text-caption text-muted-foreground">
            Webflow or plain HTML: paste it into an Embed / HTML element.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Keeps the store-badge section reachable on large catalogues. */
const INITIAL_ROWS = 10;

export function RoasterBadges({
  siteUrl,
  roasterSlug,
  roasterRating,
  coffees,
}: Props) {
  const [installOpen, setInstallOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? coffees : coffees.slice(0, INITIAL_ROWS);
  const [storeLook, setStoreLook] = useLook("listed");
  const storeTarget: BadgeTarget = { entity: "roaster", roasterSlug };

  const onCopied = () =>
    toast.success("Embed copied", {
      description: "Using Shopify or WooCommerce?",
      action: {
        label: "Where to paste it",
        onClick: () => setInstallOpen(true),
      },
    });

  const pasteHelp = (
    <button
      type="button"
      onClick={() => setInstallOpen(true)}
      className="text-accent hover:underline underline-offset-4"
    >
      Where do I paste this?
    </button>
  );

  return (
    <>
      <Band id="coffee-badges" maxWidth="6xl">
        <Section
          contained={false}
          className="py-0"
          eyebrow="Recommended · Product pages"
          title="Collect ratings on"
          accentWord="every coffee."
          description={
            <>
              ICB already lists {coffees.length}{" "}
              {coffees.length === 1 ? "coffee" : "coffees"} from your catalogue,
              each with its own badge. It asks customers to rate the coffee,
              then adds its score once it has {MIN_RATINGS_FOR_BADGE} ratings,
              with no re-pasting. {pasteHelp}
            </>
          }
        >
          {coffees.length === 0 ? (
            <p className="text-body text-muted-foreground">
              No active coffees are listed yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-body">
                <thead className="border-b border-border text-overline uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Coffee</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                      ICB rating
                    </th>
                    <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                      Badge
                    </th>
                    <th className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c) => (
                    <CoffeeRow
                      key={c.id}
                      siteUrl={siteUrl}
                      roasterSlug={roasterSlug}
                      coffee={c}
                      onCopied={onCopied}
                    />
                  ))}
                </tbody>
              </table>
              {visible.length < coffees.length && (
                <div className="border-t border-border/60 p-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(true)}
                  >
                    Show all {coffees.length} coffees
                  </Button>
                </div>
              )}
            </div>
          )}
        </Section>
      </Band>

      <Band id="store-badge" ground="warm" texture="grain" maxWidth="6xl">
        <Section
          contained={false}
          className="py-0"
          eyebrow="Footer · About page"
          title="Show your ICB"
          accentWord="profile."
          description="One badge for your whole store, linking customers to your roaster page on IndianCoffeeBeans."
        >
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5 md:flex-row md:items-center md:justify-between">
            <Preview target={storeTarget} look={storeLook} />
            <BadgeControls
              siteUrl={siteUrl}
              target={storeTarget}
              data={roasterRating}
              look={storeLook}
              setLook={setStoreLook}
              placement="footer"
              onCopied={onCopied}
            />
          </div>
        </Section>
      </Band>

      <InstallDialog open={installOpen} onOpenChange={setInstallOpen} />
    </>
  );
}
