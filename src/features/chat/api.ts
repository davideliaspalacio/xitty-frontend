import { api } from "@/lib/api/http";
import type {
  Conversation,
  ConversationWithMessages,
  CreateConversationResponse,
  Message,
} from "@/features/chat/types";

export const chatApi = {
  listConversations: () => api.get<Conversation[]>("/chat/conversations"),

  /**
   * Crea una conversación. Si `firstMessage` viene, el backend ejecuta el
   * sendMessage en línea (persiste user + assistant) y devuelve el id.
   */
  createConversation: (firstMessage?: string) =>
    api.post<CreateConversationResponse>(
      "/chat/conversations",
      firstMessage ? { first_message: firstMessage } : {},
    ),

  getConversation: (id: string) =>
    api.get<ConversationWithMessages>(`/chat/conversations/${id}`),

  /** Envía un mensaje a una conversación existente; devuelve el reply del assistant. */
  postMessage: (conversationId: string, content: string) =>
    api.post<Message>(`/chat/conversations/${conversationId}/messages`, {
      content,
    }),

  deleteConversation: (id: string) =>
    api.delete<void>(`/chat/conversations/${id}`),
};
