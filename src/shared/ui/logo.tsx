import { cn } from "@/shared/utils/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <span
        className={cn(
          "font-semibold tracking-[-0.04em] uppercase text-[var(--text)]",
          sizes[size],
        )}
      >
        xitty
      </span>
      <span
        aria-hidden
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[var(--accent)]"
      />
    </div>
  );
}
