import Link from "next/link";
import Image from "next/image";
import {
  brewMethodDiscoveryLinkClassName,
  brewSlugToLabel,
} from "@/lib/discovery/brew-method-labels";
import { discoveryPagePath } from "@/lib/discovery/landing-pages/paths";
import type { RoastProfileConfig } from "@/lib/discovery/landing-pages/types";
import {
  CoffeeIcon,
  DropIcon,
  FireIcon,
  GearIcon,
  HourglassIcon,
  InfoIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  RulerIcon,
  ScalesIcon,
  SparkleIcon,
  ThermometerIcon,
  ThermometerSimpleIcon,
  ThumbsUpIcon,
  TimerIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type RoastProfileTabbedProps = {
  roastProfile: RoastProfileConfig;
  className?: string;
};

function DetailBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ComponentType<IconProps>;
}) {
  return (
    <Stack gap="1" className="relative">
      <div className="flex items-center gap-2">
        {icon ? <Icon icon={icon} className="h-4 w-4 text-accent/60" /> : null}
        <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="text-body text-foreground leading-relaxed font-medium">
        {value}
      </p>
    </Stack>
  );
}

const tabTriggerClass =
  "flex-none shrink-0 snap-start inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-caption font-medium transition-all duration-300 after:hidden sm:px-5 " +
  "text-muted-foreground hover:text-foreground hover:bg-accent/5 " +
  "data-[state=active]:bg-primary/[0.08] data-[state=active]:text-primary data-[state=active]:shadow-sm";

const tabImageHoverClass =
  "object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105";

/** text-caption bundles muted foreground; force light text + shadow so labels read on variable photos. */
const tabImageEyebrowClass =
  "mb-1 text-caption font-semibold uppercase tracking-wide !text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]";

const tabImageTitleClass =
  "font-serif text-body-large !text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]";

const tabImageScrimClass =
  "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent";

