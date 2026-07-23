"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { useRegister } from "@/features/auth/hooks/use-auth";
import { ApiError } from "@/lib/api/types";

const schema = z
  .object({
    full_name: z.string().min(2, "Tu nombre, por favor"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    password_confirm: z.string().min(6, "Confirma tu contraseña"),
    phone: z.string().optional(),
    accept_terms: z.boolean().refine((v) => v === true, {
      message: "Debes aceptar los términos y la política de privacidad",
    }),
  })
  .refine((d) => d.password === d.password_confirm, {
    path: ["password_confirm"],
    message: "Las contraseñas no coinciden",
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const register$ = useRegister();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirm: "",
      phone: "",
      accept_terms: false,
    },
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
        <div className="relative">
          <Input
            id="password"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            error={!!errors.password}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--text)]"
          >
            {showPwd ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </Field>

      <Field
        label="Confirmar contraseña"
        htmlFor="password_confirm"
        error={errors.password_confirm?.message}
      >
        <div className="relative">
          <Input
            id="password_confirm"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            error={!!errors.password_confirm}
            className="pr-10"
            {...register("password_confirm")}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--text)]"
          >
            {showPwd ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
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

      <div className="flex flex-col gap-1">
        <label
          htmlFor="accept_terms"
          className="flex items-start gap-2 text-sm text-[var(--text-muted)] cursor-pointer"
        >
          <input
            id="accept_terms"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            aria-invalid={errors.accept_terms ? true : undefined}
            {...register("accept_terms")}
          />
          <span>
            Acepto los{" "}
            <span className="font-medium text-[var(--text)]">
              Términos y Condiciones
            </span>{" "}
            y la{" "}
            <span className="font-medium text-[var(--text)]">
              Política de Privacidad
            </span>{" "}
            (Ley 1581 de 2012).
          </span>
        </label>
        {errors.accept_terms ? (
          <p className="text-xs font-medium text-[var(--danger)]">
            {errors.accept_terms.message}
          </p>
        ) : null}
      </div>

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
