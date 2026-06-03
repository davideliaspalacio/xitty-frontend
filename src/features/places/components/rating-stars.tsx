"use client";

import { Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface RatingStarsProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
  className?: string;
}

const sizes = {
  sm: { star: "h-3 w-3", text: "text-xs" },
  md: { star: "h-4 w-4", text: "text-sm" },
  lg: { star: "h-5 w-5", text: "text-base" },
};

export function RatingStars({
  value,
  size = "md",
  showValue = true,
  count,
  className,
}: RatingStarsProps) {
  const s = sizes[size];
  const rounded = Math.round(value * 10) / 10;
  const hasRating = value > 0;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Star
        className={cn(
          s.star,
          hasRating
            ? "fill-[var(--accent)] text-[var(--accent)]"
            : "text-[var(--text-soft)]",
        )}
      />
      {showValue ? (
        <span className={cn("font-medium text-[var(--text)]", s.text)}>
          {hasRating ? rounded.toFixed(1) : "Nuevo"}
        </span>
      ) : null}
      {count != null ? (
        <span className={cn("text-[var(--text-muted)]", s.text)}>
          ({count})
        </span>
      ) : null}
    </div>
  );
}
