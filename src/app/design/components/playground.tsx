"use client";

import { Section as BaseSection } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { StarRating } from "@/components/common/StarRating";
import { QuickRating } from "@/components/reviews/QuickRating";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import type { CoffeeSummary } from "@/types/coffee-types";
import type { EntityReviewStats } from "@/types/review-types";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  BookOpenIcon,
  CheckIcon,
  CoffeeIcon,
  DesktopIcon,
  EnvelopeSimpleIcon,
  FunnelIcon,
  GearSixIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MoonIcon,
  PlusIcon,
  ShareNetworkIcon,
  SlidersHorizontalIcon,
  SpinnerGapIcon,
  StarIcon,
  SignOutIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "next-themes";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
] as const;
const SIZES = [
  ["sm", "32px"],
  ["default", "40px"],
  ["lg", "48px"],
] as const;
const ICON_SIZES = [
  ["icon-sm", "32px"],
  ["icon", "40px"],
  ["icon-lg", "48px"],
] as const;
// Card titles sit a full step above the blurb. text-heading (20px) was the same colour and
// almost the same size as the 16px paragraph, so the two read as one block.
const CARD_TITLE =
  "font-serif text-2xl font-normal leading-tight tracking-tight text-balance";
// Mirrors the focus-visible classes so the focus ring is visible in static screenshots.
const FOCUS_PREVIEW = "border-ring ring-[3px] ring-ring/50";
// Fields use a softer ring than buttons (owner feedback 2026-11-13).
const FIELD_FOCUS_PREVIEW = "border-ring ring-2 ring-ring/25";
// PROPOSED (07 2026-11-10, 20 §5, 25 B9): Rate is an accent outline; Buy is filled. A composition
// on the existing outline variant — no new Button variant until the role is approved.
const RATE_OUTLINE =
  "border-accent text-accent hover:bg-accent hover:text-accent-foreground dark:border-accent dark:hover:bg-accent dark:hover:text-accent-foreground";
const ROASTER = "Malnad Ridge"; // fictional sample roaster; neutral, no real brand spotlighted

// The REAL CoffeeCard renders here. No live coffee ID is supplied, so wishlist and
// rating mutations cannot be triggered from this visual review surface.
const SAMPLE_COFFEE: CoffeeSummary = {
  coffee_id: null,
  slug: "sample-natural",
  name: "Malnad Ridge Natural",
  display_name: "Malnad Ridge Natural",
  roaster_id: null,
  status: "active",
  process: "natural",
  process_raw: null,
  roast_level: "medium",
  roast_level_raw: null,
  roast_style_raw: null,
  direct_buy_url: null,
  has_250g_bool: true,
  has_sensory: false,
  in_stock_count: 1,
  min_price_in_stock: 450,
  best_variant_id: null,
  best_normalized_250g: 450,
  weights_available: [250],
  sensory_public: null,
  sensory_updated_at: null,
  decaf: false,
  is_limited: false,
  bean_species: "arabica",
  rating_avg: 4.3,
  rating_count: 12,
  tags: [],
  roaster_slug: "malnad-ridge-example",
  roaster_name: ROASTER,
  hq_city: "Chikmagalur",
  hq_state: "Karnataka",
  hq_country: "India",
  website: null,
  image_url: null,
  flavor_keys: ["chocolate", "mango"],
  brew_method_canonical_keys: ["v60"],
};

