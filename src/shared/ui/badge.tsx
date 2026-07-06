import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

export const badgeVariants = cva(
  "inline-flex min-h-6 w-fit items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border)] bg-[var(--surface)] text-[var(--text)]",
        accent:
          "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent)]",
        secondary:
          "border-[var(--secondary)]/20 bg-[var(--secondary-soft)] text-[var(--secondary-fg)]",
        sunny:
          "border-[var(--warning)]/20 bg-[var(--sunny-soft)] text-[var(--warning)]",
        success:
          "border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]",
        warning:
          "border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]",
        danger:
          "border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]",
        info:
          "border-[var(--info)]/20 bg-[var(--info-soft)] text-[var(--info)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
