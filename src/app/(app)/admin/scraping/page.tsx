"use client";

import { useState } from "react";
import { RoleGate } from "@/features/auth/components/role-gate";
import { cn } from "@/shared/utils/cn";
import { SourcesPanel } from "@/features/admin-scraping/components/sources-panel";
import { RunsHistory } from "@/features/admin-scraping/components/runs-history";
import { ModerationQueue } from "@/features/admin-scraping/components/moderation-queue";
import { useItems } from "@/features/admin-scraping/hooks/use-items";

type Tab = "sources" | "runs" | "moderation";

const TABS: { id: Tab; label: string }[] = [
  { id: "sources", label: "Sources" },
  { id: "runs", label: "Runs" },
  { id: "moderation", label: "Moderación" },
];

export default function AdminScrapingPage() {
  return (
    <RoleGate allow={["admin"]}>
      <AdminScrapingInner />
    </RoleGate>
  );
}

function AdminScrapingInner() {
  const [tab, setTab] = useState<Tab>("sources");
  // Pre-cargamos el count de pending para el badge de la tab Moderacion.
  const { data: pendingItems } = useItems({ status: "pending" });
  const pendingCount = pendingItems?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="eyebrow">Admin</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">
          Scraping & Moderación
        </h1>
        <p className="text-[var(--text-muted)] text-[15px] max-w-2xl">
          Configura las fuentes externas, mira el historial de runs y modera
          los items entrantes antes de publicarlos como places o experiences.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Secciones de scraping"
        className="flex gap-1 border-b border-[var(--border)]"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative h-10 px-4 text-sm font-medium transition-colors -mb-px",
              "border-b-2 border-transparent",
              tab === t.id
                ? "text-[var(--accent)] border-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]",
            )}
          >
            {t.label}
            {t.id === "moderation" && pendingCount > 0 ? (
              <span
                aria-label={`${pendingCount} pendientes`}
                className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-pill text-[10px] font-semibold bg-[var(--accent)] text-[var(--accent-fg)]"
              >
                {pendingCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <section role="tabpanel">
        {tab === "sources" && <SourcesPanel />}
        {tab === "runs" && <RunsHistory />}
        {tab === "moderation" && <ModerationQueue />}
      </section>
    </div>
  );
}
