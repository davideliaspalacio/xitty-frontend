"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { experiencesApi } from "@/features/experiences/api";
import type {
  CreateExperiencePayload,
  CreatePhotoPayload,
  CreateSlotPayload,
  ExperienceDetail,
  UpdateExperiencePayload,
} from "@/lib/api/types";

const ownedKey = (placeId?: string) =>
  ["experiences", "owned", placeId ?? ""] as const;

/**
 * Experiences operated by the given place. The backend has no
 * `?operator_place_id=` filter and the list items don't expose it, so we
 * page the catalog and fetch detail to match — same MVP shortcut as
 * `useOwnedPlace`. Catalog is active-only, so paused experiences won't show.
 */
export function useOwnedExperiences(placeId: string | undefined) {
  return useQuery({
    queryKey: ownedKey(placeId),
    queryFn: async (): Promise<ExperienceDetail[]> => {
      if (!placeId) return [];
      const list = await experiencesApi.list({ limit: 50 });
      const details = await Promise.all(
        list.data.map((e) => experiencesApi.detail(e.id).catch(() => null)),
      );
      return details.filter(
        (d): d is ExperienceDetail =>
          !!d && d.operator_place_id === placeId,
      );
    },
    enabled: !!placeId,
    staleTime: 60_000,
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExperiencePayload) =>
      experiencesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiences"] }),
  });
}

export function useUpdateExperience(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateExperiencePayload) =>
      experiencesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiences"] }),
  });
}

export function useCreateSlot(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSlotPayload) =>
      experiencesApi.createSlot(experienceId, payload),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["experiences", "slots", experienceId],
      }),
  });
}

export function useDeleteSlot(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) =>
      experiencesApi.deleteSlot(experienceId, slotId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["experiences", "slots", experienceId],
      }),
  });
}

export function useAddExperiencePhoto(experienceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePhotoPayload) =>
      experiencesApi.addPhoto(experienceId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiences"] }),
  });
}
