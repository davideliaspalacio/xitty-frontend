"use client";

import { useGeoStore } from "@/features/geo/store/geo-store";

interface GeoToggleProps {
  className?: string;
}

/**
 * Settings toggle that flips the persisted `trackingEnabled` flag. Pure UI:
 * the heartbeat hook reacts to the flag change and starts/stops watching
 * accordingly.
 */
export function GeoToggle({ className }: GeoToggleProps) {
  const trackingEnabled = useGeoStore((s) => s.trackingEnabled);
  const toggleTracking = useGeoStore((s) => s.toggleTracking);

  return (
    <label
      className={`flex items-center justify-between gap-3 ${className ?? ""}`}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium text-[var(--text)]">
          Compartir ubicación
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          Permite recomendaciones cerca de ti. Puedes desactivarlo cuando
          quieras.
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={trackingEnabled}
        onChange={(e) => toggleTracking(e.target.checked)}
        className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-[var(--border)] transition-colors checked:bg-[var(--accent)] relative before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
        aria-label="Compartir ubicación"
      />
    </label>
  );
}
