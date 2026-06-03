import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  ctaLabel?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
  ctaLabel = "Ver todo",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("flex items-end justify-between gap-4 mb-4", className)}>
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.015em] leading-tight text-[var(--text)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </header>
  );
}
