"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { Role } from "@/lib/api/types";

export function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-sm text-[var(--text-muted)]">
        Verificando permisos…
      </div>
    );
  }

  if (!user || !allow.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Acceso restringido</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Esta sección está reservada para cuentas de tipo{" "}
          <strong>{allow.join(" o ")}</strong>. Tu cuenta es de tipo{" "}
          <strong>{user?.role ?? "invitado"}</strong>.
        </p>
        <Link
          href="/"
          className="text-[var(--accent)] font-medium underline-offset-4 hover:underline"
        >
          Volver al inicio →
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
