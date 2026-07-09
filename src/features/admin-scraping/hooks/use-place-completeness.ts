"use client";

import { useQuery } from "@tanstack/react-query";
import { adminScrapingApi } from "@/features/admin-scraping/api";
import type { ListPlaceCompletenessQuery } from "@/features/admin-scraping/types";

export const PLACE_COMPLETENESS_KEY = (
  query: ListPlaceCompletenessQuery = {},
) => ["admin-scraping", "place-completeness", query] as const;

export function usePlaceCompleteness(query: ListPlaceCompletenessQuery = {}) {
  return useQuery({
    queryKey: PLACE_COMPLETENESS_KEY(query),
    queryFn: () => adminScrapingApi.listPlaceCompleteness(query),
    staleTime: 30_000,
  });
}
