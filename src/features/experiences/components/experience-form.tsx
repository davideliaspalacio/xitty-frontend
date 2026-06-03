"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import {
  useCreateExperience,
  useUpdateExperience,
} from "@/features/experiences/hooks/use-manage-experiences";
import { ApiError } from "@/lib/api/types";
import type { ExperienceDetail, ExperienceType } from "@/lib/api/types";

export const EXPERIENCE_TYPE_OPTIONS = [
  { value: "tour", label: "Tour" },
  { value: "gastronomy", label: "Gastronomía" },
  { value: "workshop", label: "Taller" },
  { value: "adventure", label: "Aventura" },
  { value: "wellness", label: "Bienestar" },
  { value: "cultural", label: "Cultural" },
  { value: "nightlife", label: "Vida nocturna" },
] as const satisfies readonly { value: ExperienceType; label: string }[];

export function experienceTypeLabel(type: string): string {
  return EXPERIENCE_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

const TYPE_VALUES = EXPERIENCE_TYPE_OPTIONS.map((o) => o.value) as [
  ExperienceType,
  ...ExperienceType[],
];

const reqInt = (min: number) =>
  z
    .number({ error: "Requerido" })
    .refine((n) => Number.isFinite(n) && Number.isInteger(n) && n >= min, {
      message: `Debe ser un entero ≥ ${min}`,
    });

const optInt = z
  .union([z.number().int().min(0).max(100000), z.nan()])
  .optional();

const schema = z
  .object({
    title: z.string().min(3, "Mínimo 3 caracteres").max(200),
    experience_type: z.enum(TYPE_VALUES),
    description: z.string().max(4000).optional(),
    duration_minutes: reqInt(1),
    price_cop: reqInt(0),
    min_participants: optInt,
    max_participants: optInt,
    meeting_point_address: z.string().max(500).optional(),
    cancellation_hours: z
      .union([z.number().int().min(0).max(720), z.nan()])
      .optional(),
    tags: z.string().optional(),
  })
  .refine(
    (v) => {
      const mn = v.min_participants;
      const mx = v.max_participants;
      if (mn == null || mx == null || Number.isNaN(mn) || Number.isNaN(mx))
        return true;
      return mx >= mn;
    },
    { message: "El máximo debe ser ≥ al mínimo", path: ["max_participants"] },
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  /** Required when creating; ignored when editing. */
  operatorPlaceId?: string;
  existing?: ExperienceDetail;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const textareaClass =
  "w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]";

export function ExperienceForm({
  operatorPlaceId,
  existing,
  onSuccess,
  onCancel,
}: Props) {
  const create = useCreateExperience();
  const update = useUpdateExperience(existing?.id ?? "");
  const isEdit = !!existing;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: existing?.title ?? "",
      experience_type: existing?.experience_type ?? "tour",
      description: existing?.description ?? "",
      duration_minutes: existing?.duration_minutes,
      price_cop: existing?.price_cop,
      min_participants: existing?.min_participants,
      max_participants: existing?.max_participants,
      meeting_point_address: existing?.meeting_point_address ?? "",
      cancellation_hours: existing?.cancellation_hours,
      tags: existing?.tags?.join(", ") ?? "",
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        experience_type: existing.experience_type,
        description: existing.description ?? "",
        duration_minutes: existing.duration_minutes,
        price_cop: existing.price_cop,
        min_participants: existing.min_participants,
        max_participants: existing.max_participants,
        meeting_point_address: existing.meeting_point_address ?? "",
        cancellation_hours: existing.cancellation_hours,
        tags: existing.tags?.join(", ") ?? "",
      });
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const optNum = (n?: number) =>
      n != null && !Number.isNaN(n) ? n : undefined;
    const common = {
      title: values.title,
      experience_type: values.experience_type,
      description: values.description?.trim() || undefined,
      duration_minutes: values.duration_minutes,
      price_cop: values.price_cop,
      min_participants: optNum(values.min_participants),
      max_participants: optNum(values.max_participants),
      meeting_point_address: values.meeting_point_address?.trim() || undefined,
      cancellation_hours: optNum(values.cancellation_hours),
      tags: values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
    };
    try {
      if (isEdit && existing) {
        await update.mutateAsync(common);
        toast.success("Experiencia actualizada");
      } else {
        if (!operatorPlaceId) {
          toast.error("No se encontró tu lugar operador");
          return;
        }
        await create.mutateAsync({
          operator_place_id: operatorPlaceId,
          ...common,
        });
        toast.success("Experiencia creada");
      }
      onSuccess?.();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo guardar");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field label="Título" htmlFor="title" error={errors.title?.message}>
        <Input
          id="title"
          placeholder="Tour gastronómico por el Centro"
          error={!!errors.title}
          {...register("title")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Tipo"
          htmlFor="experience_type"
          error={errors.experience_type?.message}
        >
          <select
            id="experience_type"
            className={textareaClass}
            {...register("experience_type")}
          >
            {EXPERIENCE_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Etiquetas (separadas por coma)"
          htmlFor="tags"
          error={errors.tags?.message}
        >
          <Input
            id="tags"
            placeholder="gastronómico, cultural"
            {...register("tags")}
          />
        </Field>
      </div>

      <Field
        label="Descripción"
        htmlFor="description"
        error={errors.description?.message}
      >
        <textarea
          id="description"
          rows={4}
          maxLength={4000}
          placeholder="¿Qué incluye la experiencia? ¿Qué la hace especial?"
          className={textareaClass + " resize-y"}
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Duración (minutos)"
          htmlFor="duration_minutes"
          error={errors.duration_minutes?.message}
        >
          <Input
            id="duration_minutes"
            type="number"
            min={1}
            placeholder="180"
            error={!!errors.duration_minutes}
            {...register("duration_minutes", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Precio por persona (COP)"
          htmlFor="price_cop"
          error={errors.price_cop?.message}
        >
          <Input
            id="price_cop"
            type="number"
            min={0}
            placeholder="80000"
            error={!!errors.price_cop}
            {...register("price_cop", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="Mín. participantes"
          htmlFor="min_participants"
          error={errors.min_participants?.message?.toString()}
        >
          <Input
            id="min_participants"
            type="number"
            min={1}
            placeholder="1"
            {...register("min_participants", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Máx. participantes"
          htmlFor="max_participants"
          error={errors.max_participants?.message?.toString()}
        >
          <Input
            id="max_participants"
            type="number"
            min={1}
            placeholder="10"
            {...register("max_participants", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Cancelación (horas antes)"
          htmlFor="cancellation_hours"
          error={errors.cancellation_hours?.message?.toString()}
        >
          <Input
            id="cancellation_hours"
            type="number"
            min={0}
            placeholder="24"
            {...register("cancellation_hours", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <Field
        label="Punto de encuentro"
        htmlFor="meeting_point_address"
        error={errors.meeting_point_address?.message}
      >
        <Input
          id="meeting_point_address"
          placeholder="Plaza de San Nicolás, Barranquilla"
          {...register("meeting_point_address")}
        />
      </Field>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button
          type="submit"
          loading={isSubmitting || create.isPending || update.isPending}
        >
          {isEdit ? "Guardar cambios" : "Crear experiencia"}
        </Button>
      </div>
    </form>
  );
}
