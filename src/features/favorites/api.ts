import { api } from "@/lib/api/http";
import type {
  FavoriteListResponse,
  FavoriteToggleResponse,
} from "@/lib/api/types";

export const favoritesApi = {
  toggle: (placeId: string) =>
    api.post<FavoriteToggleResponse>(`/places/${placeId}/favorite`),

  list: (page = 1, limit = 20) =>
    api.get<FavoriteListResponse>(`/favorites?page=${page}&limit=${limit}`),
};
