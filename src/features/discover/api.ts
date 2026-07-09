import { api } from "@/lib/api/http";
import type {
  FeaturedItem,
  LocalPickItem,
  RankingListResponse,
  TravelerType,
} from "@/lib/api/types";

function qs(params: Record<string, string | number | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export const discoverApi = {
  ranking: (
    limit = 10,
    travelerType?: TravelerType | null,
    city?: string | null,
  ) =>
    api.get<RankingListResponse>(
      `/ranking${qs({
        limit,
        traveler_type: travelerType ?? undefined,
        city: city ?? undefined,
      })}`,
      { auth: false },
    ),

  featuredCurrent: (travelerType?: TravelerType | null) =>
    api.get<FeaturedItem[]>(
      `/featured/current${qs({ traveler_type: travelerType ?? undefined })}`,
      { auth: false },
    ),

  localPicksCurrent: (travelerType?: TravelerType | null) =>
    api.get<LocalPickItem[]>(
      `/local-picks/current${qs({ traveler_type: travelerType ?? undefined })}`,
      { auth: false },
    ),
};
