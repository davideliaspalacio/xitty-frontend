"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { ProfileEditForm } from "@/features/auth/components/profile-edit-form";
import { PreferencesSummary } from "@/features/preferences/components/preferences-summary";
import { useProfileSummary } from "@/features/auth/hooks/use-profile-summary";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/store/auth-store";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: summary, isLoading } = useProfileSummary();
  const logout = useLogout();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const stats = [
    { label: "Lugares visitados", value: summary?.stats.places_visited ?? 0 },
    { label: "Rutas completadas", value: summary?.stats.routes_completed ?? 0 },
    { label: "Favoritos", value: summary?.stats.favorites_count ?? 0 },
    { label: "Reseñas escritas", value: summary?.stats.reviews_count ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <header className="flex flex-col gap-2">
        <p className="eyebrow">Mi cuenta</p>
        <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text)]">
          {user?.full_name ?? "Tu perfil"}
        </h1>
        <p className="text-[var(--text-muted)] text-[15px]">{user?.email}</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="px-5 py-4">
            <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            {isLoading ? (
              <Skeleton className="h-7 w-10 mt-1" />
            ) : (
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
            )}
          </Card>
        ))}
      </section>

      {/* Datos personales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Datos personales</CardTitle>
          <CardDescription>
            Actualiza tu nombre y teléfono. Tu email es la base de tu cuenta y
            no se puede cambiar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditForm />
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Mis preferencias</CardTitle>
          <CardDescription>
            Define cómo quieres viajar — esto alimenta las recomendaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesSummary />
        </CardContent>
      </Card>

      {/* Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cuenta</CardTitle>
          <CardDescription>
            Cierra tu sesión en este dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
