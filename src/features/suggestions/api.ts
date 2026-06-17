import { api } from "@/lib/api/http";
import type { SuggestionContextResponse } from "@/features/suggestions/types";

function qs(params: Record<string, string | number | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export interface GetContextParams {
  lat: number;
  lng: number;
}

export const suggestionsApi = {
  getContext: (params: GetContextParams) =>
    api.get<SuggestionContextResponse>(
      `/suggestions/context${qs({ lat: params.lat, lng: params.lng })}`,
      { auth: false },
    ),
};
