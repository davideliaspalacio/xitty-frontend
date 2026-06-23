"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api";
import { CONVERSATIONS_KEY } from "@/features/chat/hooks/use-conversations";
import { conversationKey } from "@/features/chat/hooks/use-conversation";
import type {
  ConversationWithMessages,
  Message,
  SendMessageRequest,
  SendMessageResult,
} from "@/features/chat/types";

interface MutationContext {
  previous: ConversationWithMessages | undefined;
  cacheKey: ReturnType<typeof conversationKey>;
}

function tempId(prefix = "tmp"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

/**
 * Envía un mensaje al chat. Dos caminos según el backend:
 *   - Conversación nueva (sin id): POST /chat/conversations { first_message }
 *   - Conversación existente:      POST /chat/conversations/:id/messages { content }
 *
 * En ambos casos rehidratamos el cache desde el server (que ya tiene el turno
 * del usuario + la respuesta del assistant), así que el optimistic update es
 * solo para feedback inmediato en conversaciones existentes.
 */
export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation<
    SendMessageResult,
    Error,
    SendMessageRequest,
    MutationContext
  >({
    mutationFn: async (payload): Promise<SendMessageResult> => {
      if (payload.conversation_id) {
        await chatApi.postMessage(payload.conversation_id, payload.content);
        return { conversation_id: payload.conversation_id };
      }
      const created = await chatApi.createConversation(payload.content);
      return { conversation_id: created.conversation_id };
    },

    onMutate: async (payload) => {
      // Optimistic solo cuando ya existe la conversación (tenemos su cache key).
      if (!payload.conversation_id) {
        return { previous: undefined, cacheKey: conversationKey(undefined) };
      }
      const cacheKey = conversationKey(payload.conversation_id);
      await qc.cancelQueries({ queryKey: cacheKey });
      const previous =
        qc.getQueryData<ConversationWithMessages>(cacheKey);

      if (previous) {
        const userMessage: Message = {
          id: tempId("user"),
          conversation_id: payload.conversation_id,
          role: "user",
          content: payload.content,
          created_at: new Date().toISOString(),
          metadata: null,
        };
        qc.setQueryData<ConversationWithMessages>(cacheKey, {
          ...previous,
          messages: [...previous.messages, userMessage],
          updated_at: userMessage.created_at,
        });
      }
      return { previous, cacheKey };
    },

    onError: (_err, _payload, ctx) => {
      // Revertir el optimistic; el refetch de onSettled corrige el resto.
      if (ctx?.previous && ctx.cacheKey) {
        qc.setQueryData(ctx.cacheKey, ctx.previous);
      }
    },

    onSuccess: (result) => {
      // El server es la fuente de verdad: invalidar la conversación fuerza un
      // refetch que trae tanto el mensaje del usuario como la respuesta del bot.
      qc.invalidateQueries({
        queryKey: conversationKey(result.conversation_id),
      });
      qc.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });
}
