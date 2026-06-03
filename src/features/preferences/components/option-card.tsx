"use client";

import { cn } from "@/shared/utils/cn";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col items-start gap-2 rounded-lg border bg-[var(--surface)] px-5 py-4 text-left transition-all duration-150",
        "hover:shadow-[var(--shadow-1)] hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30",
        selected
          ? "border-[var(--accent)] shadow-[var(--shadow-2)] ring-1 ring-[var(--accent)]"
          : "border-[var(--border)]",
      )}
    >
      {icon ? (
        <span
          className={cn(
            "text-2xl transition-colors",
            selected ? "text-[var(--accent)]" : "text-[var(--text-muted)]",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
      {description ? (
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {description}
        </span>
      ) : null}

      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 h-4 w-4 rounded-full border transition-all duration-150",
          selected
            ? "border-[var(--accent)] bg-[var(--accent)]"
            : "border-[var(--border-strong)] bg-transparent",
        )}
      >
        {selected ? (
          <span className="block h-1.5 w-1.5 rounded-full bg-white mx-auto mt-[5px]" />
        ) : null}
      </span>
    </button>
  );
}
