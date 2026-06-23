"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminScrapingApi } from "@/features/admin-scraping/api";
import type {
  CreateScrapingSourcePayload,
  UpdateScrapingSourcePayload,
} from "@/features/admin-scraping/types";

export const SOURCES_KEY = ["admin-scraping", "sources"] as const;

export function useSources() {
  return useQuery({
    queryKey: SOURCES_KEY,
    queryFn: adminScrapingApi.listSources,
    staleTime: 30_000,
  });
}

export function useCreateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateScrapingSourcePayload) =>
      adminScrapingApi.createSource(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOURCES_KEY });
    },
  });
}

export function useToggleSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateScrapingSourcePayload;
    }) => adminScrapingApi.toggleSource(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOURCES_KEY });
    },
  });
}

export function useRunSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminScrapingApi.runSource(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOURCES_KEY });
      qc.invalidateQueries({ queryKey: ["admin-scraping", "runs"] });
      qc.invalidateQueries({ queryKey: ["admin-scraping", "items"] });
    },
  });
}
