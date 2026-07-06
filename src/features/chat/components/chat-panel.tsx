"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { X, Plus, Send, Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useConversation } from "@/features/chat/hooks/use-conversation";
import { useSendMessage } from "@/features/chat/hooks/use-send-message";
import { useCreateConversation } from "@/features/chat/hooks/use-conversations";
import { MessageBubble } from "@/features/chat/components/message-bubble";
import type { Message } from "@/features/chat/types";

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  conversationId: string | null;
  onConversationIdChange?: (id: string) => void;
}

const QUICK_REPLIES: string[] = [
  "¿Qué hago cerca?",
  "Playa segura",
  "Restaurante familiar",
];

export function ChatPanel({
  open,
  onClose,
  conversationId,
  onConversationIdChange,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const { data: conversation } = useConversation(conversationId);
  const send = useSendMessage();
  const create = useCreateConversation();

  const messages: Message[] = conversation?.messages ?? [];
  const isEmpty = messages.length === 0;

  // Auto-scroll to the last message whenever the list grows or pending state flips.
  useEffect(() => {
    if (!open) return;
    const node = listEndRef.current;
    if (!node || typeof node.scrollIntoView !== "function") return;
    node.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [open, messages.length, send.isPending]);

  if (!open) return null;

  function dispatchMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    send.mutate(
      {
        conversation_id: conversationId ?? undefined,
        content: trimmed,
      },
      {
        onSuccess: (res) => {
          if (!conversationId && onConversationIdChange) {
            onConversationIdChange(res.conversation_id);
          }
        },
      },
    );
    setDraft("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    dispatchMessage(draft);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      dispatchMessage(draft);
    }
  }

  async function handleNewConversation() {
    try {
      const conv = await create.mutateAsync();
      onConversationIdChange?.(conv.conversation_id);
    } catch {
      // ignore — header still functional
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Asistente Xi"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full sm:max-w-md",
          "h-[85vh]",
          "flex flex-col",
          "bg-[var(--surface)] text-[var(--text)]",
          "rounded-t-xl sm:rounded-xl sm:mb-4",
          "shadow-[var(--shadow-3)]",
          "overflow-hidden",
        )}
      >
        {/* Header */}
        <header className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
          <div
            aria-hidden="true"
            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)",
            }}
          >
            Xi
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold leading-tight">Xi</p>
            <p className="text-xs text-[var(--text-muted)] leading-tight">
              Asistente local · en línea
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewConversation}
            aria-label="Nueva conversación"
            className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {isEmpty && !send.isPending ? (
            <EmptyState
              onPick={(text) => dispatchMessage(text)}
              disabled={send.isPending}
            />
          ) : (
            <>
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-1">
                  <MessageBubble message={m} />
                  {m.role === "assistant" &&
                  m.metadata?.context_place_ids?.length ? (
                    <div className="flex flex-wrap gap-2 pl-2">
                      {m.metadata.context_place_ids.map((pid) => (
                        <Link
                          key={pid}
                          href={`/places/${pid}`}
                          className={cn(
                            "inline-flex items-center gap-1 h-7 px-3 rounded-pill",
                            "bg-[var(--accent-soft)] text-[var(--accent)]",
                            "text-xs font-semibold",
                            "hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]",
                            "transition-colors",
                          )}
                        >
                          Ver lugar
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {send.isPending ? (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] italic px-3">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  Xi está escribiendo…
                </div>
              ) : null}
              <div ref={listEndRef} />
            </>
          )}
        </div>

        {/* Footer */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--border)] p-3 flex items-end gap-2"
        >
          <label htmlFor="xi-chat-message" className="sr-only">
            Mensaje para Xi
          </label>
          <textarea
            id="xi-chat-message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntale a Xi…"
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-lg px-4 py-2.5",
              "bg-[var(--bg-subtle)] text-[var(--text)] placeholder:text-[var(--text-muted)]",
              "border border-[var(--border)]",
              "focus:outline-none focus:border-[var(--accent)]",
              "text-base leading-relaxed sm:text-sm",
              "max-h-32",
            )}
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!draft.trim() || send.isPending}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              "text-white",
              "disabled:opacity-40 disabled:pointer-events-none",
              "transition-transform active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100",
            )}
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)",
            }}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  onPick: (text: string) => void;
  disabled?: boolean;
}

function EmptyState({ onPick, disabled }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center py-6">
      <div
        aria-hidden="true"
        className="h-14 w-14 rounded-full flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)",
        }}
      >
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-normal">
          Hola, soy Xi
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-[280px]">
          Tu guía local en Barranquilla. Pregúntame qué hacer, dónde comer
          o cómo moverte.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[320px] mt-2">
        {QUICK_REPLIES.map((q) => (
          <button
            type="button"
            key={q}
            disabled={disabled}
            onClick={() => onPick(q)}
            className={cn(
              "w-full text-left rounded-pill px-4 py-2.5",
              "bg-[var(--surface-warm)] text-[var(--ink)]",
              "border border-[var(--ink)]",
              "text-sm font-medium",
              "hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)]",
              "transition-colors",
              "disabled:opacity-50 disabled:pointer-events-none",
            )}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
