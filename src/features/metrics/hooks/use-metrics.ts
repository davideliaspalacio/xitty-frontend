"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { metricsApi } from "@/features/metrics/api";
import type {
  TimeseriesGranularity,
  TrackInteractionPayload,
} from "@/lib/api/types";

export function useTrackInteraction(placeId: string) {
  return useMutation({
    mutationFn: (payload: TrackInteractionPayload) =>
      metricsApi.track(placeId, payload),
    // fire and forget — failures don't matter
    onError: () => {},
  });
}

export function useMetricsSummary(
  placeId: string | undefined,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["metrics", "summary", placeId, from, to],
    queryFn: () => metricsApi.summary(placeId!, from, to),
    enabled: !!placeId,
    staleTime: 5 * 60_000,
  });
}

export function useMetricsTimeseries(
  placeId: string | undefined,
  from: string,
  to: string,
  granularity: TimeseriesGranularity = "day",
) {
  return useQuery({
    queryKey: ["metrics", "timeseries", placeId, from, to, granularity],
    queryFn: () => metricsApi.timeseries(placeId!, from, to, granularity),
    enabled: !!placeId,
    staleTime: 5 * 60_000,
  });
}
