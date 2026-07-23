"use client";

import { FormEvent, useMemo, useState } from "react";
import { RefreshCw, Save, SlidersHorizontal, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  useRankingConfig,
  useRefreshRanking,
  useUpdateRankingConfig,
} from "@/features/admin";
import { RoleGate } from "@/features/auth/components/role-gate";
import type {
  RankingConfig,
  UpdateRankingConfigPayload,
} from "@/features/admin/api";
import { ApiError } from "@/lib/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";

type RankingForm = Record<keyof UpdateRankingConfigPayload, string>;

type RankingField = {
  key: keyof RankingForm;
  label: string;
  hint: string;
  min: number;
  max?: number;
  step: string;
};

const WEIGHT_FIELDS: RankingField[] = [
  {
    key: "rating_weight",
    label: "Peso de calificación",
    hint: "Importancia de reseñas y promedio bayesiano.",
    min: 0,
    max: 1,
    step: "0.01",
  },
  {
    key: "views_weight",
    label: "Peso de visitas",
    hint: "Importancia de vistas recientes.",
    min: 0,
    max: 1,
    step: "0.01",
  },
  {
    key: "conversions_weight",
    label: "Peso de clicks",
    hint: "Importancia de WhatsApp, llamadas, reservas y mapas.",
    min: 0,
    max: 1,
    step: "0.01",
  },
];

const NORMALIZATION_FIELDS: RankingField[] = [
  {
    key: "rating_prior",
    label: "Rating base",
    hint: "Valor inicial para lugares con pocas reseñas.",
    min: 0,
    max: 5,
    step: "0.1",
  },
  {
    key: "rating_prior_reviews",
    label: "Reseñas base",
    hint: "Cantidad mínima usada por el promedio bayesiano.",
    min: 0,
    step: "1",
  },
  {
    key: "views_cap",
    label: "Tope de visitas",
    hint: "Normaliza volumen para no premiar solo tráfico bruto.",
    min: 1,
    step: "1",
  },
  {
    key: "conversions_cap",
    label: "Tope de clicks",
    hint: "Normaliza conversiones dentro de la ventana.",
    min: 1,
    step: "1",
  },
  {
    key: "window_days",
    label: "Ventana en días",
    hint: "Días recientes que entran en visitas y clicks.",
    min: 1,
    max: 365,
    step: "1",
  },
];

const INTEGER_FIELDS = new Set<keyof RankingForm>([
  "rating_prior_reviews",
  "views_cap",
  "conversions_cap",
  "window_days",
]);

function formFromConfig(config: RankingConfig): RankingForm {
  return {
    rating_weight: String(config.rating_weight),
    views_weight: String(config.views_weight),
    conversions_weight: String(config.conversions_weight),
    rating_prior: String(config.rating_prior),
    rating_prior_reviews: String(config.rating_prior_reviews),
    views_cap: String(config.views_cap),
    conversions_cap: String(config.conversions_cap),
    window_days: String(config.window_days),
  };
}

function parseNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseForm(
  form: RankingForm,
): Record<keyof RankingForm, number | null> {
  return {
    rating_weight: parseNumber(form.rating_weight),
    views_weight: parseNumber(form.views_weight),
    conversions_weight: parseNumber(form.conversions_weight),
    rating_prior: parseNumber(form.rating_prior),
    rating_prior_reviews: parseNumber(form.rating_prior_reviews),
    views_cap: parseNumber(form.views_cap),
    conversions_cap: parseNumber(form.conversions_cap),
    window_days: parseNumber(form.window_days),
  };
}

function validateForm(parsed: Record<keyof RankingForm, number | null>) {
  for (const field of [...WEIGHT_FIELDS, ...NORMALIZATION_FIELDS]) {
    const value = parsed[field.key];
    if (value === null) return "Completa todos los campos antes de guardar.";
    if (value < field.min)
      return `${field.label} debe ser mínimo ${field.min}.`;
    if (field.max !== undefined && value > field.max) {
      return `${field.label} debe ser máximo ${field.max}.`;
    }
    if (INTEGER_FIELDS.has(field.key) && !Number.isInteger(value)) {
      return `${field.label} debe ser un número entero.`;
    }
  }

  const weightTotal =
    (parsed.rating_weight ?? 0) +
    (parsed.views_weight ?? 0) +
    (parsed.conversions_weight ?? 0);

  if (weightTotal <= 0) {
    return "Al menos un peso del ranking debe ser mayor que cero.";
  }

  return null;
}

