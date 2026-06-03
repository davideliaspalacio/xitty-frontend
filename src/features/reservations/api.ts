import { api } from "@/lib/api/http";
import type { ReservationListResponse } from "@/lib/api/types";

export const reservationsApi = {
  mine: (page = 1, limit = 20) =>
    api.get<ReservationListResponse>(
      `/me/reservations?page=${page}&limit=${limit}`,
    ),

  cancel: (id: string) => api.delete<void>(`/reservations/${id}`),
};
