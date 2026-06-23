"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api";
import { useAuthStore } from "@/features/auth/store/auth-store";

export const conversationKey = (id: string | null | undefined) =>
  ["chat", "conversation", id ?? ""] as const;

export function useConversation(id: string | null | undefined) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: conversationKey(id),
    queryFn: () => chatApi.getConversation(id!),
    enabled: !!id && !!token,
    staleTime: 10_000,
  });
}
