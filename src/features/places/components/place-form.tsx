"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useCategories } from "@/features/places/hooks/use-places";
import {
  useCreatePlace,
  useUpdatePlace,
} from "@/features/places/hooks/use-manage-place";
import { ApiError } from "@/lib/api/types";
import type {
  CreatePlacePayload,
  PlaceDetail,
  PriceRange,
} from "@/lib/api/types";

const optUrl = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^https?:\/\//i.test(v), "Debe empezar con http:// o https://");

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(200),
  category_id: z.string().optional(),
  description: z.string().max(2000).optional(),
  address: z.string().max(300).optional(),
  phone: z.string().max(40).optional(),
  website: optUrl,
  price_range: z.string().optional(),
  tags: z.string().optional(),
  cta_phone: z.string().max(40).optional(),
  cta_whatsapp: z.string().max(40).optional(),
  reservation_url: optUrl,
});

type FormValues = z.infer<typeof schema>;

const PRICE_OPTIONS = [
  { value: "", label: "Sin definir" },
  { value: "1", label: "$ — económico" },
  { value: "2", label: "$$ — moderado" },
  { value: "3", label: "$$$ — alto" },
  { value: "4", label: "$$$$ — premium" },
];

interface Props {
  existing?: PlaceDetail;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const textareaClass =
  "w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]";

export function PlaceForm({ existing, onSuccess, onCancel }: Props) {
  const categories = useCategories();
  const create = useCreatePlace();
  const update = useUpdatePlace(existing?.id ?? "");
  const isEdit = !!existing;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? "",
      category_id: existing?.category_id ?? "",
      description: existing?.description ?? "",
      address: existing?.address ?? "",
      phone: existing?.phone ?? "",
      website: existing?.website ?? "",
      price_range: existing?.price_range ? String(existing.price_range) : "",
      tags: existing?.tags?.join(", ") ?? "",
      cta_phone: existing?.cta_phone ?? "",
      cta_whatsapp: existing?.cta_whatsapp ?? "",
      reservation_url: existing?.reservation_url ?? "",
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        category_id: existing.category_id ?? "",
        description: existing.description ?? "",
        address: existing.address ?? "",
        phone: existing.phone ?? "",
        website: existing.website ?? "",
        price_range: existing.price_range ? String(existing.price_range) : "",
        tags: existing.tags?.join(", ") ?? "",
        cta_phone: existing.cta_phone ?? "",
        cta_whatsapp: existing.cta_whatsapp ?? "",
        reservation_url: existing.reservation_url ?? "",
      });
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const str = (s?: string) => (s && s.trim() ? s.trim() : undefined);
    const payload: CreatePlacePayload = {
      name: values.name,
      description: str(values.description),
      address: str(values.address),
      phone: str(values.phone),
      website: str(values.website),
      price_range: values.price_range
        ? (Number(values.price_range) as PriceRange)
        : undefined,
      category_id: values.category_id || undefined,
      tags: values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      cta_phone: str(values.cta_phone),
      cta_whatsapp: str(values.cta_whatsapp),
      reservation_url: str(values.reservation_url),
    };
    try {
      if (isEdit && existing) {
        await update.mutateAsync(payload);
        toast.success("Lugar actualizado");
      } else {
        await create.mutateAsync(payload);
        toast.success("Lugar creado");
      }
      onSuccess?.();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo guardar");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="La Trattoria"
            error={!!errors.name}
            {...register("name")}
          />
        </Field>
        <Field
          label="Categoría"
          htmlFor="category_id"
          error={errors.category_id?.message}
        >
          <select
            id="category_id"
            className={textareaClass}
            {...register("category_id")}
          >
            <option value="">Sin categoría</option>
            {(categories.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
          maxLength={2000}
          placeholder="Cuenta de qué se trata tu negocio…"
          className={textareaClass + " resize-y"}
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Dirección" htmlFor="address" error={errors.address?.message}>
          <Input
            id="address"
            placeholder="Cra 53 #70-110"
            {...register("address")}
          />
        </Field>
        <Field
          label="Rango de precio"
          htmlFor="price_range"
          error={errors.price_range?.message}
        >
          <select
            id="price_range"
            className={textareaClass}
            {...register("price_range")}
          >
            {PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Etiquetas (separadas por coma)"
        htmlFor="tags"
        error={errors.tags?.message}
      >
        <Input
          id="tags"
          placeholder="comida italiana, pizza, terraza"
          {...register("tags")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" placeholder="(605) 300 0000" {...register("phone")} />
        </Field>
        <Field label="Sitio web" htmlFor="website" error={errors.website?.message}>
          <Input
            id="website"
            placeholder="https://mi-negocio.com"
            error={!!errors.website}
            {...register("website")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="Tel. para llamar (CTA)"
          htmlFor="cta_phone"
          error={errors.cta_phone?.message}
        >
          <Input id="cta_phone" placeholder="+57 300 0000000" {...register("cta_phone")} />
        </Field>
        <Field
          label="WhatsApp (CTA)"
          htmlFor="cta_whatsapp"
          error={errors.cta_whatsapp?.message}
        >
          <Input
            id="cta_whatsapp"
            placeholder="+57 300 0000000"
            {...register("cta_whatsapp")}
          />
        </Field>
        <Field
          label="URL de reservas (CTA)"
          htmlFor="reservation_url"
          error={errors.reservation_url?.message}
        >
          <Input
            id="reservation_url"
            placeholder="https://…"
            error={!!errors.reservation_url}
            {...register("reservation_url")}
          />
        </Field>
      </div>

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
          {isEdit ? "Guardar cambios" : "Crear lugar"}
        </Button>
      </div>
    </form>
  );
}
