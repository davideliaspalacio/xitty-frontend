"use client";

import { cn } from "@/shared/utils/cn";
import type { Category } from "@/lib/api/types";

interface CategoryChipsProps {
  categories: Category[] | undefined;
  loading?: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

export function CategoryChips({
  categories,
  loading,
  selectedId,
  onSelect,
  className,
}: CategoryChipsProps) {
  if (loading) {
    return (
      <div className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 shrink-0 rounded-pill bg-[var(--bg-subtle)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-px-1",
        className,
      )}
      role="tablist"
    >
      <Chip
        active={selectedId === null}
        onClick={() => onSelect(null)}
        label="Todo"
      />
      {categories.map((c) => (
        <Chip
          key={c.id}
          active={selectedId === c.id}
          onClick={() => onSelect(c.id)}
          label={c.name}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center h-9 px-4 rounded-pill text-sm font-medium transition-all duration-150",
        active
          ? "bg-[var(--text)] text-[var(--text-inverse)] border border-[var(--text)]"
          : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text)]",
      )}
    >
      {label}
    </button>
  );
}
