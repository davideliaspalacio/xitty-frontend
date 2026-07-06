"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { WizardShell } from "./wizard-shell";
import { OptionCard } from "./option-card";
import {
  useSavePreferences,
  useSkipPreferences,
} from "@/features/preferences/hooks/use-preferences";
import type {
  AvailableTime,
  CreatePreferencesPayload,
  EnergyLevel,
  TravelerType,
} from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

const travelerOptions: {
  value: TravelerType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "nomada",
    label: "Nómada",
    description: "Viajo solo y me muevo a mi ritmo.",
    icon: "✦",
  },
  {
    value: "pareja",
    label: "En pareja",
    description: "Planes para dos, románticos y tranquilos.",
    icon: "♥",
  },
  {
    value: "familia",
    label: "Familia",
    description: "Lugares cómodos para todas las edades.",
    icon: "◉",
  },
  {
    value: "negocios",
    label: "Negocios",
    description: "Tiempo limitado, calidad y conveniencia.",
    icon: "◆",
  },
  {
    value: "excursion",
    label: "Excursión",
    description: "Grupos, recorridos, aventuras compartidas.",
    icon: "△",
  },
];

const timeOptions: { value: AvailableTime; label: string; description: string }[] = [
  { value: "1-3 dias", label: "1 a 3 días", description: "Visita corta, lo esencial." },
  { value: "4-7 dias", label: "4 a 7 días", description: "Tiempo para explorar a fondo." },
  { value: "+1 semana", label: "Más de una semana", description: "Te vas a sentir como local." },
];

const energyOptions: { value: EnergyLevel; label: string; description: string }[] = [
  { value: "baja", label: "Tranquila", description: "Café, museos, atardeceres." },
  { value: "media", label: "Equilibrada", description: "Mezcla de planes y descansos." },
  { value: "alta", label: "Activa", description: "Aventura, salir hasta tarde, todo." },
];

interface WizardState {
  traveler_type: TravelerType | null;
  budget_min: number | "";
  budget_max: number | "";
  available_time: AvailableTime | null;
  energy_level: EnergyLevel | null;
  companions: number | "";
}

const INITIAL: WizardState = {
  traveler_type: null,
  budget_min: 50000,
  budget_max: 250000,
  available_time: null,
  energy_level: null,
  companions: 0,
};

export function OnboardingWizard() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>(INITIAL);
  const [step, setStep] = useState(1);
  const save = useSavePreferences();
  const skip = useSkipPreferences();

  const TOTAL = 3;

  const canNext =
    (step === 1 && !!state.traveler_type) ||
    (step === 2 &&
      !!state.available_time &&
      state.budget_min !== "" &&
      state.budget_max !== "" &&
      Number(state.budget_max) >= Number(state.budget_min)) ||
    (step === 3 && !!state.energy_level && state.companions !== "");

  async function handleSubmit() {
    if (
      !state.traveler_type ||
      !state.available_time ||
      !state.energy_level ||
      state.budget_min === "" ||
      state.budget_max === "" ||
      state.companions === ""
    ) {
      return;
    }
    const payload: CreatePreferencesPayload = {
      traveler_type: state.traveler_type,
      budget_min: Number(state.budget_min),
      budget_max: Number(state.budget_max),
      available_time: state.available_time,
      energy_level: state.energy_level,
      companions: Number(state.companions),
    };
    try {
      await save.mutateAsync(payload);
      toast.success("Listo. Personalizamos Barranquilla para ti.");
      router.replace("/home");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo guardar.");
    }
  }

  async function handleSkip() {
    try {
      await skip.mutateAsync();
      toast.info("Puedes completarlo más tarde desde tu perfil.");
      router.replace("/home");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo continuar.");
    }
  }

  const titles = [
    "¿Qué tipo de viajero eres?",
    "Tu presupuesto y tiempo en la ciudad",
    "Energía y compañía",
  ];

  const subtitles = [
    "Esto nos ayuda a recomendarte lugares que encajan con tu estilo.",
    "Filtraremos opciones que se ajusten a lo que estás dispuesto a gastar.",
    "Para sugerir actividades del nivel justo para ti.",
  ];

  return (
    <WizardShell
      step={step}
      total={TOTAL}
      title={titles[step - 1]}
      subtitle={subtitles[step - 1]}
      footer={
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSkip}
            disabled={skip.isPending}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] underline-offset-4 hover:underline disabled:opacity-50"
          >
            Saltar por ahora
          </button>

          <div className="flex gap-2">
            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
              >
                Atrás
              </Button>
            ) : null}

            {step < TOTAL ? (
              <Button
                disabled={!canNext}
                onClick={() => setStep((s) => Math.min(TOTAL, s + 1))}
              >
                Continuar
              </Button>
            ) : (
              <Button
                disabled={!canNext}
                loading={save.isPending}
                onClick={handleSubmit}
              >
                Guardar y empezar
              </Button>
            )}
          </div>
        </div>
      }
    >
      {step === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {travelerOptions.map((o) => (
            <OptionCard
              key={o.value}
              label={o.label}
              description={o.description}
              icon={o.icon}
              selected={state.traveler_type === o.value}
              onClick={() =>
                setState((s) => ({ ...s, traveler_type: o.value }))
              }
            />
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Mínimo (COP)" htmlFor="budget_min">
              <Input
                id="budget_min"
                type="number"
                min={0}
                step={10000}
                value={state.budget_min}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    budget_min: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Máximo (COP)" htmlFor="budget_max">
              <Input
                id="budget_max"
                type="number"
                min={0}
                step={10000}
                value={state.budget_max}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    budget_max: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </Field>
          </div>

          <div>
            <p className="text-sm font-medium mb-3 text-[var(--text)]">
              ¿Cuánto tiempo estarás aquí?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {timeOptions.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  description={o.description}
                  selected={state.available_time === o.value}
                  onClick={() =>
                    setState((s) => ({ ...s, available_time: o.value }))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-sm font-medium mb-3 text-[var(--text)]">
              Nivel de energía deseado
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {energyOptions.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  description={o.description}
                  selected={state.energy_level === o.value}
                  onClick={() =>
                    setState((s) => ({ ...s, energy_level: o.value }))
                  }
                />
              ))}
            </div>
          </div>

          <Field
            label="¿Con cuántas personas viajas?"
            htmlFor="companions"
            hint="Incluye a tus acompañantes, sin contarte."
          >
            <Input
              id="companions"
              type="number"
              min={0}
              max={20}
              value={state.companions}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  companions: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </Field>
        </div>
      ) : null}
    </WizardShell>
  );
}
