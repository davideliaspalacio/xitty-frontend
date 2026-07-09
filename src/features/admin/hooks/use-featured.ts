"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api";
import type {
  CreateFeaturedPayload,
  UpdateFeaturedPayload,
} from "@/features/admin/api";

export const ADMIN_FEATURED_KEY = ["admin", "featured"] as const;

export function useAdminFeatured(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...ADMIN_FEATURED_KEY, { page, limit }],
    queryFn: () => adminApi.listFeatured(page, limit),
    staleTime: 30_000,
  });
}

export function useCreateFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeaturedPayload) =>
      adminApi.createFeatured(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_FEATURED_KEY });
      qc.invalidateQueries({ queryKey: ["discover", "featured"] });
    },
  });
}

export function useUpdateFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFeaturedPayload;
    }) => adminApi.updateFeatured(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_FEATURED_KEY });
      qc.invalidateQueries({ queryKey: ["discover", "featured"] });
    },
  });
}

export function useDeleteFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteFeatured(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_FEATURED_KEY });
      qc.invalidateQueries({ queryKey: ["discover", "featured"] });
    },
  });
}
