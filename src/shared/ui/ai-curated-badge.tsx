import * as React from "react";
import { Sparkles } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

/**
 * Sticker-style pill used to flag AI-curated content across the app.
 * 24px tall, cream + ink border to match the editorial sticker layer
 * already used by experience/place cards.
 */
const aiCuratedBadgeVariants = cva(
  "inline-flex h-6 items-center gap-1 rounded-pill px-2 text-[11px] font-semibold leading-none tracking-tight whitespace-nowrap",
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--cream)] text-[var(--ink)] border border-[var(--ink)]",
        outline:
          "bg-transparent text-[var(--accent)] border border-[var(--accent)]",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

export interface AiCuratedBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "aria-label">,
    VariantProps<typeof aiCuratedBadgeVariants> {
  /** Override the default Spanish aria-label if needed. */
  "aria-label"?: string;
}

export const AiCuratedBadge = React.forwardRef<
  HTMLSpanElement,
  AiCuratedBadgeProps
>(({ className, variant, ...props }, ref) => {
  const ariaLabel =
    props["aria-label"] ?? "Contenido curado con inteligencia artificial";

  return (
    <span
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      className={cn(aiCuratedBadgeVariants({ variant }), className)}
      {...props}
    >
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      <span>Curado con IA</span>
    </span>
  );
});
AiCuratedBadge.displayName = "AiCuratedBadge";
