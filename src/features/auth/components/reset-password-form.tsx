"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useResetPassword } from "@/features/auth/hooks/use-auth";
import { ApiError } from "@/lib/api/types";

const schema = z
  .object({
    email: z.string().email("Email inválido"),
    token: z.string().min(4, "Código demasiado corto"),
    new_password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Mínimo 6 caracteres"),
  })
  .refine((v) => v.new_password === v.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get("email") ?? "";
  const reset = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromQuery,
      token: "",
      new_password: "",
      confirm: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await reset.mutateAsync({
        email: values.email,
        token: values.token,
        new_password: values.new_password,
      });
      toast.success("Contraseña actualizada. Inicia sesión.");
      router.replace("/login");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Código inválido o expirado.",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          readOnly={!!emailFromQuery}
          {...register("email")}
        />
      </Field>

      <Field
        label="Código de verificación"
        htmlFor="token"
        error={errors.token?.message}
        hint="Lo enviamos a tu correo. Expira pronto."
      >
        <Input
          id="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          {...register("token")}
        />
      </Field>

      <Field
        label="Nueva contraseña"
        htmlFor="new_password"
        error={errors.new_password?.message}
      >
        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          {...register("new_password")}
        />
      </Field>

      <Field
        label="Confirma tu contraseña"
        htmlFor="confirm"
        error={errors.confirm?.message}
      >
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          {...register("confirm")}
        />
      </Field>

      <Button type="submit" size="lg" loading={isSubmitting || reset.isPending}>
        Actualizar contraseña
      </Button>
    </form>
  );
}
