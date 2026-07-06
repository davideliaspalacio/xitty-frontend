import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "neutral" | "warm" | "mint" | "danger";
}

const toneClasses: Record<NonNullable<EmptyStateProps["tone"]>, string> = {
  neutral: "bg-[var(--bg-subtle)] text-[var(--text)]",
  warm: "bg-[var(--surface-warm)] text-[var(--text)]",
  mint: "bg-[var(--surface-mint)] text-[var(--text)]",
  danger: "bg-[var(--danger-soft)] text-[var(--text)]",
};

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  tone = "warm",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border-strong)] px-5 py-10 text-center sm:px-8 sm:py-12",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      <span
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill border border-[var(--ink)] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-flat)]"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-lg font-semibold tracking-normal text-[var(--text)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
