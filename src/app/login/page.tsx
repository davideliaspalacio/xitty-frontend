import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Inicia sesión · Xitty" };

export default function LoginPage() {
  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Bienvenido de vuelta. Continúa explorando Barranquilla."
      footer={
        <div className="flex flex-col gap-2">
          <div>
            <Link
              href="/forgot-password"
              className="text-[var(--text)] underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div>
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-[var(--accent)] font-medium underline-offset-4 hover:underline"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
