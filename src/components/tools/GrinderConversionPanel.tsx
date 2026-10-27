"use client";
// src/components/tools/GrinderConversionPanel.tsx
// Grinder → grinder and micron → grinder conversions, sitting above the
// brew-method converter. Runs through the same linear micron model as the rest
// of the grind guide, so results are starting estimates, not measured grinds.

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LinkIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GRINDERS,
  type GrinderStyle,
  MICRON_AXIS_MAX,
  MICRON_AXIS_MIN,
  convertGrinderSetting,
  getGrinder,
  parseGrinderSetting,
  settingForMicrons,
} from "@/lib/tools/grind-guide";
import { cn } from "@/lib/utils";

type Mode = "grinder" | "microns";

const DEFAULT_SOURCE = "comandante-c40";
const DEFAULT_TARGET = "kingrinder-k6";

const MODES: { key: Mode; label: string }[] = [
  { key: "grinder", label: "From grinder" },
  { key: "microns", label: "From microns" },
];

/** Input hint for a grinder's native setting notation. */
function inputHelp(style: GrinderStyle): string {
  switch (style) {
    case "compound":
      return "Enter rotation.click as printed (e.g. 1.20, 1.05) or total clicks (80).";
    case "triple":
      return "Enter rotation.number.tick (e.g. 1.5.2) or total ticks.";
    case "rotation":
      return "Enter rotation:click (e.g. 2:15) or total clicks.";
    case "numbered":
      return "Enter a dial setting in increments of 0.5.";
    default:
      return "Enter the number of clicks from zero.";
  }
}

/** Grinder-to-grinder and micron-to-grinder conversion card. */
export function GrinderConversionPanel() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Seeded once from a shared conversion link; local state after that.
  const [mode, setMode] = useState<Mode>(
    searchParams.get("convert") === "microns" ? "microns" : "grinder"
  );
  const [sourceKey, setSourceKey] = useState(
    getGrinder(searchParams.get("from") ?? "")?.key ?? DEFAULT_SOURCE
  );
  const [targetKey, setTargetKey] = useState(
    getGrinder(searchParams.get("to") ?? "")?.key ?? DEFAULT_TARGET
  );
  const [input, setInput] = useState(searchParams.get("input") ?? "");

  // Keys are only ever set from GRINDERS, so these always resolve.
  const source = getGrinder(sourceKey)!;
  const target = getGrinder(targetKey)!;

  const result = useMemo(() => {
    const text = input.trim();
    if (!text) {
      return undefined;
    }
    if (mode === "grinder") {
      const setting = parseGrinderSetting(source, text);
      return setting === null
        ? null
        : convertGrinderSetting(source, target, setting);
    }
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) {
      return null;
    }
    // settingForMicrons owns the range check.
    return settingForMicrons(target, Number(text));
  }, [input, mode, source, target]);

  const handleModeChange = (key: Mode) => {
    setMode(key);
    setInput("");
  };

  const handleCopyLink = async () => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("convert", mode);
    params.set("to", targetKey);
    params.set("input", input.trim());
    if (mode === "grinder") {
      params.set("from", sourceKey);
    } else {
      params.delete("from");
    }
    const url = `${window.location.origin}${pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", {
        description: "Your grinder conversion link is on the clipboard.",
      });
    } catch {
      toast.error("Couldn't copy link", {
        description: "Something went wrong.",
      });
    }
  };

  return (
    <section
      aria-labelledby="grinder-convert-title"
      className="surface-1 card-padding rounded-2xl border border-border/40"
    >
      <Stack gap="6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-overline tracking-[0.15em] text-muted-foreground">
              Translate a recipe
            </p>
            <h3 id="grinder-convert-title" className="mt-1 text-heading">
              Grinder-to-grinder conversion
            </h3>
            <p className="mt-1 max-w-xl text-caption text-muted-foreground">
              Already have a click setting or a micron target? Find the
              approximate equivalent on another grinder.
            </p>
          </div>

          {/* Mode chips */}
          <div
            role="group"
            aria-label="Conversion input type"
            className="flex flex-wrap gap-2"
          >
            {MODES.map(({ key, label }) => {
              const active = key === mode;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleModeChange(key)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-caption font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mode === "grinder" && (
            <div>
              <label
                className="mb-2 block text-caption font-medium text-muted-foreground"
                htmlFor="conversion-source"
              >
                Source grinder
              </label>
              <Select value={sourceKey} onValueChange={setSourceKey}>
                <SelectTrigger id="conversion-source" className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRINDERS.map((g) => (
                    <SelectItem key={g.key} value={g.key}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label
              className="mb-2 block text-caption font-medium text-muted-foreground"
              htmlFor="conversion-input"
            >
              {mode === "grinder" ? "Source setting" : "Target size (µm)"}
            </label>
            <Input
              id="conversion-input"
              inputMode="decimal"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "grinder" ? "e.g. 20" : "e.g. 650"}
              aria-invalid={result === null}
              aria-describedby="conversion-help"
              className="h-12"
            />
            <p
              id="conversion-help"
              className="mt-2 text-micro text-muted-foreground"
            >
              {mode === "grinder"
                ? inputHelp(source.style)
                : `Enter ${MICRON_AXIS_MIN}–${MICRON_AXIS_MAX} µm.`}
            </p>
          </div>

          <div>
            <label
              className="mb-2 block text-caption font-medium text-muted-foreground"
              htmlFor="conversion-target"
            >
              Target grinder
            </label>
            <Select value={targetKey} onValueChange={setTargetKey}>
              <SelectTrigger id="conversion-target" className="h-12 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRINDERS.map((g) => (
                  <SelectItem key={g.key} value={g.key}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result === null && (
          <p role="alert" className="text-caption text-destructive">
            {mode === "grinder"
              ? `That isn't a valid ${source.label} setting. Check the notation and range.`
              : `Enter a particle size between ${MICRON_AXIS_MIN} and ${MICRON_AXIS_MAX} µm.`}
          </p>
        )}

        {/* Result */}
        {result && (
          <Stack gap="4" className="border-t border-border/40 pt-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-overline tracking-[0.15em] text-muted-foreground">
                  {mode === "grinder" ? `${source.label} → ` : ""}
                  {target.label}
                </p>
                <p className="mt-2 text-title leading-tight">
                  {result.outOfRange ? (
                    "Out of range"
                  ) : (
                    <span className="font-semibold">{result.targetLabel}</span>
                  )}
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {target.units} · ~{Math.round(result.micron)} µm
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="group border-border/50 text-caption text-muted-foreground hover:text-foreground"
              >
                <Icon className="mr-1 h-3 w-3" icon={LinkIcon} />
                Copy link
              </Button>
            </div>

            {result.outOfRange && (
              <Alert>
                <AlertDescription>
                  <p>
                    {`The ${target.label} can't reach ~${Math.round(result.micron)} µm — its range is ${target.micronMin}–${target.micronMax} µm. The closest it gets is ${result.targetLabel}, which is a boundary, not an equivalent grind.`}
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <p className="text-micro leading-relaxed text-muted-foreground/80">
              Estimated from each grinder&apos;s micron range — not a measured
              particle distribution. Burr geometry, zero points and beans vary.
              Treat it as a starting point and dial in by taste.
            </p>
          </Stack>
        )}
      </Stack>
    </section>
  );
}
