"use client";

import { useState } from "react";

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

  // Start the geo heartbeat — internally no-ops when the user is not authed or
  // tracking is disabled.
  useGeoHeartbeat();

  const [chatOpen, setChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <AuthGate>
      <div className="min-h-screen flex bg-[var(--bg)]">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main
            style={{ maxWidth: "var(--container-max)" }}
            className="flex-1 px-4 py-5 sm:px-6 sm:py-8 md:px-10 w-full mx-auto pb-24 md:pb-10"
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
      <ChatBubble onClick={() => setChatOpen(true)} />
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
