"use client";

import { type KeyboardEvent, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface RatingInputProps {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  className?: string;
}

export function RatingInput({
  value,
  onChange,
  disabled,
  className,
}: RatingInputProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, n: number) {
    if (disabled) return;
    const keys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    if (e.key === "Home") {
      onChange(1);
      return;
    }
    if (e.key === "End") {
      onChange(5);
      return;
    }
    const delta = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : -1;
    const next = ((n - 1 + delta + 5) % 5) + 1;
    onChange(next);
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Calificación"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          onKeyDown={(e) => handleKeyDown(e, n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          aria-checked={value === n}
          role="radio"
          tabIndex={value === n || (!value && n === 1) ? 0 : -1}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-100 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 motion-reduce:transition-none motion-reduce:active:scale-100",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <Star
            aria-hidden="true"
            className={cn(
              "h-7 w-7 transition-colors",
              n <= display
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-muted)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}
