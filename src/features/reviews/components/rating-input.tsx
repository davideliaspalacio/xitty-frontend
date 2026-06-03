"use client";

import { useState } from "react";
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

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          aria-checked={value === n}
          role="radio"
          className={cn(
            "p-1 rounded-md transition-transform duration-100 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              n <= display
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-soft)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}
