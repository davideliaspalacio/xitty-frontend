"use client";

import { Fragment, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import type { Message } from "@/features/chat/types";

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

/**
 * Lightweight inline-markdown renderer. Handles **bold**, *italic*,
 * `code` and [text](url) — that's all. NO external dependency.
 * Anything else falls through as plain text. Multi-line content is
 * preserved with `\n` → <br />.
 */
function renderInlineMarkdown(input: string): ReactNode {
  const lines = input.split("\n");
  return lines.map((line, lineIdx) => (
    <Fragment key={lineIdx}>
      {lineIdx > 0 ? <br /> : null}
      {tokenize(line)}
    </Fragment>
  ));
}

// Single-pass tokenizer for inline markdown on one line.
function tokenize(line: string): ReactNode[] {
  // Order matters: link, bold, italic, code.
  // We process left-to-right, longest-match-first.
  const out: ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const patterns: Array<{
    regex: RegExp;
    render: (m: RegExpExecArray) => ReactNode;
  }> = [
    {
      // [text](url)
      regex: /\[([^\]]+)\]\(([^)\s]+)\)/,
      render: (m) => (
        <a
          key={`l${key}`}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          {m[1]}
        </a>
      ),
    },
    {
      // **bold**
      regex: /\*\*([^*]+)\*\*/,
      render: (m) => <strong key={`b${key}`}>{m[1]}</strong>,
    },
    {
      // *italic* — must not match the leftovers of **bold**
      regex: /(?<!\*)\*([^*\n]+)\*(?!\*)/,
      render: (m) => <em key={`i${key}`}>{m[1]}</em>,
    },
    {
      // `code`
      regex: /`([^`]+)`/,
      render: (m) => (
        <code
          key={`c${key}`}
          className="px-1 py-0.5 rounded bg-black/10 text-[0.9em] font-mono"
        >
          {m[1]}
        </code>
      ),
    },
  ];

  // Find the earliest match across all patterns, render it, repeat.
  // Bounded by remaining.length each iteration so cannot loop forever.
  let safety = 0;
  while (remaining.length > 0 && safety++ < 1000) {
    let earliest: { idx: number; matchEnd: number; node: ReactNode } | null =
      null;
    for (const { regex, render } of patterns) {
      const m = regex.exec(remaining);
      if (!m) continue;
      if (!earliest || m.index < earliest.idx) {
        earliest = {
          idx: m.index,
          matchEnd: m.index + m[0].length,
          node: render(m),
        };
      }
    }
    if (!earliest) {
      out.push(<Fragment key={`t${key++}`}>{remaining}</Fragment>);
      break;
    }
    if (earliest.idx > 0) {
      out.push(
        <Fragment key={`t${key++}`}>
          {remaining.slice(0, earliest.idx)}
        </Fragment>,
      );
    }
    out.push(earliest.node);
    key++;
    remaining = remaining.slice(earliest.matchEnd);
  }
  return out;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        className,
      )}
    >
      <div
        data-testid="message-bubble"
        data-role={message.role}
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser &&
            "bg-[var(--accent)] text-[var(--accent-fg)] rounded-br-sm",
          isAssistant &&
            "bg-[var(--surface-warm)] text-[var(--ink)] border border-[var(--ink)] rounded-bl-sm",
          message.role === "system" &&
            "bg-[var(--bg-subtle)] text-[var(--text-muted)] italic text-xs",
        )}
      >
        {renderInlineMarkdown(message.content)}
      </div>
    </div>
  );
}