// Real coffee packaging, names and representative rating counts for visual QA.
// Coffee IDs are null: preview rating and wishlist controls cannot write to live data.
const IK = "https://ik.imagekit.io/indiancoffeebeans/products/";
const REAL_COFFEES: CoffeeSummary[] = [
  {
    ...SAMPLE_COFFEE,
    coffee_id: null,
    slug: "cold-brew-blend-light",
    name: "Amaltas Blend",
    display_name: "Amaltas Blend",
    roaster_slug: "blue-tokai-coffee",
    roaster_name: "Blue Tokai Coffee",
    roast_level: "light",
    process: "washed_natural",
    min_price_in_stock: 650,
    best_normalized_250g: 650,
    rating_avg: 3.73,
    rating_count: 11,
    image_url: `${IK}blue-tokai-coffee/blue-tokai-coffee-cold-brew-blend-light-1`,
    flavor_keys: ["blueberry", "fruit", "milk_chocolate"],
  },
  {
    ...SAMPLE_COFFEE,
    coffee_id: null,
    slug: "attikan-estate",
    name: "Attikan Estate",
    display_name: "Attikan Estate",
    roaster_slug: "blue-tokai-coffee",
    roaster_name: "Blue Tokai Coffee",
    roast_level: "medium_dark",
    process: "washed",
    min_price_in_stock: 700,
    best_normalized_250g: 700,
    rating_avg: 3.71,
    rating_count: 7,
    image_url: `${IK}blue-tokai-coffee/blue-tokai-coffee-attikan-estate-1`,
    flavor_keys: ["dark_chocolate", "figs", "roasted_almond"],
  },
  {
    ...SAMPLE_COFFEE,
    coffee_id: null,
    slug: "mogra-light-roast",
    name: "MOGRA",
    display_name: "Mogra",
    roaster_slug: "grey-soul-coffee-roasters",
    roaster_name: "Grey Soul Coffee Roasters",
    roast_level: "light",
    process: "anaerobic",
    has_250g_bool: false,
    weights_available: [200],
    min_price_in_stock: 799,
    best_normalized_250g: 998.75,
    rating_avg: 4.5,
    rating_count: 6,
    image_url: `${IK}grey-soul-coffee-roasters/grey-soul-coffee-roasters-mogra-light-roast-1`,
    flavor_keys: ["jasmine", "sweet_lime", "vanilla"],
  },
  {
    ...SAMPLE_COFFEE,
    coffee_id: null,
    slug: "kerehaklu-estate-blossom-culture-natural",
    name: "Kerehaklu Estate - Blossom Culture",
    display_name: "Kerehaklu Estate - Blossom Culture",
    roaster_slug: "blue-tokai-coffee",
    roaster_name: "Blue Tokai Coffee",
    roast_level: "light",
    process: "natural",
    has_250g_bool: false,
    weights_available: [200],
    min_price_in_stock: 1000,
    best_normalized_250g: 1250,
    rating_avg: null,
    rating_count: 0,
    is_limited: true,
    image_url: `${IK}blue-tokai-coffee/blue-tokai-coffee-kerehaklu-estate-blossom-culture-natural-1`,
    flavor_keys: ["orange_blossom", "pomegranate", "strawberry", "sun_melon"],
  },
];

const SECTIONS = [
  ["type", "Type & tokens"],
  ["buttons", "Button"],
  ["fields", "Input & Textarea"],
  ["cards", "Card"],
  ["icons", "Icons"],
  ["audit", "Overlays & controls"],
  ["surfaces", "Surfaces & motif"],
  ["ratings", "Ratings"],
  ["coffee-cards", "CoffeeCard"],
] as const;

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  // Site primitives own the rhythm; this page adds nothing of its own.
  return (
    <BaseSection
      className="scroll-mt-32"
      contained={false}
      description={note}
      id={id}
      title={title}
    >
      <Stack gap="8">{children}</Stack>
    </BaseSection>
  );
}

// Fictional reviewers and notes; nothing here is read from or written to the database.
const SAMPLE_STATS = {
  avg_rating: 4.3,
  review_count: 12,
  rating_count: 12,
  recommend_pct: 83,
} as EntityReviewStats;

const sampleReview = (
  id: string,
  name: string | null,
  rating: number,
  daysAgo: number,
  comment: string | null,
  extra: { brew_method?: "drip" | "aeropress"; milk?: boolean } = {}
) => ({
  id,
  entity_id: null,
  entity_type: "coffee" as const,
  identity_key: name ? `user:${id}` : `anon:${id}`,
  anon_id: null,
  user_id: null,
  rating,
  recommend: rating >= 4,
  comment,
  brew_method: extra.brew_method ?? null,
  works_with_milk: extra.milk ?? null,
  value_for_money: null,
  status: "active" as const,
  created_at: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
  updated_at: null,
  user_profiles: name
    ? { id, username: null, full_name: name, avatar_url: null }
    : null,
});

