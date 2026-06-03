import { api } from "@/lib/api/http";
import type {
  FeaturedItem,
  LocalPickItem,
  RankingListResponse,
} from "@/lib/api/types";

export const discoverApi = {
  ranking: (limit = 10) =>
    api.get<RankingListResponse>(`/ranking?limit=${limit}`, { auth: false }),

  featuredCurrent: () =>
    api.get<FeaturedItem[]>(`/featured/current`, { auth: false }),

  localPicksCurrent: () =>
    api.get<LocalPickItem[]>(`/local-picks/current`, { auth: false }),
};
