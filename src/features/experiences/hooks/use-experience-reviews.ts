"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { experiencesApi } from "@/features/experiences/api";
import type {
  CreateExperienceReviewPayload,
  ExperienceReviewSort,
  UpdateExperienceReviewPayload,
} from "@/lib/api/types";

const reviewsKey = (id: string) =>
  ["experiences", "reviews", id] as const;
const distributionKey = (id: string) =>
  ["experiences", "rating-distribution", id] as const;
const detailKey = (id: string) => ["experiences", "detail", id] as const;

export function useExperienceReviews(
  experienceId: string | undefined | null,
  page = 1,
  limit = 10,
  sort: ExperienceReviewSort = "recent",
) {
  return useQuery({
    queryKey: [...reviewsKey(experienceId ?? ""), { page, limit, sort }],
    queryFn: () => experiencesApi.reviews(experienceId!, page, limit, sort),
    enabled: !!experienceId,
    staleTime: 30_000,
  });
}

export function useExperienceRatingDistribution(
  experienceId: string | undefined | null,
) {
  return useQuery({
    queryKey: distributionKey(experienceId ?? ""),
    queryFn: () => experiencesApi.ratingDistribution(experienceId!),
    enabled: !!experienceId,
    staleTime: 30_000,
  });
}

function invalidateReviewData(
  qc: ReturnType<typeof useQueryClient>,
  experienceId: string,
) {
  qc.invalidateQueries({ queryKey: reviewsKey(experienceId) });
  qc.invalidateQueries({ queryKey: distributionKey(experienceId) });
  qc.invalidateQueries({ queryKey: detailKey(experienceId) });
}

export function useCreateExperienceReview(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExperienceReviewPayload) =>
      experiencesApi.createReview(experienceId, payload),
    onSuccess: () => invalidateReviewData(qc, experienceId),
  });
}

export function useUpdateExperienceReview(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateExperienceReviewPayload) =>
      experiencesApi.updateReview(experienceId, payload),
    onSuccess: () => invalidateReviewData(qc, experienceId),
  });
}

export function useDeleteExperienceReview(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => experiencesApi.deleteReview(experienceId),
    onSuccess: () => invalidateReviewData(qc, experienceId),
  });
}
