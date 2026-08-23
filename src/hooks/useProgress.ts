"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sareh-alphabet-v1";

export interface Progress {
  stars: number;
  mastered: string[];
}

const DEFAULT_PROGRESS: Progress = { stars: 0, mastered: [] };

function parse(raw: string): Progress {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_PROGRESS;
    const { stars, mastered } = parsed as Record<string, unknown>;
    return {
      stars:
        typeof stars === "number" && Number.isFinite(stars) && stars >= 0 ? Math.floor(stars) : 0,
      mastered: Array.isArray(mastered)
        ? mastered.filter((l): l is string => typeof l === "string")
        : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

/* Tiny external store around localStorage so React subscribes instead of polling. */
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // keep multiple tabs in sync too
  window.addEventListener("storage", emitChange);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", emitChange);
  };
}

let lastRaw: string | null | undefined;
let lastSnapshot: Progress = DEFAULT_PROGRESS;

function getSnapshot(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === lastRaw && lastRaw !== undefined) return lastSnapshot;
  lastRaw = raw;
  lastSnapshot = raw === null ? DEFAULT_PROGRESS : parse(raw);
  return lastSnapshot;
}

function getServerSnapshot(): Progress {
  return DEFAULT_PROGRESS;
}

function persist(next: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep going with in-memory value */
  }
  emitChange();
}

/** Star collection + mastered letters, persisted to localStorage. Hydration-safe. */
export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addStar = useCallback((letter: string) => {
    const current = getSnapshot();
    persist({
      stars: current.stars + 1,
      mastered: current.mastered.includes(letter)
        ? current.mastered
        : [...current.mastered, letter],
    });
  }, []);

  const resetGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    lastRaw = undefined;
    emitChange();
  }, []);

  return { progress, addStar, resetGame };
}
