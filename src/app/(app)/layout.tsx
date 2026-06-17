"use client";

import { useState } from "react";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { Sidebar } from "@/shared/layout/sidebar";
import { Topbar } from "@/shared/layout/topbar";
import { LocationBanner } from "@/features/geo/components/location-banner";
import { useGeoHeartbeat } from "@/features/geo/hooks/use-geo-heartbeat";
import { ChatBubble, ChatPanel } from "@/features/chat";
import { ContextToast } from "@/features/suggestions";

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
            className="flex-1 px-6 py-8 md:px-10 w-full mx-auto"
          >
            <LocationBanner />
            {children}
          </main>
        </div>
      </div>

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
    </AuthGate>
  );
}
