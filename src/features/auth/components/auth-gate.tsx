"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useMe } from "@/features/auth/hooks/use-auth";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

const EXEMPT_FROM_ONBOARDING = ["/onboarding"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);

  const { data: me, error: meError } = useMe(!!accessToken);
  const { data: prefs } = usePreferences(!!accessToken);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) {
      const next =
        pathname && pathname !== "/"
          ? `?next=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/login${next}`);
    }
  }, [hydrated, accessToken, pathname, router]);

  // Sync /me into store so Topbar/Sidebar always show fresh data
  useEffect(() => {
    if (me) setUser(me);
  }, [me, setUser]);

  // Send users without completed wizard to /onboarding (unless already there)
  useEffect(() => {
    if (!hydrated || !accessToken || !prefs || !pathname) return;
    const exempt = EXEMPT_FROM_ONBOARDING.includes(pathname);
    if (!prefs.wizard_completed && !exempt) {
      router.replace("/onboarding");
    }
  }, [hydrated, accessToken, prefs, pathname, router]);

  if (!hydrated || (!accessToken && hydrated)) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-[var(--text-muted)]">
        Cargando…
      </div>
    );
  }

  if (meError) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-[var(--text-muted)]">
        Sesión inválida — redirigiendo…
      </div>
    );
  }

  return <>{children}</>;
}
