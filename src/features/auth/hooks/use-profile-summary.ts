"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function useProfileSummary() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["auth", "profile-summary"],
    queryFn: authApi.profileSummary,
    enabled: !!token,
    staleTime: 2 * 60_000,
  });
}
