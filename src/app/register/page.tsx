import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Crear cuenta · Xitty" };

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Te enviaremos un código a tu correo para verificarte."
      footer={
        <div>
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-[var(--accent)] font-medium underline-offset-4 hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
