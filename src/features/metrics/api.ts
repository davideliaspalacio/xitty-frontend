import { api } from "@/lib/api/http";
import type {
  MetricsBucket,
  MetricsSummary,
  TimeseriesGranularity,
  TrackInteractionPayload,
} from "@/lib/api/types";

export const metricsApi = {
  track: (placeId: string, payload: TrackInteractionPayload) =>
    api.post<void>(`/places/${placeId}/interactions`, payload, {
      // auth optional — the backend tries to extract bearer if present
      auth: true,
    }),

  summary: (placeId: string, from: string, to: string) =>
    api.get<MetricsSummary>(
      `/places/${placeId}/metrics/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),

  timeseries: (
    placeId: string,
    from: string,
    to: string,
    granularity: TimeseriesGranularity = "day",
  ) =>
    api.get<MetricsBucket[]>(
      `/places/${placeId}/metrics/timeseries?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&granularity=${granularity}`,
    ),
};
