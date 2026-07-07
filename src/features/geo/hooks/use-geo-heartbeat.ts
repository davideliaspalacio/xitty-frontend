"use client";

import { useEffect, useRef } from "react";

import { geoApi } from "@/features/geo/api/geo-api";
import {
  useGeoStore,
  type GeoSnapshot,
} from "@/features/geo/store/geo-store";

const FLUSH_INTERVAL_MS = 5 * 60_000; // 5 minutes
const BATCH_SIZE = 5;

/**
 * Watches the user position while the tab is visible and the user has opted
 * into tracking. Snapshots are buffered and POSTed in batches (either every
 * 5 minutes or as soon as 5 snapshots have been collected). Pauses on
 * `visibilitychange -> hidden` and resumes on `visible`. Degrades to a no-op
 * when `navigator.geolocation` is unavailable.
 */
export function useGeoHeartbeat(enabled = true) {
  const trackingEnabled = useGeoStore((s) => s.trackingEnabled);
  const setSnapshot = useGeoStore((s) => s.setSnapshot);
  const setPermission = useGeoStore((s) => s.setPermission);
  const setSource = useGeoStore((s) => s.setSource);

  const bufferRef = useRef<GeoSnapshot[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) return;

    if (!("geolocation" in navigator) || !navigator.geolocation) {
      setSource("unsupported");
      return;
    }

    if (!trackingEnabled) return;

    const flush = async () => {
      if (bufferRef.current.length === 0) return;
      const batch = bufferRef.current;
      bufferRef.current = [];
      try {
        await geoApi.saveSnapshots(batch);
      } catch {
        // Best-effort: drop the batch on failure to avoid unbounded growth.
        // A future iteration could retry with backoff.
      }
    };

    const start = () => {
      if (watchIdRef.current !== null) return;
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const snapshot: GeoSnapshot = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
          setSnapshot(snapshot);
          setPermission("granted");
          setSource("gps");
          bufferRef.current.push(snapshot);
          if (bufferRef.current.length >= BATCH_SIZE) {
            void flush();
          }
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) setPermission("denied");
        },
        { enableHighAccuracy: true, maximumAge: 30_000, timeout: 30_000 },
      );

      if (flushTimerRef.current === null) {
        flushTimerRef.current = setInterval(() => {
          void flush();
        }, FLUSH_INTERVAL_MS);
      }
    };

    const stop = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (flushTimerRef.current !== null) {
        clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stop();
        void flush();
      } else if (document.visibilityState === "visible") {
        start();
      }
    };

    if (document.visibilityState === "visible") {
      start();
    }

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
      void flush();
    };
  }, [enabled, trackingEnabled, setSnapshot, setPermission, setSource]);
}
