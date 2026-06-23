"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useContextSuggestions } from "@/features/suggestions/hooks/use-context-suggestions";
import type { SafetyTone } from "@/features/suggestions/types";

const TONE_TOAST: Record<
  SafetyTone,
  (neighborhood: string) => { kind: "success" | "info" | "warning"; msg: string }
> = {
  good: (n) => ({ kind: "success", msg: `Estás en ${n} · zona segura` }),
  ok: (n) => ({ kind: "info", msg: `Estás en ${n} · zona tranquila` }),
  caution: (n) => ({
    kind: "warning",
    msg: `Estás en ${n} · ten precaución`,
  }),
};

/**
 * Headless component: renders nothing, just listens to context changes and
 * fires a non-intrusive sonner toast when the user's neighborhood changes.
 */
export function ContextToast() {
  const { safetyZone } = useContextSuggestions();
  const lastNeighborhoodRef = useRef<string | null>(null);

  useEffect(() => {
    if (!safetyZone) return;
    const next = safetyZone.neighborhood;
    if (!next) return;
    if (lastNeighborhoodRef.current === next) return;

    // Skip the very first time so we don't spam a toast on mount.
    const isFirst = lastNeighborhoodRef.current === null;
    lastNeighborhoodRef.current = next;
    if (isFirst) return;

    const { kind, msg } = TONE_TOAST[safetyZone.tone](next);
    if (kind === "success") toast.success(msg);
    else if (kind === "warning") toast.warning(msg);
    else toast.info(msg);
  }, [safetyZone]);

  return null;
}
