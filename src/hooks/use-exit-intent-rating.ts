"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import type { LatestReviewPerIdentity } from "@/types/review-types";

const SESSION_STORAGE_KEY = "icb_exit_rating_dismissed";

const MOBILE_MAX_WIDTH_PX = 767;

function getDismissedMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, boolean>;
    }
  } catch {
    // ignore
  }
  return {};
}

function isDismissedForEntity(entityId: string): boolean {
  return getDismissedMap()[entityId] === true;
}

function markDismissedForEntity(entityId: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = { ...getDismissedMap(), [entityId]: true };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore (private mode, quota)
  }
}

export type UseExitIntentRatingOptions = {
  entityId: string;
  entityType: "coffee" | "roaster";
  reviews: LatestReviewPerIdentity[] | undefined;
  mobileDelayMs?: number;
};

export type UseExitIntentRatingResult = {
  open: boolean;
  setOpen: (open: boolean) => void;
  markDismissed: () => void;
};

/**
 * Exit intent for rating prompt: desktop = mouse leaving toward top of viewport;
 * mobile = timer only (no mouseleave). Skips if user already rated this entity
 * or dismissed the prompt this session.
 */
export function useExitIntentRating({
  entityId,
  entityType: _entityType,
  reviews,
  mobileDelayMs = 45_000,
}: UseExitIntentRatingOptions): UseExitIntentRatingResult {
  const [open, setOpen] = useState(false);
  const [identityKey, setIdentityKey] = useState<string | null>(null);
  const hasTriggeredRef = useRef(false);

  const userHasRated = useMemo(() => {
    if (!reviews || !identityKey) return false;
    return reviews.some((r) => r.identity_key === identityKey);
  }, [reviews, identityKey]);

  useEffect(() => {
    let cancelled = false;
    async function resolveIdentity() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (user) {
          setIdentityKey(`user:${user.id}`);
        } else {
          const anonId = ensureAnonId();
          if (anonId) {
            setIdentityKey(`anon:${anonId}`);
          } else {
            setIdentityKey(null);
          }
        }
      } catch {
        if (cancelled) return;
        const anonId = ensureAnonId();
        setIdentityKey(anonId ? `anon:${anonId}` : null);
      }
    }
    void resolveIdentity();
    return () => {
      cancelled = true;
    };
  }, []);

  const tryOpen = useCallback(() => {
    if (hasTriggeredRef.current) return;
    if (reviews === undefined) return;
    if (identityKey === null) return;
    if (userHasRated) return;
    if (isDismissedForEntity(entityId)) return;
    hasTriggeredRef.current = true;
    setOpen(true);
  }, [entityId, identityKey, reviews, userHasRated]);

  const markDismissed = useCallback(() => {
    markDismissedForEntity(entityId);
  }, [entityId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (identityKey === null) return;
    if (reviews === undefined) return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`);

    let teardown: (() => void) | undefined;

    const bind = () => {
      teardown?.();
      teardown = undefined;

      if (hasTriggeredRef.current) return;

      if (mql.matches) {
        const id = window.setTimeout(() => {
          tryOpen();
        }, mobileDelayMs);
        teardown = () => window.clearTimeout(id);
      } else {
        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY > 0) return;
          tryOpen();
        };
        document.documentElement.addEventListener(
          "mouseleave",
          handleMouseLeave
        );
        teardown = () => {
          document.documentElement.removeEventListener(
            "mouseleave",
            handleMouseLeave
          );
        };
      }
    };

    bind();

    const onMqlChange = () => {
      if (hasTriggeredRef.current) return;
      bind();
    };
    mql.addEventListener("change", onMqlChange);

    return () => {
      mql.removeEventListener("change", onMqlChange);
      teardown?.();
    };
  }, [identityKey, reviews, mobileDelayMs, tryOpen]);

  const setOpenWrapped = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        markDismissedForEntity(entityId);
      }
    },
    [entityId]
  );

  return {
    open,
    setOpen: setOpenWrapped,
    markDismissed,
  };
}
