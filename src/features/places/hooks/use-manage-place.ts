"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { placesApi } from "@/features/places/api";
import type {
  CreatePhotoPayload,
  CreatePlacePayload,
  UpdatePlacePayload,
} from "@/lib/api/types";

/**
 * Owner/admin mutations for the dashboard. They invalidate the whole
 * `["places"]` tree so the owned-place query, detail and lists refetch.
 */

export function useCreatePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlacePayload) => placesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["places"] }),
  });
}

export function useUpdatePlace(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePlacePayload) =>
      placesApi.update(placeId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["places"] }),
  });
}

export function useAddPlacePhoto(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePhotoPayload) =>
      placesApi.addPhoto(placeId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["places"] }),
  });
}
