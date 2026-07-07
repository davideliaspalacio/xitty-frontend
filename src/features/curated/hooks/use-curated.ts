"use client";

import { useQuery } from "@tanstack/react-query";
import { curatedApi } from "@/features/curated/api";
import type { GetCuratedParams } from "@/features/curated/types";

const DEFAULT_STALE_MS = 15 * 60_000; // 15 min — curated feed refreshes server-side

export function useCurated(
  params: GetCuratedParams = {},
  options: { enabled?: boolean } = {},
) {
  const limit = params.limit ?? null;
  const category = params.category ?? null;

  return useQuery({
    queryKey: ["curated", "list", { limit, category }] as const,
    queryFn: () => curatedApi.getCurated(params),
    enabled: options.enabled ?? true,
    staleTime: DEFAULT_STALE_MS,
  });
}

export function useCuratedById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["curated", "detail", id] as const,
    queryFn: () => curatedApi.getCuratedById(id as string),
    enabled: !!id,
    staleTime: DEFAULT_STALE_MS,
  });
}
