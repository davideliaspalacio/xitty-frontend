"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { placesApi } from "@/features/places/api";
import type { PlaceListQuery, PlaceSearchQuery } from "@/lib/api/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: placesApi.categories,
    staleTime: 60 * 60_000, // 1h — rarely change
  });
}

export function usePlaces(query: PlaceListQuery = {}) {
  return useQuery({
    queryKey: ["places", "list", query],
    queryFn: () => placesApi.list(query),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function usePlaceSearch(query: PlaceSearchQuery) {
  const trimmed = query.q?.trim() ?? "";
  return useQuery({
    queryKey: ["places", "search", { ...query, q: trimmed }],
    queryFn: () => placesApi.search({ ...query, q: trimmed }),
    enabled: trimmed.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function usePlaceById(id: string | undefined | null) {
  return useQuery({
    queryKey: ["places", "detail", id],
    queryFn: () => placesApi.detail(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}
