"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/http";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { PlaceDetail, PlaceListResponse } from "@/lib/api/types";

/**
 * Returns the first place owned by the current user.
 * MVP shortcut: the backend has no `/me/places` endpoint, so we paginate
 * `/places` and fetch detail to inspect `owner_id`. Acceptable while the
 * catalog is tiny; replace with a dedicated endpoint when it grows.
 */
export function useOwnedPlace() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ["places", "owned-by", userId],
    queryFn: async (): Promise<PlaceDetail | null> => {
      if (!userId) return null;
      const list = await api.get<PlaceListResponse>(`/places?limit=50`, {
        auth: false,
      });
      // Fetch details in parallel and pick the first whose owner_id matches.
      const details = await Promise.all(
        list.data.map((p) =>
          api.get<PlaceDetail>(`/places/${p.id}`, { auth: false }).catch(() => null),
        ),
      );
      return (
        details.find(
          (d): d is PlaceDetail => !!d && d.owner_id === userId,
        ) ?? null
      );
    },
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}
