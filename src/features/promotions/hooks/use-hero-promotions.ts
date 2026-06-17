"use client";

import { useQuery } from "@tanstack/react-query";
import { promotionsApi } from "@/features/promotions/api";

const heroKey = ["promotions", "hero"] as const;

/**
 * Returns the active hero rotation for the home AdsHero slot.
 * Refreshes every 10 minutes — the rotation is curated server-side
 * and changes infrequently.
 */
export function useHeroPromotions() {
  return useQuery({
    queryKey: heroKey,
    queryFn: () => promotionsApi.hero(),
    staleTime: 10 * 60_000,
  });
}
