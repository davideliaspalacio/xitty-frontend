"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { experiencesApi } from "@/features/experiences/api";
import type {
  CreateReservationPayload,
  ExperienceListQuery,
} from "@/lib/api/types";

export function useExperiences(query: ExperienceListQuery = {}) {
  return useQuery({
    queryKey: ["experiences", "list", query],
    queryFn: () => experiencesApi.list(query),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useExperienceById(id: string | undefined | null) {
  return useQuery({
    queryKey: ["experiences", "detail", id],
    queryFn: () => experiencesApi.detail(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useExperienceSlots(id: string | undefined | null) {
  return useQuery({
    queryKey: ["experiences", "slots", id],
    queryFn: () => experiencesApi.slots(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateReservation(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReservationPayload) =>
      experiencesApi.reserve(experienceId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experiences", "slots", experienceId] });
      qc.invalidateQueries({ queryKey: ["reservations", "mine"] });
    },
  });
}
