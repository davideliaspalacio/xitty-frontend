import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { Label } from "@/shared/ui/label";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={htmlFor}>{label}</Label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--text-soft)]">{hint}</p>
      ) : null}
    </div>
  );
}
