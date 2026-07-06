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
    <header
      className={cn(
        "mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold leading-tight tracking-normal text-[var(--text)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex min-h-10 w-fit shrink-0 items-center gap-1 rounded-pill border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--ink)] hover:text-[var(--accent)]"
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </header>
  );
}
