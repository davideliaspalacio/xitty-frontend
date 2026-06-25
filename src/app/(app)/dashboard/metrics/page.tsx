"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useOwnedPlace } from "@/features/places/hooks/use-owned-place";
import { useMetricsSummary, useMetricsTimeseries } from "@/features/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { fmtNumber } from "@/shared/utils/format";

const RANGES = [
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
  { label: "90 días", days: 90 },
];

function isoDaysAgo(d: number) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export default function MetricsPage() {
  const { data: place } = useOwnedPlace();
  const [days, setDays] = useState(30);
  const from = isoDaysAgo(days);
  const to = new Date().toISOString();

  const summary = useMetricsSummary(place?.id, from, to);
  const series = useMetricsTimeseries(place?.id, from, to, days > 60 ? "week" : "day");

  if (!place) {
    return <Skeleton className="h-64 rounded-lg" />;
  }

  const chartData =
    series.data?.map((b) => ({
      bucket: new Date(b.bucket).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
      }),
      Vistas: b.views,
      Llamadas: b.calls,
      WhatsApp: b.whatsapp,
      Reservas: b.reservations,
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="eyebrow">Period</p>
          <h2 className="text-lg font-semibold tracking-tight">
            Últimos {days} días
          </h2>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={
                "h-8 px-3 rounded-pill text-xs font-medium border transition-all " +
                (days === r.days
                  ? "bg-[var(--text)] text-[var(--text-inverse)] border-[var(--text)]"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text)]")
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {summary.isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))
        ) : summary.data ? (
          <>
            <KPI label="Vistas" value={summary.data.total_views} />
            <KPI label="Llamadas" value={summary.data.total_calls} />
            <KPI label="WhatsApp" value={summary.data.total_whatsapp} />
            <KPI label="Reservas" value={summary.data.total_reservations} />
            <KPI label="Cómo llegar" value={summary.data.total_directions} />
            <KPI label="Vistas promos" value={summary.data.total_promo_views} />
          </>
        ) : null}
      </div>

      {summary.data ? (
        <p className="text-sm text-[var(--text-muted)]">
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

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tendencia</CardTitle>
        </CardHeader>
        {/* px reducido en mobile + min-w-0/overflow-hidden para que el
            ResponsiveContainer pueda encogerse y no desborde en 390px. */}
        <CardContent className="h-[320px] w-full min-w-0 overflow-hidden px-2 sm:px-6">
          {series.isLoading ? (
            <Skeleton className="h-full w-full rounded-md" />
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
              Aún no hay interacciones en este período.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="bucket"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  interval="preserveStartEnd"
                  minTickGap={16}
                  tickMargin={6}
                />
                <YAxis
                  width={36}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Vistas" fill="var(--text)" />
                <Bar dataKey="Llamadas" fill="var(--accent)" />
                <Bar dataKey="WhatsApp" fill="var(--success)" />
                <Bar dataKey="Reservas" fill="var(--info)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <Card className="px-4 py-3">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-2xl font-semibold mt-1">{fmtNumber.format(value)}</p>
    </Card>
  );
}
