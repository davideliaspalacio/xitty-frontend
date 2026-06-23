"use client";

import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/features/recommendations/api";
import { useGeoStore } from "@/features/geo/store/geo-store";
import type {
  RecommendationItem,
  TodayResponse,
} from "@/features/recommendations/types";

const DEFAULT_LIMIT = 5;

export interface UseTodayResult {
  items: RecommendationItem[];
  data: TodayResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useTodayRecommendations(limit = DEFAULT_LIMIT): UseTodayResult {
  const trackingEnabled = useGeoStore((s) => s.trackingEnabled);
  const permission = useGeoStore((s) => s.permission);
  const lastSnapshot = useGeoStore((s) => s.lastSnapshot);

  const canUseGeo =
    trackingEnabled && permission === "granted" && lastSnapshot !== null;

  const lat = canUseGeo ? lastSnapshot!.lat : null;
  const lng = canUseGeo ? lastSnapshot!.lng : null;

  const query = useQuery({
    queryKey: ["recommendations", "today", lat, lng] as const,
    queryFn: () => recommendationsApi.getToday({ lat, lng, limit }),
    staleTime: 30 * 60_000, // 30 min
  });

  return {
    items: query.data?.items ?? [],
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
