"use client";

import { useQuery } from "@tanstack/react-query";
import { adminScrapingApi } from "@/features/admin-scraping/api";
import type { ListRunsQuery } from "@/features/admin-scraping/types";

export const RUNS_KEY = (query: ListRunsQuery = {}) =>
  ["admin-scraping", "runs", query] as const;

export function useRuns(query: ListRunsQuery = {}) {
  return useQuery({
    queryKey: RUNS_KEY(query),
    queryFn: () => adminScrapingApi.listRuns(query),
    staleTime: 15_000,
  });
}
