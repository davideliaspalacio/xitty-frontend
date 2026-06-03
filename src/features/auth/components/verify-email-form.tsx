"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useVerifyEmail } from "@/features/auth/hooks/use-auth";
import { ApiError } from "@/lib/api/types";

const schema = z.object({
  email: z.string().email(),
  token: z
    .string()
    .min(4, "Código demasiado corto")
    .max(10, "Código demasiado largo"),
});

type FormValues = z.infer<typeof schema>;

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get("email") ?? "";
  const verify = useVerifyEmail();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromQuery, token: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await verify.mutateAsync(values);
      toast.success("Cuenta verificada");
      router.replace("/");
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : "Código inválido o expirado.";
      toast.error(msg);
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
        hint="Revisa tu correo. El código expira en 1 hora."
      >
        <Input
          id="token"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          error={!!errors.token}
          {...register("token")}
        />
      </Field>

      <Button type="submit" size="lg" loading={isSubmitting || verify.isPending}>
        Verificar email
      </Button>
    </form>
  );
}
