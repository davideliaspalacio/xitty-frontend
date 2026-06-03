import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Restablece tu contraseña · Xitty",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Restablece tu contraseña"
      subtitle="Ingresa el código que enviamos a tu correo y elige una nueva contraseña."
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
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
