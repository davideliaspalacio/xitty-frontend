import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = { title: "Recupera tu cuenta · Xitty" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recupera tu cuenta"
      subtitle="Ingresa tu email y te enviaremos un código para restablecer tu contraseña."
      footer={
        <div>
          <Link
            href="/login"
            className="text-[var(--accent)] font-medium underline-offset-4 hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