const SAMPLE_REVIEWS = [
  sampleReview(
    "r1",
    "Meera Iyer",
    5,
    2,
    "Jackfruit and cacao up front, very clean as it cools. Best at 1:16 on a V60.",
    { brew_method: "drip", milk: false }
  ),
  sampleReview("r2", "Arjun Rao", 4, 9, "Sweet and easy. Holds up with milk.", {
    brew_method: "aeropress",
    milk: true,
  }),
  sampleReview("r3", null, 3, 21, null),
  sampleReview(
    "r4",
    "Farah Khan",
    2,
    40,
    "Too roasty for the light roast on the label."
  ),
] as Parameters<typeof ReviewList>[0]["reviews"];

function InteractiveStars() {
  const [rating, setRating] = useState(0);
  return (
    <StarRating
      ariaLabel="Rate the sample coffee"
      interactive
      onRate={setRating}
      rating={rating}
      size="lg"
    />
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-medium text-caption">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const noopSubscribe = () => () => {};

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  // true on the client, false during SSR — avoids an aria-pressed hydration mismatch
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const options = [
    ["light", SunIcon, "Light"],
    ["dark", MoonIcon, "Dark"],
    ["system", DesktopIcon, "System"],
  ] as const;
  return (
    <div aria-label="Theme" className="flex gap-1" role="group">
      {options.map(([value, IconCmp, label]) => (
        <Button
          aria-pressed={mounted && theme === value}
          key={value}
          onClick={() => setTheme(value)}
          size="sm"
          variant={mounted && theme === value ? "secondary" : "ghost"}
        >
          <IconCmp />
          <span className="max-sm:sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}

function Swatch({ name, token }: { name: string; token: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-10 shrink-0 rounded-md border border-border"
        style={{ background: `var(${token})` }}
      />
      <span className="text-caption">
        <span className="block font-medium text-foreground">{name}</span>
        <code className="text-caption">{token}</code>
      </span>
    </div>
  );
}

export function ComponentPlayground() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const emailInvalid = email.length > 0 && !email.includes("@");
  // Real rule: isValidComment() in src/types/review-types.ts — optional, max 1,000 characters
  const notesInvalid = notes.length > 1000;

  const fakeSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  };

  return (
    <div
      className="min-h-dvh bg-background font-sans text-foreground"
      data-icb-playground
    >
      <header className="sticky top-0 z-40 border-border border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-heading">Component playground</p>
            <p className="truncate text-caption">
              Deep Roast · Gambetta / Ranade · real shadcn source · design
              branch only
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ThemeSwitch />
          </div>
        </div>
        <nav
          aria-label="Sections"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6"
        >
          {SECTIONS.map(([id, label]) => (
            <Button asChild key={id} size="sm" variant="ghost">
              <a href={`#${id}`}>{label}</a>
            </Button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl divide-y divide-border px-4 sm:px-6">
        <Section
          id="type"
          note="Tokens are bridged from system/icb-system.css onto the existing shadcn variables only while this page is mounted. globals.css is untouched."
          title="Type & tokens"
        >
          <div className="space-y-3">
            <p className="text-hero">
              Find, <em>rate</em>, buy.
            </p>
            <p className="text-display">Monsoon Malabar AA · Page display</p>
            <p className="text-heading">
              Ratnagiri Estate Natural · Coffee name / H3
            </p>
            <p className="max-w-prose">
              Ranade body. Grown at 1,100 m in the shade of silver oak in
              Chikmagalur, this natural-process lot leans towards ripe
              jackfruit, cacao nib and a long, dry finish.{" "}
              <a
                className="text-accent underline underline-offset-4"
                href="#type"
              >
                Inline link in accent
              </a>
              .
            </p>
            <p className="text-caption">Caption 14px · Secondary copy</p>
          </div>
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Geist-inspired type role specimens"
          >
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-ui-meta mb-2">LABEL · 14/20 · RANADE 500</p>
              <p className="text-ui-label">Brew method</p>
              <p className="text-ui-label mt-2">Filter · Roast · Price</p>
              <p className="text-ui-meta mt-3">
                Single-line controls and menu labels, not prose.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-ui-meta mb-2">COPY · 14/22 · RANADE 400</p>
              <p className="text-copy-compact">
                Explore recently added coffees from Indian roasters, then rate
                the ones you have actually brewed.
              </p>
              <p className="text-ui-meta mt-3">
                Multi-line explanations have more leading than UI labels.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-ui-meta mb-2">
                DATA · 13/18 · TABULAR NUMERALS
              </p>
              <p className="text-ui-meta">
                <span className="font-medium text-foreground">4.3</span> · 12
                ratings · ₹650 / 250g
              </p>
              <p className="text-ui-meta mt-3">
                Secondary rating and price evidence: aligned, never stretched.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Swatch name="Ground" token="--background" />
            <Swatch name="Surface" token="--card" />
            <Swatch name="Ink" token="--foreground" />
            <Swatch name="Muted ink" token="--muted-foreground" />
            <Swatch name="Primary" token="--primary" />
            <Swatch name="Accent (copper)" token="--accent" />
            <Swatch name="Star" token="--rating" />
            <Swatch name="Rule (divider)" token="--border" />
            <Swatch name="Control edge (PROPOSED)" token="--input" />
            <Swatch name="Secondary / muted wash" token="--secondary" />
          </div>
        </Section>

        <Section
          id="buttons"
          note="All existing variants. Pill shape; 32 / 40 / 48px. Small and default labels are 14px; large is 16px. Use lg for primary actions on mobile. Press Tab to walk the real focus ring."
          title="Button"
        >
          {SIZES.map(([size, px]) => (
            <Row key={size} label={`size="${size}" · ${px}`}>
              {VARIANTS.map((variant) => (
                <Button key={variant} size={size} variant={variant}>
                  {variant}
                </Button>
              ))}
            </Row>
          ))}
          <Row label="With icon (Phosphor regular, inherits currentColor; ↗ leaves ICB, → stays inside)">
            <Button asChild>
              <a href="#buttons">
                Buy from {ROASTER} <ArrowUpRightIcon />
              </a>
            </Button>
            <Button className={RATE_OUTLINE} variant="outline">
              <StarIcon /> Rate
            </Button>
            <Button variant="outline">
              <HeartIcon /> Wishlist
            </Button>
            <Button variant="ghost">
              <FunnelIcon /> Filters (3)
            </Button>
            <Button asChild variant="link">
              <a href="#buttons">
                See all 214 <ArrowRightIcon />
              </a>
            </Button>
          </Row>
          <Row label="Coffee page (25 §5): Buy filled · Rate accent outline (PROPOSED) · wishlist">
            <Button asChild>
              <a href="#buttons">
                Buy from {ROASTER} <ArrowUpRightIcon />
              </a>
            </Button>
            <Button className={RATE_OUTLINE} variant="outline">
              Rate
            </Button>
            <Button aria-label="Add to wishlist" size="icon" variant="ghost">
              <HeartIcon />
            </Button>
          </Row>
          <Row label="Coffee page states (25 §5): sold out · no product link · viewer has rated">
            <Button asChild>
              <a href="#buttons">
                View at {ROASTER} <ArrowUpRightIcon />
              </a>
            </Button>
            <Button asChild>
              <a href="#buttons">
                Visit {ROASTER} <ArrowUpRightIcon />
              </a>
            </Button>
            <Button className={RATE_OUTLINE} variant="outline">
              Your rating: 4 · Edit
            </Button>
          </Row>
          <Row label="Roaster page (25): Visit filled · Rate this roaster outline">
            <Button asChild>
              <a href="#buttons">
                Visit {ROASTER} <ArrowUpRightIcon />
              </a>
            </Button>
            <Button className={RATE_OUTLINE} variant="outline">
              Rate this roaster
            </Button>
          </Row>
          <Row label="Rating entry points (24 §6): homepage, search panel, mobile menu — never the desktop header">
            <Button asChild>
              <a href="#buttons">Browse coffees</a>
            </Button>
            <Button className={RATE_OUTLINE} variant="outline">
              Rate a coffee you've tried
            </Button>
            <Button asChild className="text-accent" variant="link">
              <a href="#buttons">No ratings yet · Tried it? Rate it</a>
            </Button>
            <Button asChild variant="link">
              <a href="#buttons">
                Your ratings <ArrowRightIcon />
              </a>
            </Button>
          </Row>
          <Row label="Icon sizes (always pass aria-label)">
            {ICON_SIZES.map(([size, px]) => (
              <Button
                aria-label={`Share (${px})`}
                key={size}
                size={size}
                variant="outline"
              >
                <ShareNetworkIcon />
              </Button>
            ))}
            <Button aria-label="Add to wishlist" size="icon" variant="ghost">
              <HeartIcon />
            </Button>
            <Button aria-label="Delete gear" size="icon" variant="destructive">
              <TrashIcon />
            </Button>
          </Row>
          <Row label="States">
            <Button disabled>Disabled</Button>
            <Button disabled variant="outline">
              Disabled outline
            </Button>
            <Button aria-busy={loading} disabled={loading} onClick={fakeSave}>
              {loading ? (
                <SpinnerGapIcon className="motion-safe:animate-spin" />
              ) : (
                <CheckIcon />
              )}
              {loading ? "Saving…" : "Save (click for loading)"}
            </Button>
            <Button aria-invalid variant="outline">
              aria-invalid
            </Button>
            <Button asChild variant="link">
              <a href="#buttons">asChild → &lt;a&gt;</a>
            </Button>
          </Row>
          <Row label="Static focus preview (same classes as :focus-visible)">
            <Button className={FOCUS_PREVIEW}>default</Button>
            <Button className={FOCUS_PREVIEW} variant="outline">
              outline
            </Button>
            <Button className={FOCUS_PREVIEW} variant="ghost">
              ghost
            </Button>
          </Row>
          <Row label="Caller overrides still win (regression check)">
            <Button className="h-7" size="sm" variant="outline">
              sm + h-7 → 28px
            </Button>
            <Button className="h-6 px-2" size="sm" variant="outline">
              tag chip h-6
            </Button>
            <Button className="h-14 w-full sm:w-auto" size="lg">
              Form CTA h-14
            </Button>
          </Row>
          <Row label="Mobile sticky Rate + Buy bar (25 B7) — shown in place, 48px targets">
            <div className="w-full max-w-md rounded-xl border border-border bg-background p-3">
              <p className="mb-2 text-caption">From ₹450 / 250g · In stock</p>
              <div className="flex gap-2">
                {/* 25 §5: only Buy and Rate sit in the bar; wishlist stays in the page actions */}
                <Button asChild className="min-h-11 min-w-0 flex-1" size="lg">
                  <a href="#buttons">
                    <span className="truncate">Buy from {ROASTER}</span>
                    <ArrowUpRightIcon />
                  </a>
                </Button>
                <Button
                  className={`${RATE_OUTLINE} min-h-11`}
                  size="lg"
                  variant="outline"
                >
                  Rate
                </Button>
              </div>
            </div>
          </Row>
        </Section>

        <Section
          id="fields"
          note="Original shadcn dimensions: Input/Select default 36px, Select small 32px, Textarea min 64px. Shape, focus styling and pill search are preserved. Mobile inputs remain 16px text to avoid iOS zoom."
          title="Input & Textarea"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Field>
                <FieldLabel htmlFor="pg-default">
                  Default · header search (24 §6)
                </FieldLabel>
                <Input
                  className="rounded-full px-5 rounded-full"
                  id="pg-default"
                  placeholder="Search coffees, roasters, origins…"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="pg-focus">Static focus preview</FieldLabel>
                <Input
                  className={FIELD_FOCUS_PREVIEW}
                  defaultValue="Kodagu"
                  id="pg-focus"
                />
              </Field>
              <Field data-invalid={emailInvalid || undefined}>
                <FieldLabel htmlFor="pg-email">
                  Email (type without @ for invalid)
                </FieldLabel>
                <Input
                  aria-invalid={emailInvalid || undefined}
                  id="pg-email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  type="email"
                  value={email}
                />
                {emailInvalid ? (
                  <FieldError>Enter a valid email address.</FieldError>
                ) : (
                  <FieldDescription>
                    Monthly field notes. Unsubscribe anytime.
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="pg-disabled">Disabled</FieldLabel>
                <Input
                  defaultValue="Read-only roaster slug"
                  disabled
                  id="pg-disabled"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="pg-file">File</FieldLabel>
                <Input id="pg-file" type="file" />
              </Field>
            </div>
            <div className="space-y-6">
              <Field>
                <FieldLabel htmlFor="pg-notes">Textarea</FieldLabel>
                <Textarea
                  id="pg-notes"
                  placeholder="Any notes to share about this coffee?"
                />
              </Field>
              <Field data-invalid>
                <FieldLabel htmlFor="pg-ta-invalid">
                  Invalid (static example)
                </FieldLabel>
                <Textarea
                  aria-invalid
                  defaultValue="Notes longer than the real 1,000-character limit…"
                  id="pg-ta-invalid"
                />
                <FieldError>Keep notes under 1,000 characters.</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="pg-ta-disabled">
                  Disabled while saving
                </FieldLabel>
                <Textarea
                  disabled
                  id="pg-ta-disabled"
                  readOnly
                  value="Bright, citrusy on V60; heavier as a South Indian filter."
                />
              </Field>
              <Row label="Directory search (25 §2) — pill search field + button align at 36px">
                <form
                  className="flex w-full gap-2"
                  onSubmit={(e) => e.preventDefault()}
                  role="search"
                >
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      aria-label="Search coffees"
                      className="pl-8 rounded-full"
                      placeholder="Search coffees by name, roaster or note"
                      type="search"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </Row>
              <Row label="Newsletter (stacks on mobile)">
                <form
                  className="flex w-full flex-col gap-2 sm:flex-row"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    aria-label="Email"
                    className="sm:flex-1"
                    placeholder="yourname@gmail.com"
                    type="email"
                  />
                  <Button type="submit">
                    <EnvelopeSimpleIcon /> Subscribe
                  </Button>
                </form>
              </Row>
            </div>
          </div>
        </Section>

        <Section
          id="cards"
          note="Shadcn Card structure stays at its original source sizing; content roles create the hierarchy: editorial and entity names > functional labels > supporting copy > numerical metadata. CoffeeCard and RoasterCard are domain compositions."
          title="Card"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className={CARD_TITLE}>
                  Malnad Ridge Roasters
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPinIcon aria-hidden /> Chikmagalur, Karnataka
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-copy-compact text-pretty text-muted-foreground">
                  24 coffees listed, mostly washed and natural lots.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Washed</Badge>
                  <Badge variant="secondary">Natural</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-ui-meta flex items-center gap-1">
                  <StarIcon aria-hidden className="text-rating" weight="fill" />{" "}
                  4.3 · 12 ratings
                </span>
                <Button asChild size="sm" variant="link">
                  <a href="#cards">
                    24 coffees <ArrowRightIcon />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="pt-0">
              <div
                className="aspect-[16/9] rounded-t-xl bg-secondary"
                aria-hidden
              />
              <CardHeader>
                <Badge className="mb-1" variant="outline">
                  <BookOpenIcon /> Field guide
                </Badge>
                <CardTitle className={CARD_TITLE}>
                  How altitude shapes Indian arabica
                </CardTitle>
                <CardDescription>8 min read</CardDescription>
              </CardHeader>
              <CardContent>
                From Araku’s valley floors to the high slopes of Kodagu,
                elevation changes how a cherry ripens — and what ends up in your
                cup.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={CARD_TITLE}>Profile details</CardTitle>
                <CardDescription>
                  Settings (the relabelled dashboard)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="pg-display">Display name</FieldLabel>
                  <Input defaultValue="filterkaapi_fan" id="pg-display" />
                </Field>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  aria-busy={loading}
                  disabled={loading}
                  onClick={fakeSave}
                >
                  {loading ? (
                    <SpinnerGapIcon className="motion-safe:animate-spin" />
                  ) : null}
                  Save changes
                </Button>
                <Button variant="ghost">Cancel</Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle className="text-heading">
                  Add context <em>(optional)</em>
                </CardTitle>
                <CardDescription>
                  The step after a rating (24 §7.2, 25 §5). Every field is
                  optional, matching the real review rules: notes up to 1,000
                  characters, no minimum. The star control is the rating
                  component, deferred with CoffeeCard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="grid gap-6 md:grid-cols-[1fr_16rem]"
                  noValidate
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Field data-invalid={notesInvalid || undefined}>
                    <FieldLabel htmlFor="pg-review">Notes</FieldLabel>
                    <Textarea
                      aria-invalid={notesInvalid || undefined}
                      id="pg-review"
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any notes to share about this coffee?"
                      value={notes}
                    />
                    {notesInvalid ? (
                      <FieldError>
                        Keep notes under 1,000 characters.
                      </FieldError>
                    ) : (
                      <FieldDescription>
                        {notes.length.toLocaleString("en-IN")} / 1,000
                      </FieldDescription>
                    )}
                  </Field>
                  <div className="space-y-6">
                    <Field>
                      <FieldLabel htmlFor="pg-brew">Brew method</FieldLabel>
                      <Select>
                        <SelectTrigger className="w-full" id="pg-brew">
                          <SelectValue placeholder="How did you brew this coffee?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No brew method</SelectItem>
                          <SelectItem value="filter-coffee">
                            Filter coffee
                          </SelectItem>
                          <SelectItem value="v60">V60</SelectItem>
                          <SelectItem value="aeropress">AeroPress</SelectItem>
                          <SelectItem value="french-press">
                            French Press
                          </SelectItem>
                          <SelectItem value="espresso">Espresso</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                      <Button size="lg" type="submit">
                        Save
                      </Button>
                      <Button size="lg" type="button" variant="ghost">
                        Skip
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex-wrap justify-between gap-2 text-caption">
                <span>
                  Without an account you can rate 3 coffees or roasters.
                </span>
                <Button asChild size="sm" variant="link">
                  <a href="#cards">
                    Your ratings <ArrowRightIcon />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Section
          id="icons"
          note="Phosphor stays. Regular is the functional default (direct Phosphor imports already default to it). Duotone/fill are contextual: fill for active state (wishlisted, rated stars)."
          title="Icons"
        >
          {(["regular", "duotone", "fill"] as const).map((weight) => (
            <Row
              key={weight}
              label={`weight="${weight}"${weight === "regular" ? " · functional default" : ""}`}
            >
              {[
                MagnifyingGlassIcon,
                FunnelIcon,
                SlidersHorizontalIcon,
                HeartIcon,
                StarIcon,
                CoffeeIcon,
                MapPinIcon,
                BellIcon,
                PlusIcon,
                XIcon,
              ].map((IconCmp, i) => (
                <IconCmp className="size-6" key={i} weight={weight} />
              ))}
            </Row>
          ))}
        </Section>

        <Section
          id="audit"
          note="Review neutral menu focus, original shadcn 36px TabsList and Select (32px small), Dialog radius, overlay animation and keyboard interactions."
          title="Overlays & controls"
        >
          <Row label="Badge">
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge variant="destructive">destructive</Badge>
          </Row>
          <Row label="Tabs">
            <Tabs className="w-full" defaultValue="coffees">
              <TabsList>
                <TabsTrigger value="coffees">Coffees</TabsTrigger>
                <TabsTrigger value="roasters">Roasters</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent className="pt-3 text-caption" value="coffees">
                Tabs list, Input and Select default are all 36px.
              </TabsContent>
              <TabsContent className="pt-3" value="roasters">
                Roasters panel
              </TabsContent>
              <TabsContent className="pt-3" value="reviews">
                Reviews panel
              </TabsContent>
            </Tabs>
          </Row>
          <Row label="Account menu (24 §6, 25 B24): Profile ▸ · Settings · Sign out — Profile children OPEN">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <UserIcon /> filterkaapi_fan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel className="text-caption">
                  Signed in
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GearSixIcon /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutIcon /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
          <Row label="Overlays (portals — token bridge must reach them)">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Rate at the anonymous limit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-title">
                    Sign in to keep rating
                  </DialogTitle>
                  <DialogDescription>
                    You&apos;ve rated 3 coffees or roasters without an account.
                    Sign in to rate more.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Not now</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>Sign in</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <FunnelIcon /> Filters (3)
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-title">Filters</SheetTitle>
                  <SheetDescription>
                    Roast, process and brew method first (25 §2).
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 px-4">
                  <Input
                    aria-label="Search regions"
                    placeholder="Search regions"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Button size="sm" variant="ghost">
                      Clear all
                    </Button>
                    <Button className="flex-1" size="lg">
                      Show 86 coffees
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </Row>
        </Section>

        <Section
          id="surfaces"
          note="From docs/experience-redesign/system/icb-system.css, unchanged: Light + Contour for selected feature moments, and the three feature surfaces, each used on its own to break monotony by section intent. Everything else stays flat."
          title="Surfaces & motif"
        >
          <div className="icb-ambient icb-terrain rounded-xl border border-border p-8 md:p-12">
            <p className="text-eyebrow">Regions and estates</p>
            <h3 className="mt-3 text-display">
              Start from where it <em>grew.</em>
            </h3>
            <p className="mt-3 max-w-prose text-muted-foreground">
              Browse coffees by the hills and estates they come from.
            </p>
            <Button className="mt-6">Browse by origin</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="icb-surface icb-surface--weave">
              <div>
                <p
                  className="text-eyebrow opacity-80"
                  style={{ color: "inherit" }}
                >
                  Roasted Weave
                </p>
                <h3 className="mt-3 text-title">
                  Every cup adds to the picture.
                </h3>
              </div>
              <p
                className="text-caption opacity-80"
                style={{ color: "inherit" }}
              >
                Community and rating moments.
              </p>
            </div>
            <div className="icb-surface icb-surface--contour">
              <div>
                <p
                  className="text-eyebrow opacity-80"
                  style={{ color: "inherit" }}
                >
                  Estate Contour
                </p>
                <h3 className="mt-3 text-title">Start from where it grew.</h3>
              </div>
              <p
                className="text-caption opacity-80"
                style={{ color: "inherit" }}
              >
                Regions and estates.
              </p>
            </div>
            <div className="icb-surface icb-surface--paper">
              <div>
                <p className="text-eyebrow">Laid Paper</p>
                <h3 className="mt-3 text-title">
                  Good coffee opens questions.
                </h3>
              </div>
              <p className="text-caption">Field guide and editorial.</p>
            </div>
          </div>
        </Section>
        <Section
          id="ratings"
          note="The production rating components with fictional reviewers. The form is inert here, so it cannot submit; it points at an all-zero ID that matches no coffee."
          title="Ratings"
        >
          <Row label="Stars: read-only sm / md / lg, then interactive (arrow keys work)">
            <StarRating count={6} rating={4.5} size="sm" />
            <StarRating count={12} rating={4.3} size="md" />
            <StarRating rating={3} size="lg" />
            <InteractiveStars />
          </Row>
          <div className="grid w-full gap-8 md:grid-cols-2">
            <ReviewStats stats={SAMPLE_STATS} />
            <ReviewStats stats={null} />
          </div>
          <div className="grid w-full items-start gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 font-medium text-caption">
                Rating form, inline (RatingPanel surface)
              </p>
              <div className="surface-1 rounded-xl p-6 md:p-8" inert>
                <QuickRating
                  entityId="00000000-0000-0000-0000-000000000000"
                  entityType="coffee"
                  initialRating={4}
                  variant="inline"
                />
              </div>
            </div>
            <ReviewList entityType="coffee" reviews={SAMPLE_REVIEWS} />
          </div>
        </Section>
        <Section
          id="coffee-cards"
          title="CoffeeCard"
          note="The production card on four real coffees. Coffee IDs are null so rating and wishlist actions cannot write; titles link to the real ICB coffee pages."
        >
          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            {REAL_COFFEES.map((c, i) => (
              <CoffeeCard
                coffee={c}
                key={c.slug}
                userRating={i === 1 ? 4 : undefined}
                variant="default"
              />
            ))}
          </div>
          <Row label="Similar and compact variants">
            <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
              <CoffeeCard
                coffee={REAL_COFFEES[2]}
                matchInfo={{
                  matchType: "flavor",
                  chips: ["Jasmine", "Light roast"],
                }}
                variant="similar"
              />
              <div className="col-span-2 space-y-3">
                <CoffeeCard coffee={REAL_COFFEES[0]} variant="compact" />
                <CoffeeCard coffee={REAL_COFFEES[1]} variant="compact" />
              </div>
            </div>
          </Row>
        </Section>
      </main>
    </div>
  );
}
