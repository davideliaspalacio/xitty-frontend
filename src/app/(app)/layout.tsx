"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { Sidebar } from "@/shared/layout/sidebar";
import { BottomNav } from "@/shared/layout/bottom-nav";
import { Topbar } from "@/shared/layout/topbar";
import { LocationBanner } from "@/features/geo/components/location-banner";
import { useGeoHeartbeat } from "@/features/geo/hooks/use-geo-heartbeat";
import { ChatBubble, ChatPanel } from "@/features/chat";
import { ContextToast } from "@/features/suggestions";
import { OnboardingTour } from "@/features/onboarding";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.user?.role) ?? "user";
  const pathname = usePathname() ?? "";
  const isOpsSurface =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // Start the geo heartbeat — internally no-ops when the user is not authed or
  // tracking is disabled.
  useGeoHeartbeat();

  const [chatOpen, setChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <AuthGate>
      <div className="flex min-h-screen bg-[var(--bg)]">
        <Sidebar role={role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main
            style={{ maxWidth: "var(--container-max)" }}
            className="mx-auto w-full flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-8 md:px-10 md:pb-10"
          >
            <LocationBanner />
            {children}
          </main>
        </div>
      </div>

      {/* Navegación inferior — solo mobile (reemplaza la sidebar oculta) */}
      <BottomNav role={role} />

      {/* Headless toast listener — fires sonner toasts when the user's
          safety-zone neighborhood changes. */}
      <ContextToast />

      {/* Floating chat FAB + panel, fixed bottom-right of the viewport. */}
      <ChatBubble
        onClick={() => setChatOpen(true)}
        className={isOpsSurface ? "max-md:hidden" : undefined}
      />
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        conversationId={conversationId}
        onConversationIdChange={setConversationId}
      />

      {/* Tour de bienvenida — auto-arranca para usuarios nuevos sobre el home. */}
      <OnboardingTour />
    </AuthGate>
  );
}
