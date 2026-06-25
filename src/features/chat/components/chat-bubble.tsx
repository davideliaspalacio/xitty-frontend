"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface ChatBubbleProps {
  onClick: () => void;
  hasUnread?: boolean;
  className?: string;
}

const BREATH_KEYFRAMES = `
@keyframes xittyChatBubbleBreath {
  0%, 92%, 100% { transform: scale(1); }
  96% { transform: scale(1.06); }
}
.xitty-chat-bubble-breath {
  animation: xittyChatBubbleBreath 8s ease-in-out infinite;
}
.xitty-chat-bubble-breath:hover {
  animation: none;
}
`;

/**
 * Floating action button that opens the Xi chat panel.
 *
 * 56x56 px circle, fixed at the bottom-right of the viewport,
 * with a coral->teal gradient and a subtle "breath" animation
 * every 8 seconds (no framer-motion).
 */
export function ChatBubble({ onClick, hasUnread, className }: ChatBubbleProps) {
  return (
    <>
      {/* Keyframes are inlined once; CSS rules dedupe by name. */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: BREATH_KEYFRAMES }}
      />
      <button
        type="button"
        onClick={onClick}
        aria-label="Abrir asistente Xi"
        className={cn(
          // En mobile sube por encima del bottom-nav (h-16); en desktop, abajo.
          "fixed right-5 z-50 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-5",
          "h-14 w-14 rounded-full",
          "inline-flex items-center justify-center",
          "text-white",
          "shadow-[0_12px_32px_-8px_rgba(255,90,78,0.55)]",
          "transition-transform duration-200",
          "hover:scale-[1.04] active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
          "xitty-chat-bubble-breath",
          className,
        )}
        style={{
          backgroundImage:
            "linear-gradient(135deg, #FF5A4E 0%, #0E9F8C 100%)",
        }}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />

        {hasUnread ? (
          <span
            aria-label="Mensaje nuevo"
            className={cn(
              "absolute -top-0.5 -right-0.5",
              "h-3.5 w-3.5 rounded-full",
              "bg-[var(--danger)]",
              "border-2 border-[var(--bg)]",
            )}
          />
        ) : null}
      </button>
    </>
  );
}
