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
  useCreatePromotion,
  useUpdatePromotion,
} from "@/features/promotions";
import type { Promotion } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

const schema = z
  .object({
    title: z.string().min(2, "Mínimo 2 caracteres").max(200),
    description: z.string().max(2000).optional(),
    discount_percentage: z
      .union([z.number().int().min(0).max(100), z.nan()])
      .optional(),
    starts_at: z.string().min(1, "Requerido"),
    ends_at: z.string().min(1, "Requerido"),
    is_active: z.boolean(),
  })
  .refine((v) => new Date(v.ends_at) > new Date(v.starts_at), {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["ends_at"],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  placeId: string;
  existing?: Promotion;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function toLocalDate(iso?: string) {
  if (!iso) return "";
  // input[type=date] requires YYYY-MM-DD
  return iso.slice(0, 10);
}

export function PromotionForm({ placeId, existing, onSuccess, onCancel }: Props) {
  const create = useCreatePromotion(placeId);
  const update = useUpdatePromotion(placeId);
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
      description: existing?.description ?? "",
      discount_percentage: existing?.discount_percentage ?? undefined,
      starts_at: toLocalDate(existing?.starts_at) || toLocalDate(new Date().toISOString()),
      ends_at: toLocalDate(existing?.ends_at) || "",
      is_active: existing?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description ?? "",
        discount_percentage: existing.discount_percentage ?? undefined,
        starts_at: toLocalDate(existing.starts_at),
        ends_at: toLocalDate(existing.ends_at),
        is_active: existing.is_active,
      });
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      description: values.description?.trim() || undefined,
      discount_percentage:
        values.discount_percentage != null && !Number.isNaN(values.discount_percentage)
          ? values.discount_percentage
          : undefined,
      starts_at: new Date(values.starts_at + "T00:00:00").toISOString(),
      ends_at: new Date(values.ends_at + "T23:59:59").toISOString(),
      is_active: values.is_active,
    };
    try {
      if (isEdit && existing) {
        await update.mutateAsync({ id: existing.id, payload });
        toast.success("Promoción actualizada");
      } else {
        await create.mutateAsync(payload);
        toast.success("Promoción creada");
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
          placeholder="2x1 en pizzas los lunes"
          error={!!errors.title}
          {...register("title")}
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={3}
          maxLength={2000}
          placeholder="Detalles, condiciones, horarios…"
          className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] resize-y"
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="% descuento"
          htmlFor="discount"
          error={errors.discount_percentage?.message?.toString()}
        >
          <Input
            id="discount"
            type="number"
            min={0}
            max={100}
            placeholder="20"
            {...register("discount_percentage", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Inicio" htmlFor="starts_at" error={errors.starts_at?.message}>
          <Input id="starts_at" type="date" {...register("starts_at")} />
        </Field>
        <Field label="Fin" htmlFor="ends_at" error={errors.ends_at?.message}>
          <Input id="ends_at" type="date" {...register("ends_at")} />
        </Field>
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("is_active")}
          className="h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]/30"
        />
        Activa
      </label>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting || create.isPending || update.isPending}>
          {isEdit ? "Guardar cambios" : "Crear promoción"}
        </Button>
      </div>
    </form>
  );
}
