"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useRegister } from "@/features/auth/hooks/use-auth";
import { ApiError } from "@/lib/api/types";

const schema = z.object({
  full_name: z.string().min(2, "Tu nombre, por favor"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const register$ = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", password: "", phone: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      full_name: values.full_name,
      email: values.email,
      password: values.password,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
    };
    try {
      await register$.mutateAsync(payload);
      toast.success("Te enviamos un código a tu correo");
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : "No se pudo crear la cuenta. Intenta de nuevo.";
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        label="Nombre completo"
        htmlFor="full_name"
        error={errors.full_name?.message}
      >
        <Input
          id="full_name"
          autoComplete="name"
          placeholder="Tu nombre"
          error={!!errors.full_name}
          {...register("full_name")}
        />
      </Field>

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

      <Field
        label="Contraseña"
        htmlFor="password"
        error={errors.password?.message}
        hint="Mínimo 6 caracteres"
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register("password")}
        />
      </Field>

      <Field
        label="Teléfono (opcional)"
        htmlFor="phone"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+57 300 000 0000"
          {...register("phone")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting || register$.isPending}
      >
        Crear cuenta
      </Button>
    </form>
  );
}
