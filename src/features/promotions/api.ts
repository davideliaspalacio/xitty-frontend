import { api } from "@/lib/api/http";
import type {
  ActivePromotionListItem,
  CreatePromotionPayload,
  Paginated,
  Promotion,
  UpdatePromotionPayload,
} from "@/lib/api/types";

export const promotionsApi = {
  active: (page = 1, limit = 20) =>
    api.get<Paginated<ActivePromotionListItem>>(
      `/promotions/active?page=${page}&limit=${limit}`,
      { auth: false },
    ),

  byPlace: (placeId: string) =>
    api.get<Promotion[]>(`/places/${placeId}/promotions`, { auth: false }),

  create: (placeId: string, payload: CreatePromotionPayload) =>
    api.post<Promotion>(`/places/${placeId}/promotions`, payload),

  update: (placeId: string, id: string, payload: UpdatePromotionPayload) =>
    api.patch<Promotion>(`/places/${placeId}/promotions/${id}`, payload),

  remove: (placeId: string, id: string) =>
    api.delete<void>(`/places/${placeId}/promotions/${id}`),
};
