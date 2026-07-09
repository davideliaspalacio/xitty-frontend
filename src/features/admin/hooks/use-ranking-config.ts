"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api";
import type { UpdateRankingConfigPayload } from "@/features/admin/api";

export const ADMIN_RANKING_CONFIG_KEY = ["admin", "ranking-config"] as const;

export function useRankingConfig() {
  return useQuery({
    queryKey: ADMIN_RANKING_CONFIG_KEY,
    queryFn: () => adminApi.getRankingConfig(),
    staleTime: 60_000,
  });
}

export function useUpdateRankingConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRankingConfigPayload) =>
      adminApi.updateRankingConfig(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_RANKING_CONFIG_KEY });
      qc.invalidateQueries({ queryKey: ["discover", "ranking"] });
    },
  });
}

export function useRefreshRanking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.refreshRanking(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discover", "ranking"] });
    },
  });
}
