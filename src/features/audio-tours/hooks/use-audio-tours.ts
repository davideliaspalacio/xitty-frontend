"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { audioToursApi } from "@/features/audio-tours/api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { UpdateAudioTourProgressPayload } from "@/lib/api/types";

export const audioToursKey = (placeId: string, lang?: string) =>
  ["audio-tours", "place", placeId, lang ?? "all"] as const;

export const audioTourProgressKey = (tourId: string) =>
  ["audio-tours", "progress", tourId] as const;

export function useAudioTours(placeId: string, lang?: string) {
  return useQuery({
    queryKey: audioToursKey(placeId, lang),
    queryFn: () => audioToursApi.byPlace(placeId, lang),
    staleTime: 10 * 60_000,
  });
}

export function useAudioTourProgress(tourId?: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: audioTourProgressKey(tourId ?? ""),
    queryFn: () => audioToursApi.progress(tourId!),
    enabled: !!token && !!tourId,
    staleTime: 60_000,
  });
}

export function useUpdateAudioTourProgress(tourId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAudioTourProgressPayload) =>
      audioToursApi.updateProgress(tourId, payload),
    onSuccess: (data) => {
      qc.setQueryData(audioTourProgressKey(tourId), data);
    },
  });
}
