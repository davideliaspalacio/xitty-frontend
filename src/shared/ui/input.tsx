"use client";

import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={error || ariaInvalid ? true : undefined}
        className={cn(
          // text-base (16px) en mobile evita el zoom automatico de iOS al
          // enfocar; vuelve a 14px desde sm.
          "flex h-11 w-full rounded-lg border bg-[var(--surface)] px-3.5 py-2 text-base text-[var(--text)] placeholder:text-[var(--text-muted)] sm:text-sm",
          "transition-[border-color,box-shadow,background-color] duration-150",
          "focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25",
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
