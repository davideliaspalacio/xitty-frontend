"use client";

import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useRuns } from "@/features/admin-scraping/hooks/use-runs";
import { useSources } from "@/features/admin-scraping/hooks/use-sources";
import { cn } from "@/shared/utils/cn";
import type { ScrapingRunStatus } from "@/features/admin-scraping/types";

const STATUS_COLOR: Record<ScrapingRunStatus, string> = {
  running: "bg-[var(--accent-soft)] text-[var(--accent)]",
  succeeded: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<ScrapingRunStatus, string> = {
  running: "En curso",
  succeeded: "Completado",
  partial: "Parcial",
  failed: "Fallido",
};

/**
 * Fecha corta para no desbordar en mobile: `dd/mm HH:MM` (sin año ni
 * segundos, que el toLocaleString añade y no aportan aquí).
 */
function shortDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: ScrapingRunStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase",
        STATUS_COLOR[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * Tabla simple del historial de runs. Como `scraping_runs` viene con
 * `source_id` (FK), la cruzamos con `useSources()` para mostrar el nombre
 * legible — si la query de sources aun no resolvio, caemos al uuid corto.
 */
export function RunsHistory() {
  const { data: runs, isLoading } = useRuns({ limit: 50 });
  const { data: sources } = useSources();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-md" />
        ))}
      </div>
    );
  }

  if (!runs || runs.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        No hay runs registrados aún.
      </Card>
    );
  }

  function sourceName(sourceId: string): string {
    return sources?.find((s) => s.id === sourceId)?.name ?? sourceId.slice(0, 8);
  }

  return (
    <>
      {/* Mobile (< md): cada run como tarjeta apilada label/valor. Una tabla
          de 8 columnas se desborda sin remedio en 390px. */}
      <div className="flex flex-col gap-3 md:hidden">
        {runs.map((r) => (
          <Card key={r.id} className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold truncate">
                {sourceName(r.source_id)}
              </h3>
              <StatusBadge status={r.status} />
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <RunStat label="Encontrados" value={r.items_found} />
              <RunStat label="Enriquecidos" value={r.items_enriched} />
              <RunStat label="Fallidos" value={r.items_failed} />
            </dl>
            <div className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
              <div className="flex justify-between gap-2">
                <span className="text-[var(--text-soft)]">Inicio</span>
                <span className="tabular-nums">{shortDate(r.started_at)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--text-soft)]">Fin</span>
                <span className="tabular-nums">{shortDate(r.finished_at)}</span>
              </div>
            </div>
            {r.error ? (
              <p className="text-xs text-red-700 break-words" title={r.error}>
                {r.error}
              </p>
            ) : null}
          </Card>
        ))}
      </div>

      {/* md+: tabla completa (con scroll-x de respaldo). */}
      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--text-soft)] border-b border-[var(--border)]">
              <th className="px-4 py-2 font-medium">Fuente</th>
              <th className="px-4 py-2 font-medium">Estado</th>
              <th className="px-4 py-2 font-medium text-right">Encontrados</th>
              <th className="px-4 py-2 font-medium text-right">Enriquecidos</th>
              <th className="px-4 py-2 font-medium text-right">Fallidos</th>
              <th className="px-4 py-2 font-medium">Inicio</th>
              <th className="px-4 py-2 font-medium">Fin</th>
              <th className="px-4 py-2 font-medium">Error</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-subtle)]"
              >
                <td className="px-4 py-2 font-medium">{sourceName(r.source_id)}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{r.items_found}</td>
                <td className="px-4 py-2 text-right tabular-nums">{r.items_enriched}</td>
                <td className="px-4 py-2 text-right tabular-nums">{r.items_failed}</td>
                <td className="px-4 py-2 text-[var(--text-muted)] tabular-nums">
                  {shortDate(r.started_at)}
                </td>
                <td className="px-4 py-2 text-[var(--text-muted)] tabular-nums">
                  {shortDate(r.finished_at)}
                </td>
                <td className="px-4 py-2 text-xs text-red-700 max-w-[240px] truncate" title={r.error ?? undefined}>
                  {r.error ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function RunStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-wide text-[var(--text-soft)]">
        {label}
      </dt>
      <dd className="text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
