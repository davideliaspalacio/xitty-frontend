"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useUpdateMe } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ApiError } from "@/lib/api/types";

const schema = z.object({
  full_name: z.string().min(2, "Tu nombre, por favor"),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileEditForm() {
  const user = useAuthStore((s) => s.user);
  const update = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync({
        full_name: values.full_name,
        phone: values.phone?.trim() ? values.phone.trim() : undefined,
      });
      toast.success("Datos actualizados");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "No se pudo actualizar.",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field label="Nombre completo" htmlFor="full_name" error={errors.full_name?.message}>
        <Input
          id="full_name"
          autoComplete="name"
          error={!!errors.full_name}
          {...register("full_name")}
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input id="email" type="email" value={user?.email ?? ""} readOnly disabled />
      </Field>

      <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
      </Field>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty}
          loading={isSubmitting || update.isPending}
        >
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
