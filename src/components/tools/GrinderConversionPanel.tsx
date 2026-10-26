"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GRINDERS,
  MICRON_AXIS_MAX,
  convertGrinderSetting,
  getGrinder,
  parseGrinderSetting,
  settingForMicrons,
} from "@/lib/tools/grind-guide";
import { cn } from "@/lib/utils";

type Mode = "grinder" | "microns";

const DEFAULT_SOURCE = "comandante-c40";
const DEFAULT_TARGET = "kingrinder-k6";

function inputHelp(style: string): string {
  switch (style) {
    case "compound":
      return "Enter rotation.click (e.g. 1.20) or total clicks (80).";
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

/** Independent conversions alongside the existing brew-method guide. */
export function GrinderConversionPanel() {
  const params = useSearchParams();
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>(
    params.get("convert") === "microns" ? "microns" : "grinder"
  );
  const [sourceKey, setSourceKey] = useState(
    getGrinder(params.get("from") ?? "")?.key ?? DEFAULT_SOURCE
  );
  const [targetKey, setTargetKey] = useState(
    getGrinder(params.get("to") ?? "")?.key ?? DEFAULT_TARGET
  );
  const [input, setInput] = useState(params.get("input") ?? "");

  const source = getGrinder(sourceKey)!;
  const target = getGrinder(targetKey)!;

  const calculation = useMemo(() => {
    if (!input.trim()) return { status: "empty" as const };

    if (mode === "grinder") {
      const setting = parseGrinderSetting(source, input);
      if (setting === null) return { status: "invalid" as const };
      const result = convertGrinderSetting(source, target, setting);
      return result
        ? { status: "ready" as const, result }
        : { status: "invalid" as const };
    }

    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(input.trim())) {
      return { status: "invalid" as const };
    }
    const micron = Number(input.trim());
    if (!Number.isFinite(micron) || micron < 1 || micron > MICRON_AXIS_MAX) {
      return { status: "invalid" as const };
    }
    const result = settingForMicrons(target, micron);
    return result
      ? { status: "ready" as const, result }
      : { status: "invalid" as const };
  }, [input, mode, source, target]);

  const copyLink = async () => {
    const linkParams = new URLSearchParams(params.toString());
    linkParams.set("convert", mode);
    linkParams.set("to", targetKey);
    linkParams.set("input", input.trim());
    if (mode === "grinder") linkParams.set("from", sourceKey);
    else linkParams.delete("from");

    try {
      const link = `${window.location.origin}${pathname}?${linkParams.toString()}`;
      await navigator.clipboard.writeText(link);
      toast.success("Conversion link copied");
    } catch {
      toast.error("Could not copy conversion link");
    }
  };

  return (
    <section
      aria-labelledby="grinder-convert-title"
      className="surface-1 card-padding rounded-2xl border border-border/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-overline tracking-[0.15em] text-muted-foreground">
            Translate a recipe
          </p>
          <h3 id="grinder-convert-title" className="mt-1 text-heading">
            Grinder-to-grinder conversion
          </h3>
          <p className="mt-2 max-w-2xl text-caption text-muted-foreground">
            Already have a click setting or a micron target? Find an approximate
            equivalent on another grinder, using ICB&apos;s existing model.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Conversion input type">
          {([
            ["grinder", "From grinder"],
            ["microns", "From microns"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => {
                setMode(key);
                setInput("");
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-caption font-medium transition-colors",
                mode === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {mode === "grinder" && (
          <div>
            <label htmlFor="conversion-source" className="mb-2 block text-caption font-medium">
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
          <label htmlFor="conversion-input" className="mb-2 block text-caption font-medium">
            {mode === "grinder" ? "Source setting" : "Target size (µm)"}
          </label>
          <input
            id="conversion-input"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "grinder" ? "e.g. 20" : "e.g. 650"}
            aria-invalid={calculation.status === "invalid"}
            aria-describedby="conversion-help"
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-body outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p id="conversion-help" className="mt-2 text-micro text-muted-foreground">
            {mode === "grinder"
              ? inputHelp(source.style)
              : `Enter 1–${MICRON_AXIS_MAX} µm.`}
          </p>
        </div>
        <div>
          <label htmlFor="conversion-target" className="mb-2 block text-caption font-medium">
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

      {calculation.status === "invalid" && (
        <p role="alert" className="mt-4 text-caption text-destructive">
          {mode === "grinder"
            ? `Invalid setting for ${source.label}. Check its adjustment notation and range.`
            : `Enter a valid particle-size target between 1 and ${MICRON_AXIS_MAX} µm.`}
        </p>
      )}
      {calculation.status === "ready" && (
        <div className="mt-6 border-t border-border/40 pt-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-overline tracking-[0.12em] text-muted-foreground">
                Approximate {target.label} setting
              </p>
              <p className="mt-2 text-title font-semibold">
                {calculation.result.outOfRange
                  ? "Outside grinder range"
                  : calculation.result.targetLabel}
              </p>
              <p className="mt-2 text-caption text-muted-foreground">
                Modeled input: ~{Math.round(calculation.result.micron)} µm
                {" · "}
                Nearest target position: {calculation.result.targetLabel}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink}>
              Copy link
            </Button>
          </div>
          {calculation.result.outOfRange && (
            <p role="status" className="mt-3 text-caption text-destructive">
              The {target.label} is modeled for {target.micronMin}–
              {target.micronMax} µm; the nearest setting is only a boundary,
              not an equivalent grind.
            </p>
          )}
          <p className="mt-4 text-micro leading-relaxed text-muted-foreground">
            Linear calibration estimate, not a measured particle distribution.
            Burr geometry, zero points and beans vary. Use this only as a starting
            point and dial in by taste.
          </p>
        </div>
      )}
    </section>
  );
}
