import Link from "next/link";
import { Logo } from "@/shared/ui/logo";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Left: form */}
      <div className="flex flex-col flex-1 px-6 py-8 sm:px-12 md:px-16 lg:px-24">
        <header className="mb-16">
          <Link href="/" aria-label="Volver al inicio">
            <Logo size="md" />
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center">
          <div className="w-full max-w-[420px]">
            <div className="mb-10">
              <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {children}

            {footer ? (
              <div className="mt-8 text-sm text-[var(--text-muted)]">
                {footer}
              </div>
            ) : null}
          </div>
        </main>

        <footer className="mt-12 text-xs text-[var(--text-soft)]">
          © {new Date().getFullYear()} Xitty — Barranquilla, Colombia
        </footer>
      </div>

      {/* Right: editorial visual (only md+) */}
      <aside
        aria-hidden
        className="hidden md:flex flex-1 bg-[var(--bg-subtle)] relative overflow-hidden items-end p-12 lg:p-16"
      >
        <div className="relative z-10 max-w-[460px]">
          <p className="eyebrow mb-4">Barranquilla — Caribe colombiano</p>
          <p className="text-[28px] leading-[1.2] tracking-[-0.01em] font-medium text-[var(--text)]">
            “Descubre la ciudad como un local. Lugares verificados,
            experiencias reales, y la mejor curaduría del Atlántico.”
          </p>
        </div>
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[var(--accent-soft)] blur-3xl opacity-70"
        />
        <div
          aria-hidden
          className="absolute right-[20%] bottom-[35%] h-[260px] w-[260px] rounded-full bg-[var(--accent)] opacity-10 blur-3xl"
        />
      </aside>
    </div>
  );
}
