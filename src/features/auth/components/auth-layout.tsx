import Link from "next/link";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/shared/ui/logo";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--surface-warm)] md:bg-[var(--bg)]">
      {/* Left: form */}
      <div className="flex flex-1 flex-col px-6 py-6 sm:px-12 md:px-16 md:py-8 lg:px-24">
        <header className="mb-8 md:mb-12">
          <Link href="/" aria-label="Volver al inicio">
            <Logo size="md" />
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-start pt-10 sm:justify-center sm:pt-0">
          <div className="w-full max-w-[420px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-flat)] sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <div className="mb-10">
              <h1 className="text-[34px] font-semibold leading-[1.1] tracking-normal text-[var(--text)]">
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

        <footer className="mt-8 text-xs text-[var(--text-soft)] sm:mt-12">
          © {new Date().getFullYear()} Xitty — Barranquilla, Colombia
        </footer>
      </div>

      {/* Right: editorial visual (only md+) */}
      <aside className="hidden flex-1 items-center bg-[var(--surface-mint)] p-12 md:flex lg:p-16">
        <div className="max-w-[460px]">
          <p className="eyebrow mb-4">Barranquilla, contigo</p>
          <p className="text-[28px] font-semibold leading-[1.15] tracking-normal text-[var(--text)]">
            Descubre la ciudad como un local, guarda tus planes y reserva
            experiencias reales en segundos.
          </p>
          <div className="mt-8 grid gap-3">
            <AuthCue
              icon={MapPin}
              title="Lugares cerca"
              description="Restaurantes, cultura y paradas verificadas."
            />
            <AuthCue
              icon={Sparkles}
              title="Curaduría Xitty"
              description="Destacados y secretos locales con contexto útil."
            />
            <AuthCue
              icon={ShieldCheck}
              title="Más confianza"
              description="Estados claros, reseñas y señales de seguridad."
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function AuthCue({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPin;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
