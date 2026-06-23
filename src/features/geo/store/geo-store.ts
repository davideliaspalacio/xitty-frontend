"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type GeoPermission = "unknown" | "granted" | "denied" | "prompt";
export type GeoSource = "gps" | "ip" | "unsupported" | null;

export interface GeoSnapshot {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface GeoState {
  lastSnapshot: GeoSnapshot | null;
  permission: GeoPermission;
  trackingEnabled: boolean;
  source: GeoSource;
  setSnapshot: (snapshot: GeoSnapshot) => void;
  setPermission: (permission: GeoPermission) => void;
  setSource: (source: GeoSource) => void;
  toggleTracking: (value?: boolean) => void;
}

// Guarded storage that never throws on the server.
const safeStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    // Minimal stub for SSR — zustand only calls these synchronously.
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    } as unknown as Storage;
  }
  return window.localStorage;
});

export const useGeoStore = create<GeoState>()(
  persist(
    (set, get) => ({
      lastSnapshot: null,
      permission: "unknown",
      trackingEnabled: true,
      source: null,
      setSnapshot: (snapshot) => set({ lastSnapshot: snapshot }),
      setPermission: (permission) => set({ permission }),
      setSource: (source) => set({ source }),
      toggleTracking: (value) =>
        set({
          trackingEnabled:
            typeof value === "boolean" ? value : !get().trackingEnabled,
        }),
    }),
    {
      name: "xitty-geo",
      storage: safeStorage,
      partialize: (state) => ({
        trackingEnabled: state.trackingEnabled,
      }),
    },
  ),
);
