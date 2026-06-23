"use client";

import { MapPin, MapPinOff } from "lucide-react";

import { useGeoStore } from "@/features/geo/store/geo-store";
import { Button } from "@/shared/ui/button";

/**
 * Visible status banner for the user's location-sharing state.
 * - prompt:  asks the user to grant permission
 * - denied:  explains how to re-enable in browser settings
 * - granted: shows a small unobtrusive "active" badge
 * - tracking off: renders nothing
 */
export function LocationBanner() {
  const permission = useGeoStore((s) => s.permission);
  const trackingEnabled = useGeoStore((s) => s.trackingEnabled);
  const setPermission = useGeoStore((s) => s.setPermission);

  if (!trackingEnabled) return null;

  if (permission === "prompt" || permission === "unknown") {
    const requestPermission = () => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        setPermission("denied");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        () => setPermission("granted"),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setPermission("denied");
          }
        },
        { enableHighAccuracy: true, timeout: 15_000 },
      );
    };

    return (
      <div
        role="status"
        className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
      >
        <div className="flex items-center gap-2 text-[var(--text)]">
          <MapPin className="h-4 w-4 text-[var(--accent)]" aria-hidden />
          <span>Activa tu ubicación para recomendaciones cerca de ti</span>
        </div>
        <Button size="sm" onClick={requestPermission}>
          Permitir
        </Button>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div
        role="status"
        className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
      >
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <MapPinOff className="h-4 w-4" aria-hidden />
          <span>
            Sin acceso a ubicación. Cámbialo en los ajustes del navegador.
          </span>
        </div>
        <a
          href="https://support.google.com/chrome/answer/142065"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Cómo activarla
        </a>
      </div>
    );
  }

  if (permission === "granted") {
    return (
      <span
        role="status"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--text-muted)] border border-[var(--border)]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
        Ubicación activa
      </span>
    );
  }

  return null;
}
