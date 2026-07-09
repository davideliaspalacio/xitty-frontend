import { api } from "@/lib/api/http";

export interface SponsorshipResponse {
  place_id: string;
  is_sponsored: boolean;
  sponsored_at: string | null;
  sponsored_until: string | null;
  sponsorship_priority: number;
}

export const adminApi = {
  activateSponsorship: (placeId: string, days: number, priority = 0) =>
    api.post<SponsorshipResponse>(`/admin/places/${placeId}/sponsorship`, {
      duration_days: days,
      priority,
    }),
  deactivateSponsorship: (placeId: string) =>
    api.delete<void>(`/admin/places/${placeId}/sponsorship`),
};