export function RoastProfileTabbed({
  roastProfile,
  className,
}: RoastProfileTabbedProps) {
  const { visual, roastingProcess, flavourProfile, brewParams, brewMethods } =
    roastProfile;

  return (
    <div
      className={cn(
        "surface-1 relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl shadow-primary/5",
        className
      )}
    >
      <Tabs
        defaultValue="bean"
        className="relative z-10 w-full min-w-0 max-w-full"
      >
        <TabsList
          variant="line"
          className="mb-8 flex h-auto w-full min-w-0 max-w-full flex-nowrap justify-start gap-2 overflow-x-auto overscroll-x-contain rounded-none bg-transparent p-0 pb-1 scroll-pl-4 scroll-pr-4 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] md:hide-scrollbar"
        >
          <TabsTrigger value="bean" className={tabTriggerClass}>
            <Icon icon={MagnifyingGlassIcon} className="h-4 w-4" />
            In the bean
          </TabsTrigger>
          <TabsTrigger value="roasting" className={tabTriggerClass}>
            <Icon icon={FireIcon} className="h-4 w-4" />
            During roasting
          </TabsTrigger>
          <TabsTrigger value="cup" className={tabTriggerClass}>
            <Icon icon={CoffeeIcon} className="h-4 w-4" />
            In the cup
          </TabsTrigger>
          <TabsTrigger value="brew" className={tabTriggerClass}>
            <Icon icon={DropIcon} className="h-4 w-4" />
            Brew guide
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="bean"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid gap-8 md:grid-cols-5 md:items-center">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/20 md:col-span-2 md:aspect-square">
              <Image
                src="/images/discovery/bean-tab.avif"
                alt="Coffee beans visual characteristics"
                fill
                className={tabImageHoverClass}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className={tabImageScrimClass} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className={tabImageEyebrowClass}>Look & Feel</p>
                <p className={tabImageTitleClass}>Visual Assessment</p>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                <DetailBlock
                  icon={PaletteIcon}
                  label="Colour"
                  value={visual.color}
                />
                <DetailBlock
                  icon={ScalesIcon}
                  label="Density"
                  value={visual.density}
                />
                <DetailBlock
                  icon={GearIcon}
                  label="On the grind"
                  value={visual.grindNote}
                />
                <DetailBlock
                  icon={RulerIcon}
                  label="Agtron range"
                  value={visual.agtronRange}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="roasting"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid gap-8 md:grid-cols-5 md:items-center">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/20 md:col-span-2 md:aspect-square">
              <Image
                src="/images/discovery/roasting-tab.avif"
                alt="Coffee roasting process"
                fill
                className={tabImageHoverClass}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className={tabImageScrimClass} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className={tabImageEyebrowClass}>Development</p>
                <p className={tabImageTitleClass}>Roast Trajectory</p>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                <DetailBlock
                  icon={ThermometerIcon}
                  label="Stage"
                  value={roastingProcess.stage}
                />
                <DetailBlock
                  icon={LightningIcon}
                  label="First crack"
                  value={roastingProcess.firstCrack}
                />
                <DetailBlock
                  icon={LightningIcon}
                  label="Second crack"
                  value={roastingProcess.secondCrack}
                />
                <div className="sm:col-span-2">
                  <DetailBlock
                    icon={TimerIcon}
                    label="Development"
                    value={roastingProcess.developmentNote}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="cup"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid gap-8 md:grid-cols-5 md:items-center">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/20 md:col-span-2 md:aspect-square">
              <Image
                src="/images/discovery/cup-tab.avif"
                alt="Coffee in the cup tasting notes"
                fill
                className={tabImageHoverClass}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className={tabImageScrimClass} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className={tabImageEyebrowClass}>Experience</p>
                <p className={tabImageTitleClass}>Tasting Profile</p>
              </div>
            </div>
            <div className="md:col-span-3">
              <Stack gap="8">
                <Stack gap="4">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={SparkleIcon}
                      className="h-4 w-4 text-accent/60"
                    />
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      Typical notes
                    </p>
                  </div>
                  <Cluster gap="2" className="flex-wrap">
                    {flavourProfile.typical.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-lg border-accent/10 bg-accent/5 px-4 py-1.5 text-caption font-medium text-accent transition-all hover:border-accent/20 hover:bg-accent/10"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Cluster>
                </Stack>
                <div className="relative border-l-2 border-accent/30 py-1 pl-5">
                  <p className="text-body leading-relaxed text-foreground/80">
                    {flavourProfile.indianContext}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-border bg-muted/30 px-5 py-5 transition-colors hover:bg-muted/50">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon icon={UsersIcon} className="h-4 w-4 text-accent/60" />
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      Who it suits
                    </p>
                  </div>
                  <p className="text-body font-medium leading-relaxed text-foreground">
                    {roastProfile.whoIsItFor}
                  </p>
                </div>
              </Stack>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="brew"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid gap-8 md:grid-cols-5 md:items-start">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/20 md:col-span-2 md:aspect-square">
              <Image
                src="/images/discovery/brew-tab.avif"
                alt="Brewing instructions"
                fill
                className={tabImageHoverClass}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className={tabImageScrimClass} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className={tabImageEyebrowClass}>Preparation</p>
                <p className={tabImageTitleClass}>Extraction Guide</p>
              </div>
            </div>
            <div className="flex h-full flex-col justify-center md:col-span-3">
              <Stack gap="8">
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                  <DetailBlock
                    icon={ThermometerSimpleIcon}
                    label="Water temp"
                    value={brewParams.waterTemp}
                  />
                  <DetailBlock
                    icon={DropIcon}
                    label="Ratio"
                    value={brewParams.ratio}
                  />
                  <div className="sm:col-span-2">
                    <DetailBlock
                      icon={HourglassIcon}
                      label="Time"
                      value={brewParams.brewTime}
                    />
                  </div>
                </div>
                <div className="surface-2 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Icon
                      icon={InfoIcon}
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    />
                    <p className="text-caption font-medium leading-relaxed text-foreground/80">
                      {brewParams.note}
                    </p>
                  </div>
                </div>
                <Stack gap="4">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={ThumbsUpIcon}
                      className="h-4 w-4 text-accent/60"
                    />
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      Pairs well with
                    </p>
                  </div>
                  <Cluster gap="2" className="flex-wrap">
                    {brewMethods.map((slug) => (
                      <Link
                        key={slug}
                        href={discoveryPagePath(slug)}
                        className={cn(
                          brewMethodDiscoveryLinkClassName,
                          "rounded-full shadow-sm transition-all hover:shadow"
                        )}
                      >
                        {brewSlugToLabel(slug)}
                      </Link>
                    ))}
                  </Cluster>
                </Stack>
              </Stack>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
