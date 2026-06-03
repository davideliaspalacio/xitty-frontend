"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { preferencesApi } from "@/features/preferences/api";
import { useAuthStore } from "@/features/auth/store/auth-store";

const KEY = ["preferences", "me"] as const;

export function usePreferences(enabled = true) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: KEY,
    queryFn: preferencesApi.me,
    enabled: enabled && !!token,
    staleTime: 5 * 60_000,
  });
}

export function useSavePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: preferencesApi.save,
    onSuccess: (data) => {
      qc.setQueryData(KEY, data);
    },
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: preferencesApi.update,
    onSuccess: (data) => qc.setQueryData(KEY, data),
  });
}

export function useSkipPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: preferencesApi.skip,
    onSuccess: (data) => qc.setQueryData(KEY, data),
  });
}
