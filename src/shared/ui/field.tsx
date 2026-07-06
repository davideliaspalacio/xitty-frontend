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
  const generatedId = React.useId();
  const child = React.isValidElement<Record<string, unknown>>(children)
    ? children
    : null;
  const childId =
    typeof child?.props.id === "string" ? child.props.id : undefined;
  const controlId = htmlFor ?? childId ?? generatedId;
  const helpId = `${controlId}-help`;
  const describedBy =
    error || hint
      ? [child?.props["aria-describedby"], helpId].filter(Boolean).join(" ")
      : child?.props["aria-describedby"];
  const control = child
    ? React.cloneElement(child, {
        id: controlId,
        "aria-invalid": error ? true : child.props["aria-invalid"],
        "aria-describedby": describedBy || undefined,
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={controlId}>{label}</Label>
      ) : null}
      {control}
      {error ? (
        <p id={helpId} className="text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : hint ? (
        <p id={helpId} className="text-xs text-[var(--text-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
