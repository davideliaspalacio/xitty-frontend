import { api } from "@/lib/api/http";
import type { TodayResponse } from "@/features/recommendations/types";

function qs(params: Record<string, string | number | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export interface GetTodayParams {
  lat?: number | null;
  lng?: number | null;
  limit?: number;
}

export const recommendationsApi = {
  getToday: (params: GetTodayParams = {}) =>
    api.get<TodayResponse>(
      `/recommendations/today${qs({
        lat: params.lat ?? undefined,
        lng: params.lng ?? undefined,
        limit: params.limit ?? undefined,
      })}`,
    ),
};
