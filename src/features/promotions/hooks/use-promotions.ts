"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promotionsApi } from "@/features/promotions/api";
import type {
  CreatePromotionPayload,
  UpdatePromotionPayload,
} from "@/lib/api/types";

const activeKey = ["promotions", "active"] as const;
const placeKey = (placeId: string) =>
  ["promotions", "by-place", placeId] as const;

export function useActivePromotions(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...activeKey, { page, limit }],
    queryFn: () => promotionsApi.active(page, limit),
    staleTime: 60_000,
  });
}

export function usePromotionsForPlace(placeId: string | undefined) {
  return useQuery({
    queryKey: placeKey(placeId ?? ""),
    queryFn: () => promotionsApi.manageByPlace(placeId!),
    enabled: !!placeId,
    staleTime: 30_000,
  });
}

export function useCreatePromotion(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromotionPayload) =>
      promotionsApi.create(placeId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: placeKey(placeId) });
      qc.invalidateQueries({ queryKey: activeKey });
    },
  });
}

export function useUpdatePromotion(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePromotionPayload;
    }) => promotionsApi.update(placeId, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: placeKey(placeId) });
      qc.invalidateQueries({ queryKey: activeKey });
    },
  });
}

export function useDeletePromotion(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promotionsApi.remove(placeId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: placeKey(placeId) });
      qc.invalidateQueries({ queryKey: activeKey });
    },
  });
}
