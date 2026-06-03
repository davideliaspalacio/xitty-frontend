import { api } from "@/lib/api/http";

export interface SponsorshipResponse {
  place_id: string;
  is_sponsored: boolean;
  sponsored_at: string | null;
  sponsored_until: string | null;
}

export const adminApi = {
  activateSponsorship: (placeId: string, days: number) =>
    api.post<SponsorshipResponse>(
      `/admin/places/${placeId}/sponsorship`,
      { days },
    ),
  deactivateSponsorship: (placeId: string) =>
    api.delete<void>(`/admin/places/${placeId}/sponsorship`),
};
