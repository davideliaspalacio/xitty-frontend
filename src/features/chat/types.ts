/**
 * Types for the in-app chat feature ("Xi" assistant).
 * Hand-rolled to match the backend contract — replace via
 * `npm run gen:api` once the chat module is exposed in Swagger.
 */

export type ChatRole = "user" | "assistant" | "system";

export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageMetadata {
  /** IDs of places the assistant is suggesting in this reply. */
  context_place_ids?: string[];
  /** Free-form metadata bag, kept open for future fields. */
  [key: string]: unknown;
}

export interface Message {
  id: string;
  conversation_id?: string;
  role: ChatRole;
  content: string;
  created_at: string;
  metadata?: ChatMessageMetadata | null;
}

export interface SendMessageRequest {
  conversation_id?: string;
  content: string;
}

export interface SendMessageResponse {
  conversation_id: string;
  message: Message;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}
