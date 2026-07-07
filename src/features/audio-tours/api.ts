import { api } from "@/lib/api/http";
import type {
  AudioTour,
  AudioTourListResponse,
  AudioTourProgress,
  UpdateAudioTourProgressPayload,
} from "@/lib/api/types";

function qs(params: Record<string, string | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, v);
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export const audioToursApi = {
  byPlace: (placeId: string, lang?: string) =>
    api.get<AudioTourListResponse>(
      `/audio-tours/places/${placeId}${qs({ lang })}`,
      { auth: false },
    ),

  byId: (id: string) =>
    api.get<AudioTour>(`/audio-tours/${id}`, { auth: false }),

  progress: (id: string) =>
    api.get<AudioTourProgress | null>(`/audio-tours/${id}/progress`),

  updateProgress: (id: string, payload: UpdateAudioTourProgressPayload) =>
    api.patch<AudioTourProgress>(`/audio-tours/${id}/progress`, payload),
};
