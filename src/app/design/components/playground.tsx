"use client";

import { Section as BaseSection } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
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
  ["sm", "36px"],
  ["default", "40px"],
  ["lg", "44px"],
] as const;
const ICON_SIZES = [
  ["icon-sm", "36px"],
  ["icon", "40px"],
  ["icon-lg", "44px"],
] as const;
// Mirrors the focus-visible classes so the focus ring is visible in static screenshots.
const FOCUS_PREVIEW = "border-ring ring-[3px] ring-ring/50";
// PROPOSED (07 2026-11-10, 20 §5, 25 B9): Rate is an accent outline; Buy is filled. A composition
// on the existing outline variant — no new Button variant until the role is approved.
const RATE_OUTLINE =
  "border-accent text-accent hover:bg-accent hover:text-accent-foreground dark:border-accent dark:hover:bg-accent dark:hover:text-accent-foreground";
const ROASTER = "Malnad Ridge"; // fictional sample roaster; neutral, no real brand spotlighted

const SECTIONS = [
  ["type", "Type & tokens"],
  ["buttons", "Button"],
  ["fields", "Input & Textarea"],
  ["cards", "Card"],
  ["icons", "Icons"],
  ["audit", "Next audit (unchanged)"],
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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-heading">Component playground</p>
            <p className="truncate text-caption">
              Deep Roast · Gambetta / Ranade · real shadcn source · design
              branch only
            </p>
          </div>
          <ThemeSwitch />
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
            <p className="text-display">Monsoon Malabar AA · Gambetta H2</p>
            <p className="text-heading">
              Ratnagiri Estate Natural · H4 / coffee name
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
            <p className="text-caption">
              Muted 14px · meta text · 24 coffees · Updated 3 days ago
            </p>
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
          note="All existing variants and sizes. Default 40px, sm 36px, lg 44px. Use lg (44px) for the primary action on mobile. Press Tab to walk the real focus ring."
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
            <Button className="h-8" size="sm" variant="outline">
              sm + h-8 → 32px
            </Button>
            <Button className="h-6 px-2" size="sm" variant="outline">
              tag chip h-6
            </Button>
            <Button className="h-14 w-full sm:w-auto" size="lg">
              Form CTA h-14
            </Button>
          </Row>
          <Row label="Mobile sticky Rate + Buy bar (25 B7) — shown in place, 44px targets">
            <div className="w-full max-w-md rounded-xl border border-border bg-background p-3">
              <p className="mb-2 text-caption">From ₹450 / 250g · In stock</p>
              <div className="flex gap-2">
                {/* 25 §5: only Buy and Rate sit in the bar; wishlist stays in the page actions */}
                <Button asChild className="min-w-0 flex-1" size="lg">
                  <a href="#buttons">
                    <span className="truncate">Buy from {ROASTER}</span>
                    <ArrowUpRightIcon />
                  </a>
                </Button>
                <Button className={RATE_OUTLINE} size="lg" variant="outline">
                  Rate
                </Button>
              </div>
            </div>
          </Row>
        </Section>

        <Section
          id="fields"
          note="Input 40px, Textarea min 96px, both on the solid ground with the PROPOSED control edge (3.3:1). 16px text on mobile prevents iOS zoom."
          title="Input & Textarea"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Field>
                <FieldLabel htmlFor="pg-default">
                  Default · header search (24 §6)
                </FieldLabel>
                <Input
                  id="pg-default"
                  placeholder="Search coffees, roasters, origins…"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="pg-focus">Static focus preview</FieldLabel>
                <Input
                  className={FOCUS_PREVIEW}
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
              <Row label="Directory search (25 §2) — input + button align at 40px">
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
                      className="pl-8"
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
          note="Generic Card only. CoffeeCard and CardRatingFooter are deliberately out of scope until these foundations are approved."
          title="Card"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-heading">
                  Malnad Ridge Roasters
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPinIcon aria-hidden /> Chikmagalur, Karnataka
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>24 coffees listed, mostly washed and natural lots.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Washed</Badge>
                  <Badge variant="secondary">Natural</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="flex items-center gap-1">
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
                <CardTitle className="text-heading">
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
                <CardTitle className="text-heading">Profile details</CardTitle>
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
                <CardTitle className="text-title">
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
          note="Phase C step 2 primitives, shown unchanged under the bridged tokens (and in portals) so the next audit starts from evidence. No source changes."
          title="Next audit (unchanged)"
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
                Tabs list is h-9 (36px) — candidate for the step-2 audit.
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
      </main>
    </div>
  );
}
