"use client";

import { useQuery } from "@tanstack/react-query";
import { discoverApi } from "@/features/discover/api";

export function useRanking(limit = 10) {
  return useQuery({
    queryKey: ["discover", "ranking", { limit }],
    queryFn: () => discoverApi.ranking(limit),
    staleTime: 60 * 60_000, // 1h — refreshes daily server-side
  });
}

export function useFeaturedCurrent() {
  return useQuery({
    queryKey: ["discover", "featured", "current"],
    queryFn: discoverApi.featuredCurrent,
    staleTime: 30 * 60_000,
  });
}

export function useLocalPicksCurrent() {
  return useQuery({
    queryKey: ["discover", "local-picks", "current"],
    queryFn: discoverApi.localPicksCurrent,
    staleTime: 30 * 60_000,
  });
}
