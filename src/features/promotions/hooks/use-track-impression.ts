"use client";

import { useCallback } from "react";
import { promotionsApi } from "@/features/promotions/api";

/**
 * Returns a fire-and-forget function that records an ad impression
 * for a hero promotion. Errors are intentionally swallowed — analytics
 * must never break the user's experience.
 */
export function useTrackImpression() {
  return useCallback((promoId: string) => {
    void promotionsApi.trackImpression(promoId).catch(() => {
      // ignore — impression tracking is best-effort
    });
  }, []);
}
