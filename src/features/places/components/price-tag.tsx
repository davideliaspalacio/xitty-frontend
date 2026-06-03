import { cn } from "@/shared/utils/cn";
import { priceRangeLabel } from "@/shared/utils/format";

export function PriceTag({
  range,
  className,
}: {
  range: number | null;
  className?: string;
}) {
  if (range == null) return null;
  const label = priceRangeLabel(range);
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium tracking-wide text-[var(--text-muted)]",
        className,
      )}
      aria-label={`Rango de precio ${range} de 4`}
    >
      <span className="text-[var(--text)]">{label}</span>
      <span className="text-[var(--text-soft)]">{"$".repeat(4 - label.length)}</span>
    </span>
  );
}
