"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationsApi } from "@/features/reservations/api";
import { useAuthStore } from "@/features/auth/store/auth-store";

const KEY = ["reservations", "mine"] as const;

export function useMyReservations(page = 1, limit = 50) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: [...KEY, { page, limit }],
    queryFn: () => reservationsApi.mine(page, limit),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
