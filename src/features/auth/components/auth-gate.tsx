"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useLogout, useMe } from "@/features/auth/hooks/use-auth";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

const EXEMPT_FROM_ONBOARDING = ["/onboarding"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useLogout();

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

  useEffect(() => {
    if (!meError) return;
    logout();
    router.replace("/login?reason=session_expired");
  }, [logout, meError, router]);

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
        <span role="status" aria-live="polite">
          Cargando…
        </span>
      </div>
    );
  }

  if (meError) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-[var(--text-muted)]">
        <span role="status" aria-live="assertive">
          Sesión inválida. Redirigiendo…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
