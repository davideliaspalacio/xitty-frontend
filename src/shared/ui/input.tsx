"use client";

import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // text-base (16px) en mobile evita el zoom automatico de iOS al
          // enfocar; vuelve a 14px desde sm.
          "flex h-11 w-full rounded-md border bg-[var(--surface)] px-3.5 py-2 text-base sm:text-sm text-[var(--text)] placeholder:text-[var(--text-soft)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:border-[var(--accent)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-[var(--danger)]"
            : "border-[var(--border-strong)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
