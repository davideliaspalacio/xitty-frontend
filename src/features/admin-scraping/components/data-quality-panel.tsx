"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { env } from "@/lib/env";
import { usePlaceCompleteness } from "@/features/admin-scraping/hooks/use-place-completeness";
import type {
  PlaceCompletenessReport,
  PlaceCompletenessRow,
} from "@/features/admin-scraping/types";

const FIELD_LABELS: Record<string, string> = {
  description: "Descripción",
  address: "Dirección",
  coordinates: "Coordenadas",
  phone_or_whatsapp: "Teléfono/WhatsApp",
  website: "Web",
  schedule: "Horarios",
  reviews: "Reseñas",
  photos: "Fotos",
  cover_photo: "Portada",
  source_url: "Fuente",
};

function percentFromScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function fieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

export function DataQualityPanel() {
  const [city, setCity] = useState(env.NEXT_PUBLIC_DEFAULT_CITY);
  const [missingOnly, setMissingOnly] = useState(false);
  const query = useMemo(
    () => ({
      city: city.trim() || undefined,
      missing_only: missingOnly || undefined,
      page: 1,
      limit: 50,
    }),
    [city, missingOnly],
  );
  const report = usePlaceCompleteness(query);
  const data = report.data;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,320px)_auto_auto] md:items-end">
          <Field label="Ciudad" htmlFor="quality-city">
            <Input
              id="quality-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Cartagena"
            />
          </Field>
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 text-sm font-medium text-[var(--text)]">
            <input
              type="checkbox"
              checked={missingOnly}
              onChange={(event) => setMissingOnly(event.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Solo faltantes
          </label>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void report.refetch()}
            loading={report.isFetching}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Actualizar
          </Button>
        </div>
      </div>

      {report.isLoading ? (
        <QualitySkeleton />
      ) : !data ? (
        <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
          No se pudo cargar el reporte de calidad.
        </Card>
      ) : (
        <>
          <QualitySummary report={data} />
          <MissingFieldsBreakdown report={data} />
          <PlacesQualityList rows={data.data} />
        </>
      )}
    </div>
  );
}

function QualitySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

function QualitySummary({ report }: { report: PlaceCompletenessReport }) {
  const summary = report.summary;
  const metrics = [
    { label: "Lugares", value: summary.total_places },
    { label: "Completos", value: summary.complete_places },
    { label: "Con faltantes", value: summary.incomplete_places },
    {
      label: "Completitud promedio",
      value: percentFromScore(summary.average_completeness_score),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <p className="text-xs font-medium text-[var(--text-soft)]">
            {metric.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-normal text-[var(--text)]">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function MissingFieldsBreakdown({
  report,
}: {
  report: PlaceCompletenessReport;
}) {
  const fields = report.summary.fields
    .filter((field) => field.missing_places > 0)
    .sort((a, b) => b.missing_places - a.missing_places)
    .slice(0, 8);
  const categories = report.summary.by_category.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Card className="p-4">
        <h2 className="text-base font-semibold tracking-normal">
          Faltantes principales
        </h2>
        {fields.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            No hay campos críticos pendientes en este filtro.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {fields.map((field) => (
              <div
                key={field.field}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="font-medium text-[var(--text)]">
                  {fieldLabel(field.field)}
                </span>
                <span className="text-[var(--text-muted)]">
                  {field.missing_places} faltan ·{" "}
                  {formatPercent(field.completeness_percent)} listo
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-base font-semibold tracking-normal">
          Desglose por categoría
        </h2>
        {categories.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Todavía no hay lugares publicados para este filtro.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {categories.map((category) => (
              <div
                key={category.category_id ?? category.category_name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="font-medium text-[var(--text)]">
                  {category.category_name}
                </span>
                <span className="text-[var(--text-muted)]">
                  {category.incomplete_places} pendientes /{" "}
                  {category.total_places} lugares
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function PlacesQualityList({ rows }: { rows: PlaceCompletenessRow[] }) {
  if (rows.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        No hay lugares para revisar con este filtro.
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <PlaceQualityCard key={row.id} row={row} />
        ))}
      </div>

      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-normal text-[var(--text-soft)]">
              <th className="px-4 py-2 font-medium">Lugar</th>
              <th className="px-4 py-2 font-medium">Categoría</th>
              <th className="px-4 py-2 font-medium">Completitud</th>
              <th className="px-4 py-2 font-medium">Faltantes</th>
              <th className="px-4 py-2 font-medium">Fotos</th>
              <th className="px-4 py-2 font-medium">Fuente</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-subtle)]"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text)]">
                    {row.name}
                  </div>
                  <div className="text-xs text-[var(--text-soft)]">
                    {[row.city, row.zone].filter(Boolean).join(" · ") ||
                      "Sin ciudad/zona"}
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">
                  {row.category_name ?? "Sin categoría"}
                </td>
                <td className="px-4 py-3">
                  <CompletenessPill row={row} />
                </td>
                <td className="px-4 py-3">
                  <MissingFields fields={row.missing_fields} />
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)] tabular-nums">
                  {row.photos_count} / portada {row.cover_photos_count}
                </td>
                <td className="px-4 py-3">
                  {row.source_url ? (
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-hover)]"
                    >
                      Abrir{" "}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-soft)]">Sin fuente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function PlaceQualityCard({ row }: { row: PlaceCompletenessRow }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-normal">{row.name}</h3>
          <p className="text-xs text-[var(--text-soft)]">
            {row.category_name ?? "Sin categoría"} ·{" "}
            {[row.city, row.zone].filter(Boolean).join(" / ") || "Sin zona"}
          </p>
        </div>
        <CompletenessPill row={row} />
      </div>
      <div className="mt-3">
        <MissingFields fields={row.missing_fields} />
      </div>
    </Card>
  );
}

function CompletenessPill({ row }: { row: PlaceCompletenessRow }) {
  const complete = row.missing_count === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold ${
        complete
          ? "bg-[var(--success-soft)] text-[var(--success)]"
          : "bg-[var(--warning-soft)] text-[var(--warning)]"
      }`}
    >
      {complete ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {percentFromScore(row.completeness_score)}
    </span>
  );
}

function MissingFields({ fields }: { fields: string[] }) {
  if (fields.length === 0) {
    return (
      <span className="text-xs font-medium text-[var(--success)]">
        Completo
      </span>
    );
  }
  return (
    <div className="flex max-w-[360px] flex-wrap gap-1.5">
      {fields.map((field) => (
        <span
          key={field}
          className="rounded-pill bg-[var(--bg-subtle)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)]"
        >
          {fieldLabel(field)}
        </span>
      ))}
    </div>
  );
}
