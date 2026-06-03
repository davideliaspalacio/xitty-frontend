import { api } from "@/lib/api/http";
import type {
  CreateExperiencePayload,
  CreateExperienceReviewPayload,
  CreatePhotoPayload,
  CreateReservationPayload,
  CreateSlotPayload,
  ExperienceDetail,
  ExperienceListQuery,
  ExperienceListResponse,
  ExperienceReview,
  ExperienceReviewListResponse,
  ExperienceReviewSort,
  ExperienceSlot,
  PlacePhoto,
  RatingDistribution,
  Reservation,
  UpdateExperiencePayload,
  UpdateExperienceReviewPayload,
} from "@/lib/api/types";

function qs(params: object) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export const experiencesApi = {
  list: (query: ExperienceListQuery = {}) =>
    api.get<ExperienceListResponse>(`/experiences${qs(query)}`, { auth: false }),

  detail: (id: string) =>
    api.get<ExperienceDetail>(`/experiences/${id}`, { auth: false }),

  slots: (id: string) =>
    api.get<ExperienceSlot[]>(`/experiences/${id}/slots`, { auth: false }),

  reserve: (id: string, payload: CreateReservationPayload) =>
    api.post<Reservation>(`/experiences/${id}/reservations`, payload),

  reviews: (
    id: string,
    page = 1,
    limit = 10,
    sort: ExperienceReviewSort = "recent",
  ) =>
    api.get<ExperienceReviewListResponse>(
      `/experiences/${id}/reviews${qs({ page, limit, sort })}`,
      { auth: false },
    ),

  ratingDistribution: (id: string) =>
    api.get<RatingDistribution>(`/experiences/${id}/rating-distribution`, {
      auth: false,
    }),

  createReview: (id: string, payload: CreateExperienceReviewPayload) =>
    api.post<ExperienceReview>(`/experiences/${id}/reviews`, payload),

  updateReview: (id: string, payload: UpdateExperienceReviewPayload) =>
    api.patch<ExperienceReview>(`/experiences/${id}/reviews`, payload),

  deleteReview: (id: string) =>
    api.delete<void>(`/experiences/${id}/reviews`),

  // ── Management (owner/admin) ─────────────────────────────────────
  create: (payload: CreateExperiencePayload) =>
    api.post<ExperienceDetail>("/experiences", payload),

  update: (id: string, payload: UpdateExperiencePayload) =>
    api.patch<ExperienceDetail>(`/experiences/${id}`, payload),

  createSlot: (id: string, payload: CreateSlotPayload) =>
    api.post<ExperienceSlot>(`/experiences/${id}/slots`, payload),

  deleteSlot: (id: string, slotId: string) =>
    api.delete<void>(`/experiences/${id}/slots/${slotId}`),

  addPhoto: (id: string, payload: CreatePhotoPayload) =>
    api.post<PlacePhoto>(`/experiences/${id}/photos`, payload),
};
