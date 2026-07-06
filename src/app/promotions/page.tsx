"use client";

import Link from "next/link";
import { useActivePromotions } from "@/features/promotions";
import { Logo } from "@/shared/ui/logo";
import { Skeleton } from "@/shared/ui/skeleton";

export default function PromotionsFeedPage() {
  const { data, isLoading } = useActivePromotions(1, 30);
  const promos = data?.data ?? [];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-30">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Xitty">
            <Logo size="md" />
          </Link>
          <Link
            href="/places"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] underline-offset-4 hover:underline"
          >
            Ver directorio →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <p className="eyebrow">Activas ahora</p>
          <h1 className="text-[40px] sm:text-[48px] font-semibold leading-[1.05] tracking-normal">
            Promociones en Barranquilla
          </h1>
          <p className="text-[var(--text-muted)] text-[15px] max-w-2xl">
            Descuentos vigentes en restaurantes, hoteles, experiencias y más.
            Reserva antes de que se agoten.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-16 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              No hay promociones activas en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.map((p) => (
              <Link
                key={p.id}
                href={
                  p.places?.slug
                    ? `/microsites/${p.places.slug}`
                    : `/places/${p.place_id}`
                }
                className="group rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-soft)]/30 p-5 flex flex-col gap-2 transition-all hover:shadow-[var(--shadow-2)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      {p.places?.name ?? "Lugar"}
                    </p>
                    <h3 className="text-lg font-semibold tracking-normal">
                      {p.title}
                    </h3>
                  </div>
                  {p.discount_percentage != null ? (
                    <span className="shrink-0 inline-flex items-center h-8 px-3 rounded-pill text-sm font-semibold bg-[var(--accent)] text-[var(--accent-fg)]">
                      -{p.discount_percentage}%
                    </span>
                  ) : null}
                </div>
                {p.description ? (
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                    {p.description}
                  </p>
                ) : null}
                <p className="text-xs text-[var(--text-soft)] mt-1">
                  Vence el{" "}
                  {new Date(p.ends_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
