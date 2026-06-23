"use client";

import { useQuery } from "@tanstack/react-query";

import { suggestionsApi } from "@/features/suggestions/api";
import { useGeoStore } from "@/features/geo/store/geo-store";
import type {
  PriceBand,
  SafetyZone,
  SuggestionContextResponse,
} from "@/features/suggestions/types";

export interface UseContextSuggestionsResult {
  safetyZone: SafetyZone | null;
  nearbyBeachM: number | null;
  priceBand: PriceBand | null;
  isLoading: boolean;
  data: SuggestionContextResponse | undefined;
}

const TEN_MIN = 10 * 60_000;

export function useContextSuggestions(): UseContextSuggestionsResult {
  const trackingEnabled = useGeoStore((s) => s.trackingEnabled);
  const permission = useGeoStore((s) => s.permission);
  const lastSnapshot = useGeoStore((s) => s.lastSnapshot);

  const canUseGeo =
    trackingEnabled && permission === "granted" && lastSnapshot !== null;

  const lat = canUseGeo ? lastSnapshot!.lat : null;
  const lng = canUseGeo ? lastSnapshot!.lng : null;

  const query = useQuery({
    queryKey: ["suggestions", "context", lat, lng] as const,
    queryFn: () =>
      suggestionsApi.getContext({ lat: lat as number, lng: lng as number }),
    enabled: lat !== null && lng !== null,
    staleTime: TEN_MIN,
  });

  return {
    safetyZone: query.data?.safety_zone ?? null,
    nearbyBeachM: query.data?.nearby_beach_m ?? null,
    priceBand: query.data?.price_band ?? null,
    isLoading: query.isLoading && query.fetchStatus !== "idle",
    data: query.data,
  };
}
