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
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--text-soft)] border-b border-[var(--border)]">
            <th className="px-4 py-2 font-medium">Source</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium text-right">Found</th>
            <th className="px-4 py-2 font-medium text-right">Enriched</th>
            <th className="px-4 py-2 font-medium text-right">Failed</th>
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
                <span
                  className={cn(
                    "inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase",
                    STATUS_COLOR[r.status],
                  )}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-2 text-right tabular-nums">{r.items_found}</td>
              <td className="px-4 py-2 text-right tabular-nums">{r.items_enriched}</td>
              <td className="px-4 py-2 text-right tabular-nums">{r.items_failed}</td>
              <td className="px-4 py-2 text-[var(--text-muted)]">
                {new Date(r.started_at).toLocaleString("es-CO")}
              </td>
              <td className="px-4 py-2 text-[var(--text-muted)]">
                {r.finished_at
                  ? new Date(r.finished_at).toLocaleString("es-CO")
                  : "—"}
              </td>
              <td className="px-4 py-2 text-xs text-red-700 max-w-[240px] truncate" title={r.error ?? undefined}>
                {r.error ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
