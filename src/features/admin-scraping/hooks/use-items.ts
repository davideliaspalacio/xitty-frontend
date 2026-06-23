"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminScrapingApi } from "@/features/admin-scraping/api";
import type {
  ListItemsQuery,
  UpdateScrapedItemPayload,
} from "@/features/admin-scraping/types";

export const ITEMS_KEY = (query: ListItemsQuery = {}) =>
  ["admin-scraping", "items", query] as const;

export const ITEM_KEY = (id: string) =>
  ["admin-scraping", "items", "detail", id] as const;

export function useItems(query: ListItemsQuery = {}) {
  return useQuery({
    queryKey: ITEMS_KEY(query),
    queryFn: () => adminScrapingApi.listItems(query),
    staleTime: 15_000,
  });
}

export function useItem(id: string | null | undefined) {
  return useQuery({
    queryKey: ITEM_KEY(id ?? ""),
    queryFn: () => adminScrapingApi.getItem(id as string),
    enabled: !!id,
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["admin-scraping", "items"] });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateScrapedItemPayload;
    }) => adminScrapingApi.updateItem(id, payload),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useApproveItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminScrapingApi.approveItem(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRejectItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminScrapingApi.rejectItem(id, reason),
    onSuccess: () => invalidateAll(qc),
  });
}

export function usePublishItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminScrapingApi.publishItem(id),
    onSuccess: () => invalidateAll(qc),
  });
}
