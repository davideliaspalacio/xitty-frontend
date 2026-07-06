"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_3px_0_var(--ink)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:translate-y-0.5 active:shadow-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
        secondary:
          "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--ink)] hover:bg-[var(--surface-hover)]",
        soft:
          "bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--surface-warm)]",
        tonal:
          "bg-[var(--secondary-soft)] text-[var(--secondary-fg)] hover:bg-[var(--surface-mint)]",
        ghost:
          "text-[var(--text)] hover:bg-[var(--surface-hover)]",
        link:
          "h-auto rounded-none p-0 text-[var(--accent)] underline-offset-4 hover:underline",
        danger:
          "bg-[var(--danger)] text-white shadow-[0_3px_0_var(--ink)] hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0.5 active:shadow-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
      },
      size: {
        sm: "h-11 px-3 text-xs sm:h-9",
        md: "h-11 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
          />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
