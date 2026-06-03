import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export const metadata: Metadata = { title: "Verifica tu correo · Xitty" };

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verifica tu correo"
      subtitle="Ingresa el código que enviamos a tu correo electrónico."
      footer={
        <div>
          ¿Email equivocado?{" "}
          <Link
            href="/register"
            className="text-[var(--accent)] font-medium underline-offset-4 hover:underline"
          >
            Volver a registro
          </Link>
        </div>
      }
    >
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
