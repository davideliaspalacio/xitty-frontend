"use client";

import Link from "next/link";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

const travelerLabels: Record<string, string> = {
  nomada: "Nómada",
  pareja: "En pareja",
  familia: "Familia",
  negocios: "Negocios",
  excursion: "Excursión",
};

const energyLabels: Record<string, string> = {
  baja: "Tranquila",
  media: "Equilibrada",
  alta: "Activa",
};

const fmtCop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function PreferencesSummary() {
  const { data, isLoading } = usePreferences();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!data || !data.wizard_completed) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-[var(--text-muted)]">
          Aún no has personalizado tus preferencias. Recibirás recomendaciones
          mucho mejores si las completas.
        </p>
        <div>
          <Link href="/onboarding">
            <Button size="sm">Personalizar ahora</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div className="flex justify-between border-b border-[var(--border)] py-2">
          <dt className="text-[var(--text-muted)]">Tipo de viajero</dt>
          <dd className="font-medium">{travelerLabels[data.traveler_type ?? ""] ?? "—"}</dd>
        </div>
        <div className="flex justify-between border-b border-[var(--border)] py-2">
          <dt className="text-[var(--text-muted)]">Tiempo disponible</dt>
          <dd className="font-medium">{data.available_time ?? "—"}</dd>
        </div>
        <div className="flex justify-between border-b border-[var(--border)] py-2">
          <dt className="text-[var(--text-muted)]">Presupuesto</dt>
          <dd className="font-medium">
            {data.budget_min !== null && data.budget_max !== null
              ? `${fmtCop.format(data.budget_min)} – ${fmtCop.format(data.budget_max)}`
              : "—"}
          </dd>
        </div>
        <div className="flex justify-between border-b border-[var(--border)] py-2">
          <dt className="text-[var(--text-muted)]">Energía</dt>
          <dd className="font-medium">{energyLabels[data.energy_level ?? ""] ?? "—"}</dd>
        </div>
        <div className="flex justify-between border-b border-[var(--border)] py-2">
          <dt className="text-[var(--text-muted)]">Acompañantes</dt>
          <dd className="font-medium">{data.companions}</dd>
        </div>
      </dl>

      <div className="flex">
        <Link href="/onboarding">
          <Button variant="secondary" size="sm">
            Editar preferencias
          </Button>
        </Link>
      </div>
    </div>
  );
}
