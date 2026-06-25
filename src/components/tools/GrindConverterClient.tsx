"use client";
// src/components/tools/GrindConverterClient.tsx
// Brew method + grinder → recommended grind setting. Result card plus a visual
// micron chart. Selections are mirrored to the URL so a setup is shareable.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GrindChart } from "@/components/tools/GrindChart";
import { trackToolsEngagement } from "@/lib/analytics/enhanced-tracking";
import {
  BREW_METHODS,
  GRINDERS,
  categoryLabelForRange,
  getBrewMethod,
  getGrinder,
  settingRangeForMethod,
} from "@/lib/tools/grind-guide";
import { cn } from "@/lib/utils";

const DEFAULT_METHOD = "v60";
const DEFAULT_GRINDER = "timemore-c2";

// Quick-pick chips — the methods most people land here for.
const QUICK_METHODS = [
  "espresso",
  "v60",
  "pourover",
  "aeropress",
  "frenchpress",
  "coldbrew",
];

export function GrindConverterClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlMethod = searchParams.get("method");
  const urlGrinder = searchParams.get("grinder");

  const methodKey =
    urlMethod && getBrewMethod(urlMethod) ? urlMethod : DEFAULT_METHOD;
  const grinderKey =
    urlGrinder && getGrinder(urlGrinder) ? urlGrinder : DEFAULT_GRINDER;

  const updateParams = useCallback(
    (updates: { method?: string; grinder?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.method !== undefined) {
        params.set("method", updates.method);
      }
      if (updates.grinder !== undefined) {
        params.set("grinder", updates.grinder);
      }
      const next = params.toString();
      const current = searchParams.toString();
      if (next !== current) {
        router.replace(`${pathname}?${next}`, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  const setMethodKey = useCallback(
    (key: string) => updateParams({ method: key }),
    [updateParams]
  );

  const setGrinderKey = useCallback(
    (key: string) => updateParams({ grinder: key }),
    [updateParams]
  );

  // Seed missing method/grinder into the URL while preserving other params.
  useEffect(() => {
    const needsMethod = !urlMethod || !getBrewMethod(urlMethod);
    const needsGrinder = !urlGrinder || !getGrinder(urlGrinder);
    if (needsMethod || needsGrinder) {
      updateParams({
        ...(needsMethod ? { method: DEFAULT_METHOD } : {}),
        ...(needsGrinder ? { grinder: DEFAULT_GRINDER } : {}),
      });
    }
  }, [urlMethod, urlGrinder, updateParams]);

  // Analytics: meaningful-engagement entry/exit.
  useEffect(() => {
    const start = Date.now();
    trackToolsEngagement("grind-converter", {
      sessionDuration: 0,
      interactionCount: 0,
      completionStatus: "started",
    });
    return () => {
      const duration = Math.floor((Date.now() - start) / 1000);
      if (duration > 30) {
        trackToolsEngagement("grind-converter", {
          sessionDuration: duration,
          interactionCount: 1,
          completionStatus: duration > 300 ? "completed" : "partial",
        });
      }
    };
  }, []);

  const method = getBrewMethod(methodKey);
  const grinder = getGrinder(grinderKey);

  const result = useMemo(() => {
    if (!method || !grinder) {
      return null;
    }
    return settingRangeForMethod(grinder, method);
  }, [method, grinder]);

  const handleCopyLink = async () => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("method", methodKey);
    params.set("grinder", grinderKey);
    const url = `${window.location.origin}${pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", {
        description: "Your grind setup link is on the clipboard.",
      });
    } catch {
      toast.error("Couldn't copy link", {
        description: "Something went wrong.",
      });
    }
  };

  return (
    <Stack gap="8">
      {/* Selectors */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-caption font-medium text-muted-foreground"
            htmlFor="grind-method"
          >
            Brew method
          </label>
          <Select value={methodKey} onValueChange={setMethodKey}>
            <SelectTrigger id="grind-method" className="h-12 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BREW_METHODS.map((m) => (
                <SelectItem key={m.key} value={m.key}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            className="mb-2 block text-caption font-medium text-muted-foreground"
            htmlFor="grind-grinder"
          >
            Grinder
          </label>
          <Select value={grinderKey} onValueChange={setGrinderKey}>
            <SelectTrigger id="grind-grinder" className="h-12 w-full">
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

      {/* Quick-pick method chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_METHODS.map((key) => {
          const m = getBrewMethod(key);
          if (!m) {
            return null;
          }
          const active = key === methodKey;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setMethodKey(key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-caption font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Result card */}
      {method && grinder && result && (
        <div className="surface-1 card-padding rounded-2xl border border-border/40">
          <Stack gap="6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-overline tracking-[0.15em] text-muted-foreground">
                  {grinder.label} · {method.name}
                </p>
                <p className="mt-2 text-title leading-tight">
                  {result.outOfRange ? (
                    "Out of range"
                  ) : (
                    <span className="font-semibold">{result.rangeLabel}</span>
                  )}
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {grinder.units}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="group border-border/50 text-caption text-muted-foreground hover:text-foreground"
              >
                <Icon className="mr-1 h-3 w-3" name="Link" />
                Copy link
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-5 sm:grid-cols-3">
              <Stat
                label="Grind category"
                value={categoryLabelForRange(
                  method.micronMin,
                  method.micronMax
                )}
              />
              <Stat
                label="Particle size"
                value={`${method.micronMin}–${method.micronMax} µm`}
              />
              <Stat
                label="Setting range"
                value={result.outOfRange ? "—" : result.rangeLabel}
              />
            </div>

            {result.outOfRange && (
              <Alert>
                <AlertDescription>
                  The {grinder.label} can&apos;t reach a {method.name} grind —
                  its range is {grinder.micronMin}–{grinder.micronMax} µm. Try a
                  grinder suited to this brew method.
                </AlertDescription>
              </Alert>
            )}
            {result.partial && !result.outOfRange && (
              <Alert>
                <AlertDescription>
                  This is the closest the {grinder.label} can get — part of the{" "}
                  {method.name} range sits outside its {grinder.micronMin}–
                  {grinder.micronMax} µm span, so the setting is clamped to the
                  reachable end.
                </AlertDescription>
              </Alert>
            )}

            <p className="text-micro leading-relaxed text-muted-foreground/80">
              Settings are interpolated starting points, not exact factory
              calibration. Dial in by taste from here.
            </p>
          </Stack>
        </div>
      )}

      {/* Visual chart */}
      <div className="surface-1 card-padding rounded-2xl border border-border/40">
        <Stack gap="4">
          <div>
            <p className="text-overline tracking-[0.15em] text-muted-foreground">
              The full picture
            </p>
            <h3 className="mt-1 text-heading">Grind size chart</h3>
            <p className="mt-1 max-w-xl text-caption text-muted-foreground">
              Every brew method on one micron scale. Your selected method and
              grinder settings are highlighted.
            </p>
          </div>
          <GrindChart selectedMethodKey={methodKey} grinder={grinder} />
        </Stack>
      </div>
    </Stack>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-overline tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium text-body">{value}</p>
    </div>
  );
}
