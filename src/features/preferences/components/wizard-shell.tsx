"use client";

import { Logo } from "@/shared/ui/logo";
import { cn } from "@/shared/utils/cn";

interface WizardShellProps {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function WizardShell({
  step,
  total,
  title,
  subtitle,
  children,
  footer,
}: WizardShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] px-6 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between h-[var(--topbar-height)]">
          <Logo size="md" />
          <span className="text-xs text-[var(--text-muted)]">
            Paso {step} de {total}
          </span>
        </div>
      </header>

      <div className="border-b border-[var(--border)]">
        <div
          className="h-1 bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>

      <main className="flex-1 px-6 sm:px-10 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10">
            <p className="eyebrow mb-2">Personalización</p>
            <h1
              className={cn(
                "text-[32px] sm:text-[38px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text)]",
              )}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>

          {children}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur px-6 sm:px-10 py-4">
        <div className="mx-auto max-w-2xl">{footer}</div>
      </footer>
    </div>
  );
}
