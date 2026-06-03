import { api } from "@/lib/api/http";
import type {
  Category,
  CreatePhotoPayload,
  CreatePlacePayload,
  PlaceDetail,
  PlaceListQuery,
  PlaceListResponse,
  PlacePhoto,
  PlaceSearchQuery,
  UpdatePlacePayload,
} from "@/lib/api/types";

function qs(params: object): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export const placesApi = {
  categories: () =>
    api.get<Category[]>("/categories", { auth: false }),

  list: (query: PlaceListQuery = {}) =>
    api.get<PlaceListResponse>(`/places${qs(query)}`, { auth: false }),

  search: (query: PlaceSearchQuery) =>
    api.get<PlaceListResponse>(`/places/search${qs(query)}`, { auth: false }),

  detail: (id: string) =>
    api.get<PlaceDetail>(`/places/${id}`, { auth: false }),

  // ── Management (owner/admin) ─────────────────────────────────────
  create: (payload: CreatePlacePayload) =>
    api.post<PlaceDetail>("/places", payload),

  update: (id: string, payload: UpdatePlacePayload) =>
    api.patch<PlaceDetail>(`/places/${id}`, payload),

  addPhoto: (id: string, payload: CreatePhotoPayload) =>
    api.post<PlacePhoto>(`/places/${id}/photos`, payload),
};
