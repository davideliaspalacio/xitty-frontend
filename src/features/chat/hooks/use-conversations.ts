"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api";
import { useAuthStore } from "@/features/auth/store/auth-store";

export const CONVERSATIONS_KEY = ["chat", "conversations"] as const;

export function useConversations() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: chatApi.listConversations,
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    // Sin first_message: crea una conversación vacía y devuelve
    // { conversation_id, first_message_id: null }.
    mutationFn: () => chatApi.createConversation(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });
}

export function useDeleteConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.deleteConversation(id),
    onSuccess: (_void, id) => {
      qc.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
      qc.removeQueries({ queryKey: ["chat", "conversation", id] });
    },
  });
}
