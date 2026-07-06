"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { EmptyState } from "@/shared/ui/empty-state";
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
        <span role="status" aria-live="polite">
          Verificando permisos…
        </span>
      </div>
    );
  }

  if (!user || !allow.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md py-16" role="alert">
        <EmptyState
          icon={ShieldAlert}
          tone="danger"
          title="Acceso restringido"
          description={`Esta sección está reservada para cuentas de tipo ${allow.join(
            " o ",
          )}. Tu cuenta es de tipo ${user?.role ?? "invitado"}.`}
          action={
            <Link
              href="/home"
              className="inline-flex min-h-11 items-center justify-center rounded-pill bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-fg)] shadow-[0_3px_0_var(--ink)]"
            >
              Volver al inicio
            </Link>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
