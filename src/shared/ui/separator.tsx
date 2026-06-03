import { cn } from "@/shared/utils/cn";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Separator({
  className,
  orientation = "horizontal",
  label,
  ...props
}: SeparatorProps) {
  if (label) {
    return (
      <div
        className={cn(
          "relative flex items-center gap-3 text-xs text-[var(--text-soft)]",
          className,
        )}
        {...props}
      >
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span>{label}</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={cn(
        "bg-[var(--border)]",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className,
      )}
      {...props}
    />
  );
}
