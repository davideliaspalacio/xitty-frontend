import { api } from "@/lib/api/http";

export interface FeaturedPlaceSummary {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  address: string | null;
  category_id: string | null;
  average_rating: number;
  total_reviews: number;
  cover_photo_url: string | null;
}

export interface FeaturedEntry {
  id: string;
  place_id: string;
  curator_name: string;
  custom_title: string | null;
  custom_description: string | null;
  hero_image_url: string | null;
  week_starts_at: string;
  week_ends_at: string;
  position: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  place: FeaturedPlaceSummary | null;
}

export interface FeaturedListResponse {
  data: FeaturedEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateFeaturedPayload {
  place_id: string;
  curator_name: string;
  week_starts_at: string;
  week_ends_at: string;
  custom_title?: string;
  custom_description?: string;
  hero_image_url?: string;
  position?: number;
  is_active?: boolean;
}

export type UpdateFeaturedPayload = Partial<
  Omit<CreateFeaturedPayload, "place_id">
>;

export interface SponsorshipResponse {
  place_id: string;
  is_sponsored: boolean;
  sponsored_at: string | null;
  sponsored_until: string | null;
  sponsorship_priority: number;
}

export const adminApi = {
  listFeatured: (page = 1, limit = 20) =>
    api.get<FeaturedListResponse>(`/featured?page=${page}&limit=${limit}`),

  createFeatured: (payload: CreateFeaturedPayload) =>
    api.post<FeaturedEntry>("/admin/featured", payload),

  updateFeatured: (id: string, payload: UpdateFeaturedPayload) =>
    api.patch<FeaturedEntry>(`/admin/featured/${id}`, payload),

  deleteFeatured: (id: string) => api.delete<void>(`/admin/featured/${id}`),

  activateSponsorship: (placeId: string, days: number, priority = 0) =>
    api.post<SponsorshipResponse>(`/admin/places/${placeId}/sponsorship`, {
      duration_days: days,
      priority,
    }),
  deactivateSponsorship: (placeId: string) =>
    api.delete<void>(`/admin/places/${placeId}/sponsorship`),
};
