"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "@/features/favorites/api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type {
  FavoriteListResponse,
  FavoriteToggleResponse,
} from "@/lib/api/types";

const FAV_LIST_KEY = ["favorites", "list"] as const;
const FAV_IDS_KEY = ["favorites", "ids"] as const;

export function useFavorites(page = 1, limit = 20) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: [...FAV_LIST_KEY, { page, limit }],
    queryFn: () => favoritesApi.list(page, limit),
    enabled: !!token,
    staleTime: 30_000,
  });
}

/**
 * Returns a Set<string> of favorited place IDs derived from the current
 * favorites list cache. Cheap to read in cards.
 */
export function useFavoriteIds(): Set<string> {
  const list = useFavorites().data;
  const ids = new Set<string>();
  list?.data.forEach((item) => ids.add(item.place.id));
  return ids;
}

/**
 * Toggle a place's favorite state with optimistic UI: heart fills instantly,
 * reverts on failure.
 */
export function useToggleFavorite() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: (placeId: string) => favoritesApi.toggle(placeId),
    onMutate: async (placeId) => {
      if (!token) return;
      await qc.cancelQueries({ queryKey: FAV_LIST_KEY });
      const snapshot = qc.getQueriesData<FavoriteListResponse>({
        queryKey: FAV_LIST_KEY,
      });

      // Optimistic: remove if exists, otherwise add a stub
      snapshot.forEach(([key, data]) => {
        if (!data) return;
        const exists = data.data.some((f) => f.place.id === placeId);
        const nextData = exists
          ? data.data.filter((f) => f.place.id !== placeId)
          : [
              {
                place: {
                  id: placeId,
                  name: "…",
                  average_rating: 0,
                  total_reviews: 0,
                  price_range: null,
                  cover_photo_url: null,
                  categories: null,
                },
                favorited_at: new Date().toISOString(),
              },
              ...data.data,
            ];
        qc.setQueryData<FavoriteListResponse>(key, {
          ...data,
          data: nextData,
          total: exists ? data.total - 1 : data.total + 1,
        });
      });

      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshot.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSuccess: (data: FavoriteToggleResponse) => {
      // refetch real data — also updates total_reviews etc.
      qc.invalidateQueries({ queryKey: FAV_LIST_KEY });
      qc.invalidateQueries({ queryKey: FAV_IDS_KEY });
      // bump detail so heart matches
      qc.invalidateQueries({
        queryKey: ["places", "detail", data.place_id],
      });
    },
  });
}
