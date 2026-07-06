"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Play, Plus } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { Skeleton } from "@/shared/ui/skeleton";
import { ApiError } from "@/lib/api/types";
import type { RunSummary } from "@/features/admin-scraping/api";
import {
  useCreateSource,
  useRunSource,
  useSources,
  useToggleSource,
} from "@/features/admin-scraping/hooks/use-sources";
import {
  SCRAPER_SOURCES,
  getScraperSource,
  type ScrapingSourceKind,
  type ScrapingSourceWithMeta,
} from "@/features/admin-scraping/types";

/**
 * Deriva el texto del toast a partir del shape REAL del RunSummary.
 *
 * El backend no garantiza `status`, asi que armarlo a mano (antes mostraba
 * "Run undefined"). Si el run falló preferimos el mensaje de error; si no,
 * mostramos los items enriquecidos / encontrados que sí lleguen.
 */
function runSummaryMessage(summary: RunSummary): string {
  if (summary.errored || summary.status === "failed") {
    const reason = summary.error_message ?? summary.error;
    return reason ? `Run con error · ${reason}` : "Run con error";
  }

  const enriched = summary.items_enriched ?? 0;
  const found = summary.items_found;
  const itemsText =
    found !== undefined && found !== enriched
      ? `${enriched}/${found} items`
      : `${enriched} items`;

  // `status` puede no venir: usamos un fallback legible en vez de "undefined".
  const label = summary.status ?? "completado";
  return `Run ${label} · ${itemsText}`;
}

/**
 * Panel de sources: lista las sources registradas en la DB con su toggle
 * `enabled` y un boton "Run now" para disparar manualmente.
 *
 * Tambien permite crear (upsert) una source nueva eligiendo `kind` del
 * registry pluggable `SCRAPER_SOURCES`. Si la kind requiere API key y el
 * backend no la tiene configurada, el run vuelve mock data — la UI no se
 * cae, solo se muestra un warning visual.
 */
export function SourcesPanel() {
  const { data: sources, isLoading } = useSources();
  const toggle = useToggleSource();
  const run = useRunSource();
  const create = useCreateSource();

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<ScrapingSourceKind>("manual");

  async function handleToggle(source: ScrapingSourceWithMeta) {
    try {
      await toggle.mutateAsync({
        id: source.id,
        payload: { enabled: !source.enabled },
      });
      toast.success(source.enabled ? "Source desactivada" : "Source activada");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo actualizar");
    }
  }

  async function handleRun(source: ScrapingSourceWithMeta) {
    try {
      const summary = await run.mutateAsync(source.id);
      const message = runSummaryMessage(summary);
      const failed = summary.errored || summary.status === "failed";
      if (failed) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo ejecutar");
    }
  }

  async function handleCreate() {
    if (newName.trim().length < 2) {
      toast.error("Nombre muy corto (min 2)");
      return;
    }
    try {
      await create.mutateAsync({
        name: newName.trim(),
        kind: newKind,
        config: {},
        enabled: true,
      });
      toast.success("Source creada");
      setNewName("");
      setShowForm(false);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo crear");
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          {sources?.length ?? 0} sources registradas
        </p>
        <Button size="sm" variant="secondary" onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4" /> Nueva source
        </Button>
      </div>

      {showForm ? (
        <Card className="p-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nombre" htmlFor="src-name">
              <Input
                id="src-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="eventbrite-bquilla"
              />
            </Field>
            <Field label="Tipo (kind)" htmlFor="src-kind">
              <select
                id="src-kind"
                value={newKind}
                onChange={(e) => setNewKind(e.target.value as ScrapingSourceKind)}
                className="flex h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-base text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 sm:text-sm"
              >
                {SCRAPER_SOURCES.map((s) => (
                  <option key={s.kind} value={s.kind}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button loading={create.isPending} onClick={handleCreate}>
              Crear
            </Button>
          </div>
        </Card>
      ) : null}

      {!sources || sources.length === 0 ? (
        <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
          No hay sources registradas. Crea una para empezar.
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {sources.map((s) => {
            const meta = getScraperSource(s.kind);
            return (
              <Card
                key={s.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold truncate">{s.name}</h3>
                    <span className="inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                      {meta?.label ?? s.kind}
                    </span>
                    {meta?.requiresApiKey ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] text-[var(--text-soft)]"
                        title="Si la API key no esta configurada, el run vuelve mock data"
                      >
                        <AlertTriangle className="h-3 w-3" /> requiere API key
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-[var(--text-soft)] mt-0.5">
                    {s.items_count} items totales
                    {s.last_run_at ? (
                      <>
                        {" · "}último run{" "}
                        {new Date(s.last_run_at).toLocaleString("es-CO")}
                      </>
                    ) : (
                      " · sin runs aún"
                    )}
                    {s.schedule_cron ? (
                      <>
                        {" · cron "}
                        <code>{s.schedule_cron}</code>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:shrink-0">
                  <label className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[var(--text-muted)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={() => handleToggle(s)}
                      disabled={toggle.isPending}
                    />
                    {s.enabled ? "Activa" : "Pausada"}
                  </label>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRun(s)}
                    loading={run.isPending}
                    disabled={!s.enabled}
                    className="w-full sm:w-auto"
                  >
                    <Play className="h-4 w-4" /> Run now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
