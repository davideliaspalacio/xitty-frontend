import { cn } from "@/shared/utils/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-[var(--bg-subtle)] animate-pulse before:absolute before:inset-y-0 before:left-0 before:w-1/2 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/55 before:to-transparent before:animate-[xitty-shimmer_1.6s_infinite] motion-reduce:animate-none motion-reduce:before:animate-none",
        className,
      )}
      {...props}
    />
  );
}
