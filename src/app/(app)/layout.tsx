"use client";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { Sidebar } from "@/shared/layout/sidebar";
import { Topbar } from "@/shared/layout/topbar";
import { LocationBanner } from "@/features/geo/components/location-banner";
import { useGeoHeartbeat } from "@/features/geo/hooks/use-geo-heartbeat";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.user?.role) ?? "user";

  // Start the geo heartbeat — internally no-ops when the user is not authed or
  // tracking is disabled.
  useGeoHeartbeat();

  return (
    <AuthGate>
      <div className="min-h-screen flex bg-[var(--bg)]">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main
            style={{ maxWidth: "var(--container-max)" }}
            className="flex-1 px-6 py-8 md:px-10 w-full mx-auto"
          >
            <LocationBanner />
            {children}
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
