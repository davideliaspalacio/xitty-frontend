"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
} from "@/lib/api/types";

const listKey = (placeId: string) => ["places", "reviews", placeId] as const;
const detailKey = (placeId: string) =>
  ["places", "detail", placeId] as const;

export function useReviews(placeId: string | undefined, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...listKey(placeId ?? ""), { page, limit }],
    queryFn: () => reviewsApi.list(placeId!, page, limit),
    enabled: !!placeId,
    staleTime: 30_000,
  });
}

export function useCreateReview(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewsApi.create(placeId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey(placeId) });
      qc.invalidateQueries({ queryKey: detailKey(placeId) });
    },
  });
}

export function useUpdateReview(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateReviewPayload) =>
      reviewsApi.update(placeId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey(placeId) });
      qc.invalidateQueries({ queryKey: detailKey(placeId) });
    },
  });
}

export function useDeleteReview(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => reviewsApi.remove(placeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey(placeId) });
      qc.invalidateQueries({ queryKey: detailKey(placeId) });
    },
  });
}
