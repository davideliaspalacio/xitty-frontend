import { api } from "@/lib/api/http";
import type {
  Conversation,
  ConversationWithMessages,
  SendMessageRequest,
  SendMessageResponse,
} from "@/features/chat/types";

export const chatApi = {
  listConversations: () =>
    api.get<Conversation[]>("/chat/conversations"),

  createConversation: () =>
    api.post<Conversation>("/chat/conversations"),

  getConversation: (id: string) =>
    api.get<ConversationWithMessages>(`/chat/conversations/${id}`),

  sendMessage: (payload: SendMessageRequest) =>
    api.post<SendMessageResponse>("/chat/messages", payload),

  deleteConversation: (id: string) =>
    api.delete<void>(`/chat/conversations/${id}`),
};
