"use client";

import { cn } from "@/shared/utils/cn";
import type { ExperienceSlot } from "@/lib/api/types";

interface SlotPickerProps {
  slots: ExperienceSlot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function formatSlot(starts_at: string) {
  const d = new Date(starts_at);
  const dateLabel = d.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeLabel = d.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { dateLabel, timeLabel };
}

export function SlotPicker({ slots, selectedId, onSelect }: SlotPickerProps) {
  const future = slots
    .filter((s) => new Date(s.starts_at) > new Date())
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));

  if (future.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Aún no hay fechas disponibles para reservar.
      </p>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {future.map((slot) => {
        const { dateLabel, timeLabel } = formatSlot(slot.starts_at);
        const isSelected = slot.id === selectedId;
        const isFull = slot.seats_available <= 0;
        return (
          <button
            key={slot.id}
            type="button"
            disabled={isFull}
            onClick={() => onSelect(slot.id)}
            aria-pressed={isSelected}
            className={cn(
              "shrink-0 flex flex-col items-start gap-1 rounded-lg border px-4 py-3 min-w-[148px] text-left transition-all duration-150",
              isFull
                ? "border-[var(--border)] bg-[var(--bg-subtle)] opacity-50 cursor-not-allowed"
                : isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]/40 shadow-[var(--shadow-1)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]",
            )}
          >
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
              {dateLabel}
            </span>
            <span className="text-base font-semibold text-[var(--text)]">
              {timeLabel}
            </span>
            <span
              className={cn(
                "text-xs",
                isFull
                  ? "text-[var(--danger)]"
                  : slot.seats_available <= 2
                    ? "text-[var(--warning)]"
                    : "text-[var(--text-soft)]",
              )}
            >
              {isFull
                ? "Agotado"
                : `${slot.seats_available} / ${slot.capacity} libres`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
