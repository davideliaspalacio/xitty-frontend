"use client";

import Link from "next/link";
import { useOwnedPlace } from "@/features/places/hooks/use-owned-place";
import { useMetricsSummary } from "@/features/metrics";
import { usePromotionsForPlace } from "@/features/promotions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { fmtNumber } from "@/shared/utils/format";

function isoDaysAgo(d: number) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}
const FROM = isoDaysAgo(30);
const TO = new Date().toISOString();

export default function DashboardOverviewPage() {
  const { data: place, isLoading } = useOwnedPlace();
  const summary = useMetricsSummary(place?.id, FROM, TO);
  const promos = usePromotionsForPlace(place?.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-16 text-center">
        <h2 className="text-lg font-semibold mb-2">Aún no eres dueño de ningún lugar</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6 max-w-md mx-auto">
          Contacta al equipo Xitty para registrar tu negocio en la plataforma.
        </p>
      </div>
    );
  }

  const activePromosCount = (promos.data ?? []).filter(
    (p: { is_active: boolean }) => p.is_active,
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardDescription>Mi lugar</CardDescription>
          <CardTitle className="text-2xl">{place.name}</CardTitle>
          <p className="text-sm text-[var(--text-muted)] mt-1">{place.address}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {place.slug ? (
            <Link
              href={`/microsites/${place.slug}`}
              className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Ver mi micrositio público →
            </Link>
          ) : null}
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-4">
          Resumen últimos 30 días
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {summary.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          ) : summary.data ? (
            <>
              <StatBlock label="Vistas" value={summary.data.total_views} />
              <StatBlock label="Llamadas" value={summary.data.total_calls} />
              <StatBlock label="WhatsApp" value={summary.data.total_whatsapp} />
              <StatBlock label="Reservas" value={summary.data.total_reservations} />
              <StatBlock label="Cómo llegar" value={summary.data.total_directions} />
              <StatBlock label="Vistas promos" value={summary.data.total_promo_views} />
            </>
          ) : null}
        </div>
        {summary.data ? (
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Total: <strong className="text-[var(--text)]">{fmtNumber.format(summary.data.total_interactions)}</strong> interacciones
            {summary.data.change_percent !== 0 ? (
              <span
                className={
                  summary.data.change_percent > 0
                    ? "text-[var(--success)] ml-2"
                    : "text-[var(--danger)] ml-2"
                }
              >
                {summary.data.change_percent > 0 ? "↑" : "↓"}{" "}
                {Math.abs(summary.data.change_percent).toFixed(1)}% vs período anterior
              </span>
            ) : null}
          </p>
        ) : null}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Promociones</CardTitle>
          <CardDescription>
            {activePromosCount === 0
              ? "Aún no tienes promociones activas."
              : `${activePromosCount} promoción${activePromosCount === 1 ? "" : "es"} activa${activePromosCount === 1 ? "" : "s"}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/promotions">
            <Button variant="secondary">Administrar promociones</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <Card className="px-4 py-3">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-2xl font-semibold mt-1">{fmtNumber.format(value)}</p>
    </Card>
  );
}