function toPayload(
  parsed: Record<keyof RankingForm, number | null>,
): UpdateRankingConfigPayload {
  return {
    rating_weight: parsed.rating_weight ?? 0,
    views_weight: parsed.views_weight ?? 0,
    conversions_weight: parsed.conversions_weight ?? 0,
    rating_prior: parsed.rating_prior ?? 0,
    rating_prior_reviews: parsed.rating_prior_reviews ?? 0,
    views_cap: parsed.views_cap ?? 1,
    conversions_cap: parsed.conversions_cap ?? 1,
    window_days: parsed.window_days ?? 1,
  };
}

function formatPercentage(value: number | null, total: number) {
  if (value === null || total <= 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function formatDate(value?: string | null) {
  if (!value) return "Sin registro";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminRankingPage() {
  const config = useRankingConfig();

  return (
    <RoleGate allow={["admin"]}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="eyebrow">Admin</p>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal">
            Configuración del ranking
          </h1>
          <p className="max-w-2xl text-[15px] text-[var(--text-muted)]">
            Ajusta la fórmula que ordena los lugares por ciudad y categoría.
          </p>
        </header>

        {config.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
        ) : config.isError || !config.data ? (
          <ErrorState
            title="No se pudo cargar la configuración"
            description="Revisa que las migraciones de ranking estén aplicadas y vuelve a intentar."
            onRetry={() => void config.refetch()}
          />
        ) : (
          <RankingConfigEditor config={config.data} />
        )}
      </div>
    </RoleGate>
  );
}

function RankingConfigEditor({ config }: { config: RankingConfig }) {
  const update = useUpdateRankingConfig();
  const refresh = useRefreshRanking();
  const [form, setForm] = useState<RankingForm>(() => formFromConfig(config));

  const parsed = useMemo(() => parseForm(form), [form]);
  const validationMessage = useMemo(() => validateForm(parsed), [parsed]);
  const weightTotal =
    (parsed.rating_weight ?? 0) +
    (parsed.views_weight ?? 0) +
    (parsed.conversions_weight ?? 0);
  const isSaving = update.isPending;

  function setField(key: keyof RankingForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    try {
      await update.mutateAsync(toPayload(parsed));
      toast.success("Configuración de ranking guardada");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "No se pudo guardar la configuración",
      );
    }
  }

  async function handleRefresh() {
    try {
      const result = await refresh.mutateAsync();
      toast.success(`Ranking actualizado: ${formatDate(result.refreshed_at)}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "No se pudo refrescar el ranking",
      );
    }
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {WEIGHT_FIELDS.map((field) => {
          const value = parsed[field.key];
          return (
            <Card key={field.key} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{field.label}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {field.hint}
                  </p>
                </div>
                <Badge variant="accent" className="shrink-0">
                  {formatPercentage(value, weightTotal)}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <form
        className="grid gap-4 xl:grid-cols-[1fr_360px]"
        onSubmit={handleSave}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Parámetros</CardTitle>
            </div>
            <CardDescription>
              Los cambios quedan guardados en la configuración. Para ver el
              nuevo orden público, ejecuta el refresco.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              {WEIGHT_FIELDS.map((field) => (
                <RankingInput
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={(value) => setField(field.key, value)}
                />
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NORMALIZATION_FIELDS.map((field) => (
                <RankingInput
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={(value) => setField(field.key, value)}
                />
              ))}
            </div>

            {validationMessage ? (
              <p className="text-sm font-medium text-[var(--danger)]">
                {validationMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Total de pesos: {weightTotal.toFixed(2)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Última actualización: {formatDate(config.updated_at)}
                </p>
              </div>
              <Button
                type="submit"
                loading={isSaving}
                disabled={Boolean(validationMessage)}
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Refresco manual</CardTitle>
            </div>
            <CardDescription>
              Recalcula posiciones, snapshots y deltas con la fórmula vigente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="border-y border-[var(--border)] py-4">
              <p className="text-sm font-semibold text-[var(--text)]">
                Estado de fórmula
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={weightTotal > 0 ? "success" : "danger"}>
                  Total {weightTotal.toFixed(2)}
                </Badge>
                <Badge variant="default">{parsed.window_days ?? 0} días</Badge>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              loading={refresh.isPending}
              onClick={handleRefresh}
              disabled={Boolean(validationMessage)}
            >
              <RefreshCw className="h-4 w-4" />
              Refrescar ranking
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}

function RankingInput({
  field,
  value,
  onChange,
}: {
  field: RankingField;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={field.label} hint={field.hint}>
      <Input
        type="number"
        inputMode="decimal"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}
