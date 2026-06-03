import { api } from "@/lib/api/http";
import type {
  CreatePreferencesPayload,
  Preferences,
  UpdatePreferencesPayload,
} from "@/lib/api/types";

export const preferencesApi = {
  me: () => api.get<Preferences>("/preferences/me"),
  save: (payload: CreatePreferencesPayload) =>
    api.post<Preferences>("/preferences", payload),
  update: (payload: UpdatePreferencesPayload) =>
    api.patch<Preferences>("/preferences/me", payload),
  skip: () => api.post<Preferences>("/preferences/skip"),
};
