"use client";

import { useCallback, useEffect, useState } from "react";
import type { TravelerType } from "@/lib/api/types";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

const STORAGE_KEY = "xitty:traveler-filter";

const VALID: TravelerType[] = [
  "nomada",
  "pareja",
  "familia",
  "negocios",
  "excursion",
];

function readSession(): TravelerType | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if ((VALID as string[]).includes(raw)) return raw as TravelerType;
    return null;
  } catch {
    return null;
  }
}

function writeSession(value: TravelerType | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.sessionStorage.setItem(STORAGE_KEY, value);
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore quota / privacy errors
  }
}

/**
 * Traveler-type filter for the current session.
 *
 * Source of truth:
 *   1. sessionStorage override (temporary, while the user browses).
 *   2. permanent preference from the preferences store as initial fallback.
 *
 * Only sessionStorage is mutated — the user's saved preferences are not
 * touched here (this is an in-session override, not a profile edit).
 */
export function useTravelerFilter() {
  const prefs = usePreferences();
  const prefsTraveler = prefs.data?.traveler_type ?? null;

  // Initialise from sessionStorage; if none, fall back to the preferences value
  // once it has loaded.
  const [travelerType, setTravelerTypeState] = useState<TravelerType | null>(
    () => readSession(),
  );
  const [hasSessionValue, setHasSessionValue] = useState<boolean>(
    () => readSession() !== null,
  );

  // When preferences arrive, hydrate the filter only if there is no
  // explicit session override yet.
  useEffect(() => {
    if (hasSessionValue) return;
    if (prefsTraveler && travelerType !== prefsTraveler) {
      setTravelerTypeState(prefsTraveler);
    }
  }, [prefsTraveler, hasSessionValue, travelerType]);

  const setTravelerType = useCallback((next: TravelerType | null) => {
    setTravelerTypeState(next);
    setHasSessionValue(next !== null);
    writeSession(next);
  }, []);

  return { travelerType, setTravelerType };
}
