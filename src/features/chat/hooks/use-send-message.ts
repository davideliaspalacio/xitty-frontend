"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api";
import {
  CONVERSATIONS_KEY,
} from "@/features/chat/hooks/use-conversations";
import { conversationKey } from "@/features/chat/hooks/use-conversation";
import type {
  ConversationWithMessages,
  Message,
  SendMessageRequest,
  SendMessageResponse,
} from "@/features/chat/types";

interface MutationContext {
  /** Snapshot of the conversation cache (for rollback). */
  previous: ConversationWithMessages | undefined;
  /** The id of the cache entry we wrote into. */
  cacheKey: ReturnType<typeof conversationKey>;
  /** The optimistic user message we injected. */
  optimisticMessageId: string;
}

function tempId(prefix = "tmp"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

/**
 * Sends a message with optimistic UI: pushes the user message into the
 * conversation cache immediately, then replaces it (and appends the
 * assistant reply) when the server responds.
 */
export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation<
    SendMessageResponse,
    Error,
    SendMessageRequest,
    MutationContext
  >({
    mutationFn: (payload) => chatApi.sendMessage(payload),
    onMutate: async (payload) => {
      const cacheKey = conversationKey(payload.conversation_id);
      await qc.cancelQueries({ queryKey: cacheKey });

      const previous = qc.getQueryData<ConversationWithMessages>(cacheKey);

      const optimisticMessageId = tempId("user");
      const userMessage: Message = {
        id: optimisticMessageId,
        conversation_id: payload.conversation_id,
        role: "user",
        content: payload.content,
        created_at: new Date().toISOString(),
        metadata: null,
      };

      if (previous && payload.conversation_id) {
        qc.setQueryData<ConversationWithMessages>(cacheKey, {
          ...previous,
          messages: [...previous.messages, userMessage],
          updated_at: userMessage.created_at,
        });
      }

      return { previous, cacheKey, optimisticMessageId };
    },
    onError: (_err, _payload, ctx) => {
      if (!ctx) return;
      if (ctx.previous) {
        qc.setQueryData(ctx.cacheKey, ctx.previous);
      }
    },
    onSuccess: (response, _payload, ctx) => {
      const finalKey = conversationKey(response.conversation_id);
      const previous =
        (ctx?.previous && ctx.cacheKey[2] === finalKey[2]
          ? ctx.previous
          : qc.getQueryData<ConversationWithMessages>(finalKey)) ?? null;

      // Drop the optimistic placeholder (if any), then append the real
      // user message echoed back (or fall back to a synthetic one) plus
      // the assistant reply.
      const existing = previous?.messages ?? [];
      const withoutOptimistic = ctx
        ? existing.filter((m) => m.id !== ctx.optimisticMessageId)
        : existing;

      const next: ConversationWithMessages = previous
        ? {
            ...previous,
            id: response.conversation_id,
            messages: [...withoutOptimistic, response.message],
            updated_at: response.message.created_at,
          }
        : {
            id: response.conversation_id,
            title: null,
            created_at: response.message.created_at,
            updated_at: response.message.created_at,
            messages: [response.message],
          };

      qc.setQueryData<ConversationWithMessages>(finalKey, next);
      qc.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });
}
