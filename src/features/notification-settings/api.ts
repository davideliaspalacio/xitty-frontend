import { api } from "@/lib/api/http";
import type {
  NotificationSettings,
  UpdateNotificationSettingsPayload,
} from "@/lib/api/types";

export const notificationSettingsApi = {
  me: () => api.get<NotificationSettings>("/me/notification-settings"),
  update: (payload: UpdateNotificationSettingsPayload) =>
    api.patch<NotificationSettings>("/me/notification-settings", payload),
};
