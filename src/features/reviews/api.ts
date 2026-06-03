import { api } from "@/lib/api/http";
import type {
  CreateReviewPayload,
  Review,
  ReviewListResponse,
  UpdateReviewPayload,
} from "@/lib/api/types";

export const reviewsApi = {
  list: (placeId: string, page = 1, limit = 10) =>
    api.get<ReviewListResponse>(
      `/places/${placeId}/reviews?page=${page}&limit=${limit}`,
      { auth: false },
    ),

  create: (placeId: string, payload: CreateReviewPayload) =>
    api.post<Review>(`/places/${placeId}/reviews`, payload),

  update: (placeId: string, payload: UpdateReviewPayload) =>
    api.patch<Review>(`/places/${placeId}/reviews`, payload),

  remove: (placeId: string) =>
    api.delete<void>(`/places/${placeId}/reviews`),
};
