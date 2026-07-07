"use client";

import { useQuery } from "@tanstack/react-query";
import { discoverApi } from "@/features/discover/api";
import type { TravelerType } from "@/lib/api/types";

export function useRanking(
  limit = 10,
  travelerType?: TravelerType | null,
  enabled = true,
) {
  return useQuery({
    queryKey: ["discover", "ranking", { limit, travelerType: travelerType ?? null }],
    queryFn: () => discoverApi.ranking(limit, travelerType ?? null),
    enabled,
    staleTime: 60 * 60_000, // 1h — refreshes daily server-side
  });
}

export function useFeaturedCurrent(
  travelerType?: TravelerType | null,
  enabled = true,
) {
  return useQuery({
    queryKey: ["discover", "featured", "current", { travelerType: travelerType ?? null }],
    queryFn: () => discoverApi.featuredCurrent(travelerType ?? null),
    enabled,
    staleTime: 30 * 60_000,
  });
}

export function useLocalPicksCurrent(
  travelerType?: TravelerType | null,
  enabled = true,
) {
  return useQuery({
    queryKey: ["discover", "local-picks", "current", { travelerType: travelerType ?? null }],
    queryFn: () => discoverApi.localPicksCurrent(travelerType ?? null),
    enabled,
    staleTime: 30 * 60_000,
  });
}
