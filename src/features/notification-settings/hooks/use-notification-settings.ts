"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationSettingsApi } from "@/features/notification-settings/api";
import { useAuthStore } from "@/features/auth/store/auth-store";

const KEY = ["notification-settings", "me"] as const;

export function useNotificationSettings() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: KEY,
    queryFn: notificationSettingsApi.me,
    enabled: !!token,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateNotificationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationSettingsApi.update,
    onSuccess: (data) => qc.setQueryData(KEY, data),
  });
}
