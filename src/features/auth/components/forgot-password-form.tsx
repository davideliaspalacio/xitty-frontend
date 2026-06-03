"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useForgotPassword } from "@/features/auth/hooks/use-auth";

const schema = z.object({ email: z.string().email("Email inválido") });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const forgot = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await forgot.mutateAsync(values);
    setSent(true);
    toast.success("Si el email existe, enviamos un código para restablecer.");
  });

  if (sent) {
    return (
      <div className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-5 text-sm text-[var(--text-muted)]">
        Si el email está registrado, recibirás un código para restablecer tu
        contraseña. Revisa también la carpeta de spam.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tunombre@ejemplo.com"
          error={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Button type="submit" size="lg" loading={isSubmitting || forgot.isPending}>
        Enviar código
      </Button>
    </form>
  );
}
