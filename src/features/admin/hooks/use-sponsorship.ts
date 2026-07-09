"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api";

export function useActivateSponsorship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      placeId,
      days,
      priority,
    }: {
      placeId: string;
      days: number;
      priority?: number;
    }) => adminApi.activateSponsorship(placeId, days, priority ?? 0),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["places"] });
      qc.invalidateQueries({ queryKey: ["discover"] });
    },
  });
}

export function useDeactivateSponsorship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) => adminApi.deactivateSponsorship(placeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["places"] });
      qc.invalidateQueries({ queryKey: ["discover"] });
    },
  });
}
