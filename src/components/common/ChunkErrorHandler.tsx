"use client";

import { useEffect } from "react";

const CHUNK_RELOAD_ATTEMPTS_KEY = "chunk_reload_attempts";
const CHUNK_RELOAD_LAST_ATTEMPT_KEY = "chunk_reload_last_attempt_at";
const CHUNK_RELOAD_COOLDOWN_UNTIL_KEY = "chunk_reload_cooldown_until";
const CHUNK_RELOAD_EXHAUSTED_EVENT = "icb:chunk-reload-exhausted";

const MAX_RELOAD_ATTEMPTS = 3;
const RETRY_COOLDOWN_MS = 5 * 60 * 1000;
const SUCCESS_RESET_MS = 60 * 1000;

const inMemoryStore: Record<string, string> = {};

function safeRead(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return inMemoryStore[key] ?? null;
  }
}

function safeWrite(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    inMemoryStore[key] = value;
  }
}

function safeRemove(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    delete inMemoryStore[key];
  }
}

function readNumber(key: string): number {
  const value = safeRead(key);
  const parsed = value ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

function resetChunkReloadState() {
  safeRemove(CHUNK_RELOAD_ATTEMPTS_KEY);
  safeRemove(CHUNK_RELOAD_LAST_ATTEMPT_KEY);
  safeRemove(CHUNK_RELOAD_COOLDOWN_UNTIL_KEY);
  document.documentElement.removeAttribute("data-chunk-reload-exhausted");
}

function emitChunkReloadExhausted() {
  document.documentElement.setAttribute("data-chunk-reload-exhausted", "true");
  window.dispatchEvent(new CustomEvent(CHUNK_RELOAD_EXHAUSTED_EVENT));
}

export function ChunkErrorHandler() {
  useEffect(() => {
    const now = Date.now();
    const cooldownUntil = readNumber(CHUNK_RELOAD_COOLDOWN_UNTIL_KEY);
    const lastAttemptAt = readNumber(CHUNK_RELOAD_LAST_ATTEMPT_KEY);

    // Reset stale counters so retries resume after a cooldown or a stable load window.
    if (cooldownUntil > 0 && now >= cooldownUntil) {
      resetChunkReloadState();
    } else if (lastAttemptAt > 0 && now - lastAttemptAt >= RETRY_COOLDOWN_MS) {
      resetChunkReloadState();
    } else {
      document.documentElement.removeAttribute("data-chunk-reload-exhausted");
    }

    const successResetTimer = window.setTimeout(() => {
      resetChunkReloadState();
    }, SUCCESS_RESET_MS);

    const handler = (event: PromiseRejectionEvent) => {
      if (event.reason?.name !== "ChunkLoadError") {
        return;
      }

      const currentNow = Date.now();
      const activeCooldownUntil = readNumber(CHUNK_RELOAD_COOLDOWN_UNTIL_KEY);

      if (activeCooldownUntil > currentNow) {
        emitChunkReloadExhausted();
        return;
      }

      const previousAttemptAt = readNumber(CHUNK_RELOAD_LAST_ATTEMPT_KEY);
      const previousAttempts =
        previousAttemptAt > 0 &&
        currentNow - previousAttemptAt >= RETRY_COOLDOWN_MS
          ? 0
          : readNumber(CHUNK_RELOAD_ATTEMPTS_KEY);

      const nextAttempts = previousAttempts + 1;
      safeWrite(CHUNK_RELOAD_ATTEMPTS_KEY, String(nextAttempts));
      safeWrite(CHUNK_RELOAD_LAST_ATTEMPT_KEY, String(currentNow));

      if (nextAttempts <= MAX_RELOAD_ATTEMPTS) {
        window.location.reload();
        return;
      }

      const nextCooldownUntil = currentNow + RETRY_COOLDOWN_MS;
      safeWrite(CHUNK_RELOAD_COOLDOWN_UNTIL_KEY, String(nextCooldownUntil));
      emitChunkReloadExhausted();
    };

    window.addEventListener("unhandledrejection", handler);
    return () => {
      window.clearTimeout(successResetTimer);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  return null;
}
